# myapp/views.py

import json
import numpy as np
import cv2
from sklearn.metrics.pairwise import cosine_similarity
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Criminal
from .serializers import CriminalSerializer
from insightface.app import FaceAnalysis

# Initialize InsightFace model
face_model = FaceAnalysis()
face_model.prepare(ctx_id=-1)

class CriminalListCreateView(APIView):
    def get(self, request):
        criminals = Criminal.objects.all().order_by('-created_at')
        serializer = CriminalSerializer(criminals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CriminalSerializer(data=request.data)
        if serializer.is_valid():
            criminal = serializer.save()

            embeddings = []
            image_paths = [
                criminal.image_front.path,
                criminal.image_left.path,
                criminal.image_right.path
            ]

            for path in image_paths:
                img = cv2.imread(path)
                if img is not None:
                    faces = face_model.get(img)
                    if faces:
                        embeddings.append(faces[0].embedding)

            if embeddings:
                avg_embedding = np.mean(embeddings, axis=0)
                criminal.face_encoding = avg_embedding.tolist()
                criminal.save()
            else:
                return Response({'error': 'No face detected in any of the images'}, status=400)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FaceMatchView(APIView):
    def post(self, request):
        image = request.FILES.get('image')
        if not image:
            return Response({'error': 'Image is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Save temporarily
        image_path = default_storage.save(f'temp/{image.name}', image)
        image_full_path = default_storage.path(image_path)

        # Load and extract embedding from uploaded image
        uploaded_image = cv2.imread(image_full_path)
        faces = face_model.get(uploaded_image)

        if not faces:
            return Response({'error': 'No face found in uploaded image'}, status=400)

        uploaded_encoding = faces[0].embedding

        # Compare with stored embeddings
        criminals = Criminal.objects.exclude(face_encoding=None)
        for criminal in criminals:
            known_encoding = np.array(json.loads(criminal.face_encoding))
            similarity = cosine_similarity([known_encoding], [uploaded_encoding])[0][0]
            print(f"Comparing with {criminal.name}: similarity = {similarity}")
            if similarity > 0.6:  # You can adjust this threshold
                return Response({
                    "message": "Match found",
                    "criminal": {
                        "name": criminal.name,
                        "case_info": criminal.case_info,
                          "image": request.build_absolute_uri(criminal.image_front.url)
                    }
                })

        return Response({"message": "No match found"}, status=404)

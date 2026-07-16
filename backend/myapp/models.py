# myapp/models.py

from django.db import models
import os
import uuid
import json
import numpy as np
from insightface.app import FaceAnalysis
import cv2

# Initialize InsightFace (CPU mode)
face_model = FaceAnalysis()
face_model.prepare(ctx_id=-1)

# --- Utility Functions ---

def get_criminal_image_path_front(instance, filename):
    ext = filename.split('.')[-1]
    unique_id = uuid.uuid4().hex[:8]
    filename = f"{instance.name}_{unique_id}_front.{ext}"
    return os.path.join("criminal_images", filename)

def get_criminal_image_path_left(instance, filename):
    ext = filename.split('.')[-1]
    unique_id = uuid.uuid4().hex[:8]
    filename = f"{instance.name}_{unique_id}_left.{ext}"
    return os.path.join("criminal_images", filename)

def get_criminal_image_path_right(instance, filename):
    ext = filename.split('.')[-1]
    unique_id = uuid.uuid4().hex[:8]
    filename = f"{instance.name}_{unique_id}_right.{ext}"
    return os.path.join("criminal_images", filename)

def extract_face_encoding(image_path):
    try:
        image = cv2.imread(image_path)
        faces = face_model.get(image)
        if faces:
            return faces[0].embedding  # 512-d vector
    except Exception as e:
        print(f"Encoding error: {e}")
    return None

# --- Model ---

class Criminal(models.Model):
    name = models.CharField(max_length=100)
    case_info = models.TextField()

    image_front = models.ImageField(upload_to=get_criminal_image_path_front)
    image_left = models.ImageField(upload_to=get_criminal_image_path_left)
    image_right = models.ImageField(upload_to=get_criminal_image_path_right)
    image = models.ImageField(upload_to='temp/', default='temp/default.jpg')


    face_encoding = models.TextField(null=True, blank=True)  # JSON-encoded 512-d vector
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # Only extract if face_encoding is empty
        if self.image_front and not self.face_encoding:
            encoding = extract_face_encoding(self.image_front.path)
            print("Extracted encoding:", encoding)
            if encoding is not None:
                self.face_encoding = json.dumps(encoding.tolist())
                super().save(update_fields=['face_encoding'])


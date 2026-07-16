# myapp/urls.py
from django.urls import path
from .views import CriminalListCreateView, FaceMatchView

urlpatterns = [
    path('api/criminals/', CriminalListCreateView.as_view(), name='criminals'),
    path('api/check-face/', FaceMatchView.as_view(), name='check-face'),
]



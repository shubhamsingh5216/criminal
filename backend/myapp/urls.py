# myapp/urls.py
from django.urls import path
from .views import CriminalListCreateView, FaceMatchView, health

urlpatterns = [
    path('api/criminals/', CriminalListCreateView.as_view(), name='criminals'),
    path('api/health/', health, name='health'),
    path('api/check-face/', FaceMatchView.as_view(), name='check-face'),
]



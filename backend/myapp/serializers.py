# myapp/serializers.py
from rest_framework import serializers
from .models import Criminal

class CriminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criminal
        fields = '__all__'

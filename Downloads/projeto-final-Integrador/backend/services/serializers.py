from rest_framework import serializers
from .models import Category, Service

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    
    class Meta:
        model = Service
        fields = '__all__'
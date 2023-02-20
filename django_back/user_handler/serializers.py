from rest_framework import serializers
from .models import User


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password')


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    
    class Meta:
        model = User
        fields = ('password')
    
    def create(self, validated_data):
        return User.objects.get_or_create(**validated_data)
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import User
from .serializers import SignupSerializer, LoginSerializer
from .exceptions import CustomException



class SignupView(APIView):

    def get(self, request, format=None):

        user_info = User.objects.all()
        serializer = SignupSerializer(user_info, many=True)
    
        return JsonResponse(serializer.data, safe=False)


    def post(self, request, format=None):

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    


class LoginView(APIView):
    
    def post(self, request, format=None):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = request.data.get('username')
            password = request.data.get('password')

            # Query in User DB
            userQuery = User.objects.filter(username=username)
            passwordQuery = User.objects.filter(password=password)
            
            # Validation check
            if userQuery.exists() & passwordQuery.exists():
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                if not userQuery.exists():
                    error_detail = {"error": {"username": "User do not exist"}}
                    
                elif not passwordQuery.exists():
                    error_detail = {"error": {"password": "Wrong password"}}

                raise CustomException(error_detail, 401)
        
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
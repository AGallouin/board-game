from django.shortcuts import render
from django.http import JsonResponse, Http404
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


# Create your views here.
class SignupView(APIView):

    def get(self, request, format=None):

        user_info = User.objects.all()
        serializer = UserSerializer(user_info, many=True)
    
        return JsonResponse(serializer.data, safe=False)


    def post(self, request, format=None):

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    


class UserDetailView(APIView):
    
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk):

        user_info = self.get_object(pk)
        serializer = UserSerializer(user_info)

        return JsonResponse(serializer.data)
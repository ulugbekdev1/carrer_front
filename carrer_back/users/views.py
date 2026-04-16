from django.contrib.auth import get_user_model

from django.shortcuts import render
from rest_framework import generics
# from rest_framework.authtoken.admin import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken


from .serializers import CustomUserSerializer, AdminSerializer, UserSerializer
from .models import Admin
from rest_framework.permissions import IsAuthenticated as Isauthenticated
from .token import get_tokens_for_user
# Create your views here.


CustomUser = get_user_model()

class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(tokens)


class ListUsersView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [Isauthenticated,]
    

class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [Isauthenticated,]


class AdminRegisterView(generics.CreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        tokens = get_tokens_for_user(user)
        
        return Response(tokens)


# class ModeratorRegisterView(generics.CreateAPIView):
#     queryset = Moderator.objects.all()
#     serializer_class = ModeratorSerializer
#
#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#
#         tokens = get_tokens_for_user(user)
#
#         return Response(tokens)

class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        tokens = get_tokens_for_user(user)

        return Response(tokens)
    

class AdminListView(generics.ListAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [Isauthenticated,]
    
    
# class ModeratorListView(generics.ListAPIView):
#     queryset = Moderator.objects.all()
#     serializer_class = ModeratorSerializer
#     permission_classes = [Isauthenticated,]


class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [Isauthenticated,]

    
class AdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [Isauthenticated,]
    

# class ModeratorDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Moderator.objects.all()
#     serializer_class = ModeratorSerializer
#     permission_classes = [Isauthenticated,]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [Isauthenticated,]
    
# # views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import CustomTokenObtainPairSerializer
#
# class CustomTokenObtainPairView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = CustomTokenObtainPairSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         return Response(serializer.validated_data, status=status.HTTP_200_OK)

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


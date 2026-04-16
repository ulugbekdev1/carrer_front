from rest_framework import serializers
from .models import Admin
from django.contrib.auth import get_user_model
CustomUser = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    

class AdminSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number')
    password = serializers.CharField(source='user.password')
    
    class Meta:
        model = Admin
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'password')
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomUser.objects.create_user(**user_data)
        admin = Admin.objects.create(user=user, **validated_data)
        return admin
    

# class ModeratorSerializer(serializers.ModelSerializer):
#     first_name = serializers.CharField(source='user.first_name')
#     last_name = serializers.CharField(source='user.last_name')
#     email = serializers.CharField(source='user.email')
#     phone_number = serializers.CharField(source='user.phone_number')
#     password = serializers.CharField(source='user.password')
#
#     class Meta:
#         model = Moderator
#         fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'password')
#         extra_kwargs = {'password': {'write_only': True}}
#
#     def create(self, validated_data):
#         user_data = validated_data.pop('user')
#         user = CustomUser.objects.create_user(**user_data)
#         moderator = Moderator.objects.create(user=user, **validated_data)
#         return moderator
#
#
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


    # def create(self, validated_data):
    #     user_data = validated_data.pop('user')
    #     user = CustomUser.objects.create_user(**user_data)
    #     user = CustomUser.objects.create(user=user, **validated_data)
    #     return user
#
    
# serializers.py
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid credentials')

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.get_role(),
            'user_id': user.id,
        }


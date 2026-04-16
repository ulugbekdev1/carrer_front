from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    ROLE_CHOICES = [
        ('student', "o'quvchi"),
        ('cadet', 'kursant'),
        ('admin', 'admin')
    ]
    # is_admin = models.BooleanField(default=False)
    # is_superadmin = models.BooleanField(default=False)
    # is_staff = models.BooleanField(default=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    objects = CustomUserManager()

    def get_role(self):
        return self.role

    def __str__(self):
        return self.email

    def get_user_id(self):
        return self.id


class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=True)
    is_superadmin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)

    def __str__(self):
        return self.user.email

    def get_user_id(self):
        return self.id

    def get_role(self):
        return 'admin'

# class Moderator(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
#     is_admin = models.BooleanField(default=False)
#     is_superadmin = models.BooleanField(default=False)
#     is_staff = models.BooleanField(default=True)
#
#     def __str__(self):
#         return self.user.email
#
#     def get_user_id(self):
#         return self.id
#
#     def get_role(self):
#         return 'moderator'

# class User(models.Model):
#
#     def __str__(self):
#         return self.user.email
#
#     def get_user_id(self):
#         return self.id
#
#     def get_role(self):
#         return self.role

from django.db import models
from users.models import CustomUser
# Create your models here.


class Text(models.Model):
    system = models.TextField()
    text = models.TextField(blank=True, null=True)
    text2 = models.TextField(blank=True, null=True)

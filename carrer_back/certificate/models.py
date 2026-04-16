from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.template.defaultfilters import title

User = get_user_model()
# from django_ckeditor_5.views import upload_file


# Create your models here.

class Certificate(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    url = models.FileField(upload_to='certificates/', blank=True, null=True)
    code = models.CharField(max_length=10, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.code:
            # Har safar yangi va noyob code generatsiya qiladi (10 belgili)
            self.code = uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('pdf/<int:pk>', views.certificate, name='generate_pdf'),
    path('pdf1', views.pdf, name='pdf')
]
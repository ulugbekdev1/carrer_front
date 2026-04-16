from django.db import models

from certificate.models import Certificate
from users.models import CustomUser
# from django_ckeditor_5.fields import CKEditor5Field
from ckeditor.fields import RichTextField
# from rest_framework.authtoken.admin import User
# from django.contrib.auth.models import User

# Create your models here.


class Careers(models.Model):
    name = models.TextField()
    info = models.TextField()
    image = models.FileField(upload_to='careers', blank=True, null=True)

    def __str__(self):
        return self.name


class Question(models.Model):
    # SpecializeChoice = [
    #     ('1', 'Aloqa qo‘shinlar'),
    #     ('2', 'Axborotlarni kriptografik himoyalash va maxsus aloqa'),
    #     ('3', 'Axborot texnologiyalari va dasturiy injiniring'),
    #     ('4', 'Radioelektron razvedka va kurash'),
    #     ('5', 'Havo hujumidan mudofaa radiotexnika qo‘shinlar'),
    #     ('6', 'Havo hujumidan mudofaa zenit-raketa qo‘shinlar'),
    #     ('7', 'Tmoq va axborot tizimlari xavfsizligi'),
    #     ('8', 'DXX chegara qo‘shinlari (intellektual tizimlar'),
    # ]
    # specialize = models.CharField(max_length=10, choices=SpecializeChoice, default='1')
    question = models.CharField(max_length=200)

    def __str__(self):
        return self.question


class Options(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    A_B_option = models.CharField(max_length=100)

    def __str__(self):
        return self.A_B_option

class Category(models.Model):
    name = models.CharField(max_length=200)
    number_of_tests = models.IntegerField()
    time = models.IntegerField()

    def __str__(self):
        return self.name


class CareerTest(models.Model):
    name = models.CharField(max_length=100)
    type = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class CareerTestItem(models.Model):
    test = models.ForeignKey(CareerTest, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    career = models.ForeignKey(Careers, on_delete=models.CASCADE, blank=True, null=True)


class CareerTestResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    test = models.ForeignKey(CareerTest, on_delete=models.CASCADE)
    career = models.ForeignKey(Careers, on_delete=models.CASCADE, blank=True, null=True)
    answer = models.TextField(blank=True, null=True)
    ai_analysis = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.email}, {self.test.name}"


class RoadMaps(models.Model):
    careers_id = models.ForeignKey(Careers, on_delete=models.CASCADE, related_name='roadmaps_set')
    name = models.CharField(max_length=200)
    head = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    

class Body(models.Model):
    name = models.CharField(max_length=200)
    url = models.URLField()
    roadmaps_id = models.ForeignKey(RoadMaps, on_delete=models.CASCADE, related_name='body_set')

    def __str__(self):  
        return self.name


class Type(models.Model):
    name = models.CharField(max_length=200)
    number_of_tests = models.IntegerField()
    time = models.IntegerField()

    def __str__(self):
        return self.name


class Test(models.Model):
    name = models.CharField(max_length=100)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class TestItem(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)


class TestResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    answer = models.TextField(blank=True, null=True)
    ai_analysis = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.user.email}, {self.test.name}"


class Course(models.Model):
    name = models.TextField()
    info = models.TextField()
    image = models.FileField(upload_to='course', blank=True, null=True)

    def __str__(self):
        return self.name


class Lesson(models.Model):
    title = models.CharField(max_length=200)
    content = RichTextField()
    video_url = models.FileField(max_length=100, upload_to="lesson_videos/")
    file_url = models.FileField(max_length=100, upload_to='lessons/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class DoneCourse(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    points = models.PositiveIntegerField()
    end_course = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.course.name} , {self.points} ta dars, {self.user.email}"


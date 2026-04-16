from django.contrib import admin
from .models import Options, Question, Type, Test, Careers, RoadMaps, Body, TestItem, TestResult, Lesson, \
    DoneCourse, Course, CareerTestItem, CareerTest, CareerTestResult, Category

# Register your models here.
admin.site.register(Options)
admin.site.register(Question)
admin.site.register(Type)
admin.site.register(Test)
admin.site.register(Careers)
admin.site.register(RoadMaps)
admin.site.register(Body)
admin.site.register(TestItem)
admin.site.register(TestResult)

admin.site.register(Lesson)
admin.site.register(DoneCourse)
admin.site.register(Course)
admin.site.register(CareerTestItem)
admin.site.register(CareerTest)
admin.site.register(CareerTestResult)
admin.site.register(Category)
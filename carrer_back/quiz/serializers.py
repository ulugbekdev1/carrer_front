from rest_framework import serializers

from ai.ai import chatbot_first
from ai.models import Text
from users.serializers import UserSerializer
from .models import Options, Question, Type, Test, Careers, RoadMaps, \
    Body, TestItem, TestResult, Lesson, DoneCourse, Course, CareerTestItem, CareerTestResult

from django.contrib.auth import get_user_model
User = get_user_model()

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class OptionsSerializer(serializers.ModelSerializer):
    # question = QuestionSerializer()
    class Meta:
        model = Options
        fields = ['id', 'A_B_option']

class QuestionsOptionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()
    class Meta:
        model = Question
        fields = ['id', 'question', 'options']

    def get_options(self, obj):
        options = Options.objects.filter(question=obj)
        return OptionsSerializer(options, many=True).data

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'

class TestSerializer(serializers.ModelSerializer):
    type = TypeSerializer()
    class Meta:
        model = Test
        fields = '__all__'

class CareersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Careers
        fields = '__all__'


class RoadMapsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadMaps
        fields = '__all__'


class BodySerializer(serializers.ModelSerializer):
    class Meta:
        model = Body
        fields = '__all__'

class CareerTestItemSerializer(serializers.ModelSerializer):
    test = TestSerializer(read_only=True, many=False)
    career = CareersSerializer(read_only=True, many=False)
    question = QuestionsOptionSerializer(read_only=True, many=False)
    class Meta:
        model = CareerTestItem
        fields = '__all__'

class TestItemSerializer(serializers.ModelSerializer):
    test = TestSerializer(read_only=True, many=False)
    question = QuestionsOptionSerializer(read_only=True, many=False)
    class Meta:
        model = TestItem
        fields = '__all__'

class CareerTestResultSerializer(serializers.ModelSerializer):
    career = CareersSerializer(read_only=True, many=False)
    user = UserSerializer(read_only=True, many=False)
    class Meta:
        model = CareerTestResult
        fields = '__all__'

class TestResultSerializer(serializers.ModelSerializer):
    test = TestSerializer(read_only=True, many=False)
    user = UserSerializer(read_only=True, many=False)
    class Meta:
        model = TestResult
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class DoneCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True, many=False)
    user = UserSerializer(read_only=True, many=False)
    class Meta:
        model = DoneCourse
        fields = '__all__'

class DoneCoursePOSTSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), write_only=True, source='course'
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='user'
    )

    class Meta:
        model = DoneCourse
        fields = ['id', 'course', 'user', 'points', 'end_course', 'course_id', 'user_id']


# class TestResultPOSTSerializer(serializers.ModelSerializer):
#     test = TestSerializer(read_only=True, many=False)
#     user = UserSerializer(read_only=True, many=False)
#     class Meta:
#         model = TestResult
#         fields = '__all__'
#
#     def save(self, **kwargs):
#         ai_analysis = chatbot_first(self.answer, Text.objects.all()[0])






class DashboardSerializer(serializers.Serializer):
    users = UserSerializer(read_only=True, many=False)
    courses = CourseSerializer(read_only=True, many=False)
    careers = CareersSerializer(read_only=True, many=False)
    lessons = LessonSerializer(read_only=True, many=False)
    donecourses = DoneCourseSerializer(read_only=True, many=False)
    types = TypeSerializer(read_only=True, many=False)
    tests = TestSerializer(read_only=True, many=False)
    test_results = TestResultSerializer(read_only=True, many=False)








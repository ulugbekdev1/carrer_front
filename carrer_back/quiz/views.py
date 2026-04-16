from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework.views import APIView

from users.serializers import UserSerializer, CustomUser
from .models import Options, Question, Type, Test, Careers, RoadMaps, Body, TestItem, TestResult, Lesson, Course, \
    DoneCourse, CareerTest, CareerTestResult, CareerTestItem
from .serializers import OptionsSerializer, QuestionSerializer, TypeSerializer, TestSerializer, CareersSerializer, \
    RoadMapsSerializer, BodySerializer, CareerTestItemSerializer, LessonSerializer, CourseSerializer, \
    DoneCourseSerializer, \
    DoneCoursePOSTSerializer, TestResultSerializer, TestItemSerializer, CareerTestResultSerializer, DashboardSerializer
from rest_framework import generics, viewsets
from rest_framework import permissions
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import TestResult, Test
from .serializers import TestResultSerializer
from ai.ai import chatbot_first

User = get_user_model()


class OptionsListView(generics.ListCreateAPIView):
    queryset = Options.objects.all()
    serializer_class = OptionsSerializer
    permission_classes = [permissions.IsAuthenticated]

class OptionsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Options.objects.all()
    serializer_class = OptionsSerializer   
    permission_classes = [permissions.IsAuthenticated]

class QuestionListView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class TypeListView(generics.ListCreateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class TypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class TestListView(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]


class TestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]


class CareersListView(generics.ListCreateAPIView):
    queryset = Careers.objects.all()
    serializer_class = CareersSerializer
    permission_classes = [permissions.IsAuthenticated]


class CareersDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Careers.objects.all()
    serializer_class = CareersSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoadMapsListView(generics.ListCreateAPIView):
    queryset = RoadMaps.objects.all()
    serializer_class = RoadMapsSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoadMapsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoadMaps.objects.all()
    serializer_class = RoadMapsSerializer
    permission_classes = [permissions.IsAuthenticated]


class BodyListView(generics.ListCreateAPIView):
    queryset = Body.objects.all()
    serializer_class = BodySerializer
    permission_classes = [permissions.IsAuthenticated]


class BodyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Body.objects.all()
    serializer_class = BodySerializer
    permission_classes = [permissions.IsAuthenticated]

class TestItemListView(generics.ListCreateAPIView):
    queryset = TestItem.objects.all()
    serializer_class = TestItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class TestItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TestItem.objects.all()
    serializer_class = TestItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class TestItemCreateView(generics.ListCreateAPIView):
    queryset = TestItem.objects.all()
    serializer_class = TestItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class TestResultView(generics.ListCreateAPIView):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    # def get(self, request, *args, **kwargs):
    #     user = self.request.user
    #     test_id = request.data.get('test_id')
    #     try:
    #         test_result_data = TestResult.objects.filter(test_id=test_id, user_id=user.id)
    #     except TestResult.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)
    #     print(test_result_data)
    #     return Response({TestResultSerializer(test_result_data).data}, status=status.HTTP_200_OK)

# class TestResultListCreateAPIView(generics.ListCreateAPIView):
#     serializer_class = TestResultSerializer
#
#     def get_queryset(self):
#         test = self.request.query_params.get('test')
#         user = self.request.user
#         queryset = TestResult.objects.filter(user=user)
#         if test:
#             queryset = queryset.filter(test=test)
#         return queryset
#
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)












class CareerTestItemCareersListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CareerTestItemSerializer
    def get(self, request):
        test_id = request.data.get('test_id')
        career_id = request.data.get('career_id')
        try:
            queryset = CareerTestItem.objects.filter(test_id=test_id, career_id=career_id)
            return Response(CareerTestItemSerializer(queryset, many=True).data, status=status.HTTP_200_OK)
        except TestItem.DoesNotExist as e:
            return Response({'error': 'Bad requests'}, status=status.HTTP_400_BAD_REQUEST)


class AnalyzeTestResultAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TestResultSerializer
    def post(self, request):
        user = request.user
        test_id = request.data.get('test_id')
        # test_id = 2
        answer = request.data.get('answer')
        print(test_id)
        # Test mavjudligini tekshiramiz
        try:
            test = Test.objects.get(id=test_id)
        except Test.DoesNotExist:
            return Response({"error": "Test topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        # AI orqali tahlil qilish
        try:
            ai_analysis = chatbot_first(answer)
        except Exception as e:
            return Response({"error": f"AI xatoligi: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Natijani saqlash
        result = TestResult.objects.create(
            user=user,
            test=test,
            answer=answer,
            ai_analysis=ai_analysis
        )

        serializer = TestResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnalyzeCareerTestResultAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CareerTestResultSerializer
    def post(self, request):
        user = request.user
        test_id = request.data.get('test_id')
        career_id = request.data.get('career_id')
        answer = request.data.get('answer')

        # Test mavjudligini tekshiramiz
        try:
            test = CareerTest.objects.get(id=test_id)
        except CareerTest.DoesNotExist:
            return Response({"error": "Test topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        try:
            career = Careers.objects.get(id=career_id)
        except Careers.DoesNotExist:
            return Response({'error': 'Career not found'}, status=status.HTTP_404_NOT_FOUND)

        # AI orqali tahlil qilish
        try:
            ai_analysis = chatbot_first(answer)
        except Exception as e:
            return Response({"error": f"AI xatoligi: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        # Natijani saqlash
        result = CareerTestResult.objects.create(
            user=user,
            test=test,
            answer=answer,
            ai_analysis=ai_analysis,
            career=career
        )
        serializer = CareerTestResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LessonListCreateAPIView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

# Lessons
class LessonRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class DoneCourseListCreateAPIView(generics.ListCreateAPIView):
    queryset = DoneCourse.objects.all()
    serializer_class = DoneCoursePOSTSerializer


# Done Careers
class DoneCourseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DoneCourse.objects.all()
    serializer_class = DoneCourseSerializer


class CourseListCreateAPIView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer




class DashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            courses = Course.objects.all()
            users = CustomUser.objects.all()
            donecourses = DoneCourse.objects.all()
            types = Type.objects.all()
            lessons = Lesson.objects.all()
            tests = Test.objects.all()
            test_results = TestResult.objects.all()
            careers = Careers.objects.all()
        except Exception as e:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        users_data = UserSerializer(users, many=True).data
        donecourses_data = DoneCourseSerializer(donecourses, many=True).data
        lessons_data = LessonSerializer(lessons, many=True).data
        test_results_data = TestResultSerializer(test_results, many=True).data
        careers_data = CareersSerializer(careers, many=True).data
        tests_data = TestSerializer(tests, many=True).data
        courses_data = CourseSerializer(courses, many=True).data
        types_data = TypeSerializer(types, many=True).data

        data = {
            "users": users_data,
            "donecourses": donecourses_data,
            "lessons": lessons_data,
            "test_results": test_results_data,
            "careers": careers_data,
            "tests": tests_data,
            "courses": courses_data,
            "types": types_data,
        }

        return Response(data, status=status.HTTP_200_OK)

























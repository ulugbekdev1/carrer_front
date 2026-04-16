import json

from django.contrib.messages.constants import SUCCESS
from rest_framework import status
from rest_framework.response import Response

from quiz.models import Test, TestItem, Question, Options
from rest_framework.views import APIView


class AddTestAPIView(APIView):

    def post(self, request, *args, **kwargs):
        # 1. JSON faylni ochish
        test_id = request.data.get('test_id')
        write_test(test_id)
        return Response({'success': True}, status=status.HTTP_200_OK)



def write_test(test_id):

    with open("quiz/test.json", "r", encoding="utf-8") as file:
        data_list = json.load(file)

    # 2. Test obyektini olish (oldindan mavjud bo'lishi kerak)
    try:
        try:
            test_obj = Test.objects.get(id=test_id)  # yoki id bilan: Test.objects.get(id=1)
        except Test.DoesNotExist:
            return Response({'success': False, 'message': "Test doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
        # 3. Har bir savolni qo‘shish
        for item in data_list:
            # Savolni yaratish
            question_obj = Question.objects.create(
                question=item["question"]
            )
            print(data_list)
            print('question_obj: ', question_obj)
            # Variantlarni qo‘shish
            for opt in item["options"]:
                Options.objects.create(
                    question=question_obj,
                    A_B_option=opt
                )
            # TestItem orqali testga bog’lash
            TestItem.objects.create(
                test=test_obj,
                question=question_obj
            )
    except Exception as e:
        raise Exception('Data is incorrect!!!')




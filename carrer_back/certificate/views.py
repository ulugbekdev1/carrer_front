# import os
# import json
# from django.http import HttpResponse, JsonResponse
# from django.shortcuts import render
# from django.template.loader import get_template
# from django.conf import settings
# from pyhtml2pdf import converter
# from django.template import TemplateDoesNotExist
# from django.views.decorators.csrf import csrf_exempt
# from users.models import User, CustomUser
# from django.shortcuts import render
#
# @csrf_exempt
# def certificate(request, pk):
#     try:
#         user = CustomUser.objects.filter(id=pk).first()
#         user_name = user.first_name
#         user_surname = user.last_name
#         template = get_template('certificate/pdf.html')
#         context = {'ism': user_name, 'familya': user_surname}
#         html = template.render(context)
#         return HttpResponse(html)
#     except User.DoesNotExist:
#         return HttpResponse(status=404)
#
#
# @csrf_exempt
# def pdf(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         user_id = data.get("user_id")
#
#         user = CustomUser.objects.filter(id=user_id).first()
#         if not user:
#             return JsonResponse({'error': 'User not found'}, status=404)
#
#         user_name = user.first_name
#         user_surname = user.last_name
#
#         pdf_url = f'http://197.181.1.246:8000/api/pdf/{user_id}'
#         pdf_filename = f'{user_name}{user_surname}.pdf'
#         pdf_filepath = os.path.join(settings.MEDIA_ROOT, 'certificate', pdf_filename)
#
#
#         os.makedirs(os.path.dirname(pdf_filepath), exist_ok=True)
#
#         # Generate pdf
#         converter.convert(pdf_url, pdf_filepath)
#
#         return JsonResponse({'message': 'PDF generated successfully!', 'pdf_url': f'{settings.MEDIA_URL}certificate/{pdf_filename}'})
#     else:
#         return HttpResponse(status=405)
#

# import os
# import json
# import pdfkit
# from django.http import HttpResponse, JsonResponse
# from django.template.loader import get_template
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from users.models import CustomUser
#
# @csrf_exempt
# def certificate(request, pk):
#     try:
#         user = CustomUser.objects.filter(id=pk).first()
#         if not user:
#             return HttpResponse(status=404)
#
#         user_name = user.first_name
#         user_surname = user.last_name
#         template = get_template('certificate/pdf.html')
#         context = {'ism': user_name, 'familya': user_surname}
#         html = template.render(context)
#         return HttpResponse(html)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)
#
# @csrf_exempt
# def pdf(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             user_id = data.get("user_id")
#
#             user = CustomUser.objects.filter(id=user_id).first()
#             if not user:
#                 return JsonResponse({'error': 'User not found'}, status=404)
#
#             user_name = user.first_name
#             user_surname = user.last_name
#
#             template = get_template('certificate/pdf.html')
#             context = {'ism': user_name, 'familya': user_surname}
#             html = template.render(context)
#
#             # Fayl yo‘li
#             pdf_filename = f'{user_name}{user_surname}.pdf'
#             pdf_filepath = os.path.join(settings.MEDIA_ROOT, 'certificate', pdf_filename)
#             os.makedirs(os.path.dirname(pdf_filepath), exist_ok=True)
#
#             # PDF yaratish
#             pdfkit.from_string(html, pdf_filepath, options={
#                 'enable-local-file-access': None,
#                 'encoding': "UTF-8",
#             })
#
#             return JsonResponse({
#                 'message': 'PDF generated successfully!',
#                 'pdf_url': f'{settings.MEDIA_URL}certificate/{pdf_filename}'
#             })
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return HttpResponse(status=405)

import os
import json
import uuid
import pdfkit
from django.http import HttpResponse, JsonResponse
from django.template.loader import get_template
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from users.models import CustomUser
from .models import Certificate  # agar shu appda bo‘lsa

@csrf_exempt
def certificate(request, pk):
    try:
        user = CustomUser.objects.filter(id=pk).first()
        if not user:
            return HttpResponse(status=404)

        context = {'ism': user.first_name, 'familya': user.last_name}
        template = get_template('certificate/pdf.html')
        html = template.render(context)
        return HttpResponse(html)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def pdf(request):
    if request.method != 'POST':
        return HttpResponse(status=405)

    try:
        data = json.loads(request.body)
        user_id = data.get("user_id")
        if not user_id:
            return JsonResponse({'error': 'user_id is required'}, status=400)

        user = CustomUser.objects.filter(id=user_id).first()
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)

        context = {'ism': user.first_name, 'familya': user.last_name}
        template = get_template('certificate/pdf.html')
        html = template.render(context)

        # Fayl nomini yaratish
        filename = f"{uuid.uuid4().hex}.pdf"
        pdf_dir = os.path.join(settings.MEDIA_ROOT, 'certificates')
        os.makedirs(pdf_dir, exist_ok=True)
        filepath = os.path.join(pdf_dir, filename)

        # PDF yaratish
        pdfkit.from_string(html, filepath, options={
            'enable-local-file-access': None,
            'encoding': "UTF-8",
        })

        # Sertifikat modelini saqlash
        cert = Certificate.objects.create(
            title="Test Certificate",
            user=user,
            url=f'certificates/{filename}'
        )

        return JsonResponse({
            'message': 'PDF generated successfully!',
            'pdf_url': f'{settings.MEDIA_URL}{cert.url}',
            'code': cert.code
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

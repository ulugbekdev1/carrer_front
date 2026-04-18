from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),

    # API
    path('api/quiz/', include('quiz.urls')),
    path('api/users/', include('users.urls')),
    path('api/certificate/', include('certificate.urls')),

    # AUTH
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # DOCS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema')),

    # FRONTEND (React catch-all)
    re_path(r'^(?!api/|admin/|static/|media/).*$',
            TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
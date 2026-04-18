urlpatterns = [
    path('admin/', admin.site.urls),

    # 🟢 API APPS (TO‘G‘RI STRUCTURE)
    path('api/quiz/', include('quiz.urls')),
    path('api/users/', include('users.urls')),
    path('api/certificate/', include('certificate.urls')),

    # 🔐 AUTH
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 📄 DOCS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema')),

    # ⚛️ FRONTEND
]
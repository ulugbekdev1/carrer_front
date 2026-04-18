from django.urls import path
from django.http import JsonResponse

from .views import (
    RegisterUserView,
    ListUsersView,
    AdminRegisterView,
    CustomTokenObtainPairView,
    UserRegisterView,
    AdminListView,
    UserListView,
    CustomUserDetailView,
    AdminDetailView,
    UserDetailView,
)

# 🏠 API root test
def home(request):
    return JsonResponse({"status": "API is working"})


urlpatterns = [
    # 🏠 ROOT
    path("", home),

    # 🔐 AUTH
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("register/", RegisterUserView.as_view(), name="register"),

    # 👤 USERS
    path("users/", UserListView.as_view(), name="user_list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user_detail"),
    path("user/register/", UserRegisterView.as_view(), name="user_register"),

    # 🛡 ADMIN
    path("admins/", AdminListView.as_view(), name="admin_list"),
    path("admins/<int:pk>/", AdminDetailView.as_view(), name="admin_detail"),
    path("admin/register/", AdminRegisterView.as_view(), name="admin_register"),

    # 📦 EXTRA
    path("register-users/", ListUsersView.as_view(), name="register_users"),
    path("register-users/<int:pk>/", CustomUserDetailView.as_view(), name="register_user_detail"),
]
from django.urls import path
from .views import RegisterUserView, ListUsersView, AdminRegisterView, CustomTokenObtainPairView, UserRegisterView, AdminListView, UserListView, CustomUserDetailView, AdminDetailView, UserDetailView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('register/users', ListUsersView.as_view(), name='users'),
    path('admin/register/', AdminRegisterView.as_view(), name='admin_register'),
    # path('moderator/register/', ModeratorRegisterView.as_view(), name='moderator_register'),
    path('user/register/', UserRegisterView.as_view(), name='user_register'),
    path('admin/', AdminListView.as_view(), name='admin_list'),
    # path('moderator/', ModeratorListView.as_view(), name='moderator_list'),
    path('user/', UserListView.as_view(), name='user_list'),
    path('register/users/<int:pk>/', CustomUserDetailView.as_view(), name='user_detail'),
    path('admin/<int:pk>/', AdminDetailView.as_view(), name='admin_detail'),
    # path('moderator/<int:pk>/', ModeratorDetailView.as_view(), name='moderator_detail'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    # path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
]

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


def get_tokens_for_user(user1):
    refresh = RefreshToken.for_user(user1)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'role': user1.get_role(),
        'id': user1.get_id()
    }


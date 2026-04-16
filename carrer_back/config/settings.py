from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / 'templates'
REACT_BUILD_DIR = BASE_DIR.parent / 'build'

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-ojwi&_ut_7p%5)qs7+)uigshlosn(4wcqvq(_2ch7#j@#o@^dn')

DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ["37.140.216.113"]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'quiz.apps.QuizConfig',
    'users.apps.UsersConfig',
    'ai.apps.AiConfig',
    'corsheaders',
    'drf_spectacular',
    'certificate.apps.CertificateConfig',
    'easy_pdf',
    'django_ckeditor_5',
    'ckeditor',
]

CKEDITOR5_CONFIGS = {
    'default': {
        'toolbar': ['bold', 'italic', 'link'],
    }
}

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
APPEND_SLASH = False

SPECTACULAR_SETTINGS = {
    'TITLE': 'ProfArrent API',
    'DESCRIPTION': 'Your project description',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# Template directories - Django templates + React build
_template_dirs = [TEMPLATES_DIR]
if REACT_BUILD_DIR.exists():
    _template_dirs.append(REACT_BUILD_DIR)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': _template_dirs,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database: PostgreSQL if env vars set, otherwise SQLite
POSTGRES_DB = os.getenv('POSTGRES_DB')
if POSTGRES_DB:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': POSTGRES_DB,
            'USER': os.getenv('POSTGRES_USER'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
            'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
            'PORT': os.getenv('POSTGRES_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

MEDIA_ROOT = os.path.join(BASE_DIR, 'file')
MEDIA_URL = '/file/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = '/static/'

# WhiteNoise serves React build root files (favicon, manifest, etc.)
if REACT_BUILD_DIR.exists():
    WHITENOISE_ROOT = str(REACT_BUILD_DIR)

# React build static assets
STATICFILES_DIRS = []
if REACT_BUILD_DIR.exists() and (REACT_BUILD_DIR / 'static').exists():
    STATICFILES_DIRS = [REACT_BUILD_DIR / 'static']

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_METHODS = ["DELETE", "GET", "OPTIONS", "POST", "PUT", "PATCH"]

CORS_ALLOWED_ORIGINS = [
    "http://13.49.211.106:8000",
    "http://prof-arent.s3-website.eu-north-1.amazonaws.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8000",
]

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
}

AUTH_USER_MODEL = 'users.CustomUser'

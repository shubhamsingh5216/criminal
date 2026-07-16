"""
Example production settings for the Django project.

Copy this file to `project/settings_prod.py`, set environment variables, and
use `DJANGO_SETTINGS_MODULE=project.settings_prod` for production.

This config supports PostgreSQL via `DATABASE_URL` and S3 media via
`AWS_S3_*` environment variables (using `django-storages`).
"""
from .settings import *  # import base settings
import os
import dj_database_url

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', SECRET_KEY)
DEBUG = os.environ.get('DEBUG', '0') in ('1', 'true', 'True')

# Database
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
    }

# Static and media files
if os.environ.get('USE_S3') == '1':
    # Requires django-storages and boto3
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME')
    AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"

    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
else:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    MEDIA_URL = '/media/'

# Other production settings can be added here (CORS, allowed hosts, logging)
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

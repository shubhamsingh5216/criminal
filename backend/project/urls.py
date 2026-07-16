from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static  # <-- this must be imported

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),  # make sure 'myapp/urls.py' exists
]

# Add this AFTER urlpatterns is defined
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
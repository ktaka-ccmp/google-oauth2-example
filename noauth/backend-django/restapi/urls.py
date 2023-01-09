from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls

from . import views

router = routers.DefaultRouter()
router.register(r'customer', views.CustomerViewSet)

urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'api/docs/', include_docs_urls('Api docs')),
#    path('api2/', include('rest_framework.urls', namespace='rest_framework')),
]

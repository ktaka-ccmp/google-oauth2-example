from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls

from . import views

router = routers.DefaultRouter()
router.register(r'customer', views.CustomerViewSet)

urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'api/docs/', include_docs_urls('Api docs')),
]

urlpatterns += [
    path('api/login/', views.ApiLoginView.as_view(), name="api_login"),
    path('api/logout/', views.ApiLogoutView.as_view(), name="api_logout"),
    path('api/user/', views.ApiGetUserView.as_view(), name="api_user"),
]

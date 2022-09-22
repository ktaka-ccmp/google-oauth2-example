from django.shortcuts import render
from .models import Customer
from rest_framework import viewsets
#from rest_framework import permissions
from restapi.serializers import CustomerSerializer

#from django.conf import settings
from django.contrib import auth

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from restapi.serializers import UserSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = (IsAuthenticated,)

class ApiLoginView(APIView):
    def post(self, request):
        user = auth.authenticate(request)
        if user:
            request.user = user # what is this?
            auth.login(request, user)
        else:
            return Response({"Error: Auth failed"})

        print({"Authenticated as:", user.username})
        return Response({"Authenticated as": user.username})

class ApiLogoutView(APIView):
    def get(self, request):
        auth.logout(request)
        print("logout")
        return Response({"Logout": "success"})

class ApiGetUserView(APIView):
    def get(self, request):
        user = auth.get_user(request)
        print("user:", user)

        if user.is_authenticated:
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response(None)

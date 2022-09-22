from django.shortcuts import render
from .models import Customer
from rest_framework import viewsets
from rest_framework import permissions
from restapi.serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
#    permission_classes = [permissions.IsAuthenticated]



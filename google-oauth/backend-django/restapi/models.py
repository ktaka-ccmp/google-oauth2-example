from django.db import models

# Create your models here.

class Customer(models.Model):
    enjoy_jards_macale = models.BooleanField()
    name = models.CharField(max_length=30)
    email = models.EmailField()
    age = models.IntegerField()
    bio = models.TextField()
    days_since_last_login = models.BigIntegerField()
    birthday = models.DateField()
    last_shopping = models.DateTimeField()

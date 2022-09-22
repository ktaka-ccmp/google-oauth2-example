import json
from google.oauth2 import id_token
from google.auth.transport import requests

from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User

class GISBackend(BaseBackend):

    def VerifyToken(self, request):
        buf=json.loads(request.body)
        if buf == None:
            return None
        token=buf["credential"]

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_OAUTH2_CLIENT_ID)
        except ValueError:
            return None

        return idinfo

    def authenticate(self, request):
        idinfo = self.VerifyToken(request)
        if not idinfo:
            return None

        user = None
        username = idinfo['email']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = User(username=username)
            user.email = idinfo['email']
            user.first_name = idinfo['given_name']
            user.last_name = idinfo['family_name']
            user.save()
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

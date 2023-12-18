from google.oauth2 import id_token
from google.auth.transport import requests

from config import settings

from sqlalchemy.orm import Session
from data.db import User

async def VerifyToken(jwt: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            jwt,
            requests.Request(),
            settings.google_oauth2_client_id)
    except ValueError:
        return None

    print("idinfo: ", idinfo)
    return idinfo


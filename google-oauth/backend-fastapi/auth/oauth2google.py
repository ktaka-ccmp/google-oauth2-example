from google.oauth2 import id_token
from google.auth.transport import requests

from config import settings

from sqlalchemy.orm import Session
from data.db import User
from auth.user import get_user_by_email, create_user

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

async def authenticate(jwt: str, db_session: Session):
    idinfo = await VerifyToken(jwt)
    if not idinfo:
        return None
    user = None
    email = idinfo['email']

    user = get_user_by_email(db_session, email)
    if user:
        return user
    if not user:
        db_user = User(name=email, email=email)
        user = await create_user(db_user, db_session)
        return user

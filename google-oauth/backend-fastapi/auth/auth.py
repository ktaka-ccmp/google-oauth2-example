import secrets
from typing import Optional
from fastapi import Depends, APIRouter, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from sqlalchemy.orm import Session
from data.db import User, UserBase, Sessions
from data.db import get_db, get_cache
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
from . import oauth2google as google

class OAuth2Cookie(OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str = None,
        scopes: dict = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        session_id: str = request.cookies.get("session_id")
        if not session_id:
            if self.auto_error:
                raise HTTPException(
                    status_code=HTTP_403_FORBIDDEN, detail="Not authenticated"
                )
            else:
                return None
        return session_id

oauth2_scheme = OAuth2Cookie(tokenUrl="/api/signin", auto_error=False)

router = APIRouter()

def get_session_by_session_id(session_id: str, cs: Session):
    try:
        session=cs.query(Sessions).filter(Sessions.session_id==session_id).first().__dict__
        session.pop('_sa_instance_state')
        return session
    except:
        return None

def create_session(user: UserBase, cs: Session):
    session_id=secrets.token_urlsafe(32)
    session = get_session_by_session_id(session_id, cs)
    if session:
        raise HTTPException(status_code=400, detail="Duplicate session_id")
    if not session:
        session_entry=Sessions(session_id=session_id, user_id=user.id, name=user.name)
        cs.add(session_entry)
        cs.commit()
        cs.refresh(session_entry)
    return session_id

def delete_session(session_id: str, cs: Session):
    session=cs.query(Sessions).filter(Sessions.session_id==session_id).first()
    print("delete session: ", session.__dict__)
    cs.delete(session)
    cs.commit()

def get_user_by_name(name: str, ds: Session):
    user=ds.query(User).filter(User.name==name).first().__dict__
    user.pop('_sa_instance_state')
    print("get_user_by_name -> user: ", user)
    return user

# def fake_hash_password(password: str):
#     return "fakehashed" + password

async def get_current_user(ds: Session = Depends(get_db), cs: Session = Depends(get_cache), session_id: str = Depends(oauth2_scheme)):

    if not session_id:
        return None

    session = get_session_by_session_id(session_id, cs)
    if not session:
        return None

    username = session["name"]
    user_dict = get_user_by_name(username, ds)
    user=UserBase(**user_dict)
    print("session[\"name\"]: ", session["name"])
    print("user_dict: ", user_dict)
    print("user: ", user)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user:
        return None
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@router.post("/login")
async def login(request: Request, response: Response, ds: Session = Depends(get_db), cs: Session = Depends(get_cache)):
    body = await request.body()
    user = await google.authenticate(body, ds)
    if user:
        user_dict = get_user_by_name(user.name, ds)
        if not user_dict:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        user = UserBase(**user_dict)
        session_id = create_session(user, cs)
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            max_age=1800,
            expires=1800,
        )
    else:
        return Response({"Error: Auth failed"})
    return {"Authenticated_as": user.name}

@router.post("/signin")
async def signin(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), ds: Session = Depends(get_db), cs: Session = Depends(get_cache)):
    user_dict = get_user_by_name(form_data.username, ds)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserBase(**user_dict)
    # hashed_password = fake_hash_password(form_data.password)
    # if not hashed_password == user.hashed_password:
    #     raise HTTPException(status_code=400, detail="Incorrect username or password")

    session_id=create_session(user, cs)
    response.set_cookie(
                  key="session_id",
                  value=session_id,
                  httponly=True,
                  max_age=1800,
                  expires=1800,
    )
    return {"access_token": user.name, "token_type": "bearer"}

@router.get("/logout")
async def logout(response: Response, request: Request, cs: Session = Depends(get_cache)):
    session_id: str = request.cookies.get("session_id")
    response.delete_cookie("session_id")
    try:
        delete_session(session_id, cs)
    except:
        pass
    return {"cookie": "deleted"}

@router.get("/sessions")
async def list_sessions(cs: Session = Depends(get_cache)):
    return cs.query(Sessions).offset(0).limit(100).all()

@router.get("/user/")
async def read_users_me(user: UserBase = Depends(get_current_active_user)):
    try:
        return {"username": user.name, "email": user.email,}
    except:
        return None

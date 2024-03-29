from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

import admin.debug, admin.user, auth.auth, auth.debug
import customer.customer

app = FastAPI()

app.include_router(
    auth.auth.router,
    prefix="/api",
    tags=["Authentication"],
)

app.include_router(
    auth.debug.router,
    prefix="/api",
    tags=["Authentication"],
)

app.include_router(
    customer.customer.router,
    prefix="/api",
    tags=["CustomerForAuthenticatedUser"],
    dependencies=[Depends(auth.auth.get_current_active_user)],
)

app.include_router(
    admin.user.router,
    prefix="/api",
    tags=["AdminOnly"],
    dependencies=[Depends(auth.auth.get_admin_user)],
)

app.include_router(
    admin.debug.router,
    prefix="/api",
    tags=["AdminOnly"],
    dependencies=[Depends(auth.auth.get_admin_user)],
)

origins = [
    "http://localhost:3000",
    "http://v200.h.ccmp.jp:4000",
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


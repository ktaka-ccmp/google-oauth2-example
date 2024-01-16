from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import customer.customer
import htmx.page

app = FastAPI()

app.include_router(
    customer.customer.router,
    prefix="/api",
    tags=["CustomerWOAuthentication"],
)

app.include_router(
    htmx.page.router,
    prefix="/page",
    tags=["HTMX"],
)

origins = [
    "http://localhost:3000",
    "http://10.0.0.201:3000",
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )




from typing import Optional
from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.orm import Session
from data.db import Customer, CustomerBase, get_db
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse


router = APIRouter()

templates = Jinja2Templates(directory='htmx/templates')

@router.get("/index/", response_class=HTMLResponse)
def index(request: Request):
    context = {'request': request }
    return templates.TemplateResponse('index.html', context)

@router.get("/movie/", response_class=HTMLResponse)
async def movielist(request: Request, hx_request: Optional[str] = Header(None)):
    films = [
        {'name': 'Blade Runner', 'director': 'Ridley Scott'},
        {'name': 'Pulp Fiction', 'director': 'Quentin Tarantino'},
        {'name': 'Mulholland Drive', 'director': 'David Lynch'},
    ]
    context = {"request": request, 'films': films}
    if hx_request:
        return templates.TemplateResponse("movie.table.html", context)
    return templates.TemplateResponse("movie.html", context)

@router.get("/movie/table", response_class=HTMLResponse)
async def movie_table(request: Request):
    films = [
        {'name': 'Blade Runner', 'director': 'Ridley Scott'},
        {'name': 'Pulp Fiction', 'director': 'Quentin Tarantino'},
        {'name': 'Mulholland Drive', 'director': 'David Lynch'},
    ]
    context = {"request": request, 'films': films}
    return templates.TemplateResponse("movie.table.html", context)

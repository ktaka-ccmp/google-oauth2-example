# Howto run app in this repository.

## 1. Backend Rest API server

Set up API server either with Django or FastAPI.

### 1.1. Django Rest Framework

Prepare python venv and install packages
~~~
cd backend-django/
python3 -m venv .venv
source .venv/bin/activate
pip install django djangorestframework django-cors-headers coreapi python-decouple
~~~

Edit .env in the directory where manage.py exists.
~~~
ORIGIN_SERVER=http://localhost:3000
~~~

Run server
~~~
./manage.py runserver [::]:8000
~~~

### 1.2. FastAPI

Prepare python venv and install packages
~~~
cd backend-fastapi/
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi sqlalchemy uvicorn
~~~

Create database
~~~
rm data/data.db
python3 data/db.py
./data/create_data.sh
~~~

Run server
~~~
uvicorn main:app  --host 0.0.0.0 --reload
~~~

## 2. Frontend apps

Set up frontend either with React.js or Svelte.

If not yet installed, install node.js. (Here is an example for Debian.)
~~~
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

### 2.1. React.js

Module install
~~~
cd frontend-react
npm install axios react-router-dom reactstrap bootstrap
~~~

Edit .env in the directory where package.json exists.
~~~
REACT_APP_API_SERVER=http://localhost:8000
~~~

Run server
~~~
PORT=3000 npm start 
~~~

### 2.2. Svelte

Module install
~~~
cd frontend-svelte
npm install axios svelte-routing svelte
~~~

Edit .env in the directory where package.json exists.
~~~
VITE_APP_API_SERVER=http://localhost:8000
~~~

Run server
~~~
npm run dev -- --port=3000
~~~

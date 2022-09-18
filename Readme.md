# React.js + Django Rest Framework

## Prep

### Django

~~~
python3 -m venv .venv\
source .venv/bin/activate
pip install django djangorestframework django-cors-headers 
pip install coreapi
django-admin startproject backend
cd backend/
django-admin startapp restapi
python manage.py createsuperuser --email admin@example.com --username admin

pip install model_bakery
vi backend/restapi/models.py
./manage.py  migrate
vi backend/restapi/test-models.py
./manage.py test restapi

backend/backend/settings.py
backend/backend/urls.py

backend/restapi/serializers.py
backend/restapi/views.py
backend/restapi/urls.py

curl -H 'Accept: application/json' http://localhost:8000/api/customer/|jq .

pip install python-decouple
~~~

~~~
# tree backend/
backend/
├── backend
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── db.sqlite3
├── manage.py
└── restapi
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── migrations
    │   └── __init__.py
    ├── models.py
    ├── serializers.py
    ├── test_models.py
    ├── urls.py
    └── views.py

3 directories, 16 files
~~~

python manage.py runserver [::]:8000


### React.js

~~
  344  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  345  sudo apt-get install -y nodejs
  346  npx create-react-app frontend
  379  npm start 
  373  cd frontend/
  378  npm install axios react-router-dom
  398  npm i reactstrap
  409  npm i bootstrap
  379  npm start 
  407  curl -s  http://127.0.0.1:8000/api/customer/ |jq .results[1]
  423  vi .env
~~~

~~~
# tree frontend/
frontend/
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.js
    ├── Customer.js
    ├── index.css
    └── index.js

2 directories, 10 files
~~~

npm start

### .env files

For react.js, frontend/.env:
REACT_APP_API_SERVER=http://v147.h.ccmp.jp:8000

For django, backend/backend/.env:
ORIGIN_SERVER=http://v147.h.ccmp.jp:3000


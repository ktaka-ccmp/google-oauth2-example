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

'backend' directory structure
~~~
# tree -a
.
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

Install node.js
~~~
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

Create project
~~~
npx create-react-app frontend
cd frontend/
npm start 
~~~

Module install
~~~
npm install axios react-router-dom reactstrap bootstrap
~~~

Files modified or newly created:
~~~
src/index.js
src/Customer.js
src/App.js
~~~

Original files kept as is:
~~~
public/index.html
public/manifest.json
public/robots.txt
public/favicon.ico
.gitignore
package-lock.json
package.json
~~~

'frontend' directory structure:
~~~
# tree -a
.
├── .gitignore
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
    └── index.js

2 directories, 10 files
~~~

frontend/.env (modify depending on your environment.)
~~~
REACT_APP_API_SERVER=http://api.example.com:8000
~~~

~~~
npm start 
~~~


~~~
curl -s  http://127.0.0.1:8000/api/customer/ |jq .results[1]
vi .env
~~~

npm start

### .env files


For django, backend/backend/.env:
ORIGIN_SERVER=http://v147.h.ccmp.jp:3000


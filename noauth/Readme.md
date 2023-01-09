# Howto run app in this repository.

## 1. React.js + Django Rest Framework
### <a name="frontend">Frontend React.js app</a>

If not yet installed, install node.js. (Here is an example for Debian.)
~~~
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

Module install
~~~
cd frontend
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

### The backend api server(Django Rest Framework)

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

## 2. React.js + fastapi

### Frontend React.js app

Same as [the above](#frontend).

### The backend api server(fastapi)

Prepare python venv and install packages
~~~
cd backend-fastapi/
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi sqlalchemy uvicorn
~~~

Create database
~~~
rm test.db
python3 db.py
./create_data.sh
echo "select * from customer"  | sqlite3 test.db
~~~

Run server
~~~
uvicorn main:app  --host 0.0.0.0 --reload
~~~

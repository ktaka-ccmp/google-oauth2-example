# React.js + Django Rest Framework

## Howto run Reac.js+Django pages using this repo.

### Django (backend)

Prepare venv and install packages
~~~
cd backend/
python3 -m venv .venv
source .venv/bin/activate
pip install django djangorestframework django-cors-headers coreapi python-decouple google-auth
~~~

Edit .env
~~~
ORIGIN_SERVER=http://localhost:3000
GOOGLE_OAUTH2_CLIENT_ID=888888888888-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
~~~

Run server
~~~
./manage.py runserver [::]:8000
~~~

### React (frontend)

Install node.js (Here is an example for Debian.)
~~~
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

Module install
~~~
cd frontend
npm install axios react-router-dom reactstrap bootstrap @react-oauth/google
~~~

Edit .env
~~~
REACT_APP_API_SERVER=http://localhost:8000
REACT_APP_GOOGLE_OAUTH2_CLIENT_ID=888888888888-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
~~~

Run server
~~~
PORT=3000 npm start 
~~~


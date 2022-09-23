# React.js + Django Rest Framework with Google Identity Service

## Develope on localhost

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

## Develope on testing server other than localhost

When we want to test Google OAuth


Let's suppose we want to run on the following servers.
backend: api.example.net:8000
frontend: web.example.net:3000

### Register on Google
https://stackoverflow.com/a/70241409

From Google Cloud Console web page,
Go APIs & Services -> Credentials -> OAuth 2.0 Client IDs -> Authorized JavaScript origins

~~~
https://web.example.com
https://web.example.com:3000
~~~

### SSL Certificates are needed

Obtain certificate, for example from https://letsencrypt.org/getting-started/.

Place them somewhere on your server.
~~~
${SOMEWHERE}/CERT/
├── fullchain.pem
└── privkey.pem
~~~

### Django (backend)

Install extra packages.
~~~
pip install uvicorn gunicorn
~~~

Edit .env in the directory where manage.py exists.
~~~
ORIGIN_SERVER=https://web.example.com:3000
GOOGLE_OAUTH2_CLIENT_ID=888888888888-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
~~~

Run server in the directory where manage.py exists.
~~~
gunicorn backend.asgi:application -k uvicorn.workers.UvicornWorker -b [::]:8000 -w 2 --keyfile ${SOMEWHERE}/CERT/privkey.pem --certfile ${SOMEWHERE}/CERT/fullchain.pem
~~~

### React (frontend)

Install extra packages.
~~~
pip install uvicorn gunicorn
~~~

Edit .env in the directory where package.json exists.
~~~
ORIGIN_SERVER=https://api.example.com:8000
GOOGLE_OAUTH2_CLIENT_ID=888888888888-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
~~~

Run server in the directory where package.json exists.
~~~
HTTPS=true SSL_CRT_FILE=${SOMEWHERE}/CERT/fullchain.pem SSL_KEY_FILE=${SOMEWHERE}/CERT/privkey.pem PORT=3000 npm start
~~~


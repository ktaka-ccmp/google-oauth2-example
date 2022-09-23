# Authentication using Sign in with Google

The content of this page describes how to test Authentication using Sign in with Google either on localhost or servers other than localhost.
It seems using HTTPS is required for servers other than local hosts.

## Localhost

### Setup OAuth configuration on Google APIs console

Open https://console.cloud.google.com/apis/credentials, then go to Credentials -> OAuth 2.0 Client IDs, then add both of the following to the Authorized JavaScript origins box.

~~~
http://localhost
http://localhost:3000
~~~

For details, see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid.

### Django (backend)

Prepare venv and install packages
~~~
cd backend/
python3 -m venv .venv
source .venv/bin/activate
pip install django djangorestframework django-cors-headers coreapi python-decouple google-auth
~~~

Edit .env in the directory where manage.py exists.
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

Edit .env in the directory where package.json exists.
~~~
REACT_APP_API_SERVER=http://localhost:8000
REACT_APP_GOOGLE_OAUTH2_CLIENT_ID=888888888888-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
~~~

Run server
~~~
PORT=3000 npm start 
~~~

## Servers other than localhost

When we use "Sign in with Google" on servers other than localhost, it seems we must use HTTPS.
See https://stackoverflow.com/a/70241409.

Suppose we want to run apps. in this repository on the following servers.
~~~
backend: api.example.net:8000
frontend: web.example.net:3000
~~~

### Setup OAuth configuration on Google APIs console

Open https://console.cloud.google.com/apis/credentials, then go to Credentials -> OAuth 2.0 Client IDs, then add both of the following to the Authorized JavaScript origins box.

~~~
https://web.example.com
https://web.example.com:3000
~~~

For details, see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid.

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

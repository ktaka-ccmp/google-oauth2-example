# Howto run app in this repository.

## 0. <a name="googleapisetup">Setup OAuth configuration on Google APIs console</a>

1. Open https://console.cloud.google.com/apis/credentials.
1. Go CREATE CREDENTIALS -> Go Create OAuth client ID -> Choose "Web applicatin" as Application type -> create.
1. Save the client ID somewhere, as it is needed later. 
1. Go one of the OAuth 2.0 Client IDs just created, then add both of the following to the Authorized JavaScript origins box.

~~~
http://localhost
http://localhost:3000
~~~

For details, see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid.

## 1. Backend Rest API server

Set up API server either with Django or FastAPI.

### 1.1. Django Rest Framework

Prepare python venv and install packages
~~~
cd backend-django/
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

### 1.2. FastAPI

Prepare python venv and install packages
~~~
cd backend-fastapi/
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi sqlalchemy uvicorn google-auth requests python-dotenv python-multipart pydantic-settings
~~~

Create database
~~~
rm data/data.db data/cache.db
python3 data/db.py
./data/create_data.sh
~~~

Edit .env in the directory where main.py exists.
~~~
ORIGIN_SERVER=http://localhost:3000
GOOGLE_OAUTH2_CLIENT_ID=888888888888-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
~~~

Run server
~~~
uvicorn main:app  --host 0.0.0.0 --reload
~~~

## 2. Frontend apps

Set up frontend either with React.js(2.1., 2.2.) or Svelte(2.3.).

If not yet installed, install node.js. (Here is an example for Debian.)
~~~
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

As for React.js frontend, I implemented two types of React.js frontend app with Sign in with Google.

1. [frontend-react01](frontend-react01): React.js frontend app with Sign in with Google, using "@react-oauth/google".
   - https://www.npmjs.com/package/@react-oauth/google
1. [frontend-react02](frontend-react02): React.js frontend app with Sign in with Google, using Google's client library.
   - https://youtu.be/roxC8SMs7HU
   - https://developers.google.com/identity/gsi/web/guides/client-library


As for Svelte frontend, Google's client library is used.

### 2.1. React.js with "@react-oauth/google"

Module install
~~~
cd frontend-react01
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

### 2.2. React.js with Google's client library

Module install
~~~
cd frontend-react02
npm install axios react-router-dom reactstrap bootstrap
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

### 2.3. Svelte

Module install
~~~
cd frontend-svelte
npm install axios svelte-routing svelte jwt-decode
~~~

Edit .env in the directory where package.json exists.
~~~
VITE_APP_API_SERVER=http://localhost:8000
VITE_APP_GOOGLE_OAUTH2_CLIENT_ID=888888888888-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
~~~

Run server
~~~
npm run dev -- --port=3000
~~~


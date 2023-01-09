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

## 1. React.js + Django Rest Framework

### <a name="frontend">Frontend React.js app</a>

If not yet installed, install node.js. (Here is an example for Debian.)
~~~
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

Module install
~~~
cd frontend-01
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

### The backend api server(Django Rest Framework)

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

## 2. React.js + fastapi

### Frontend React.js app

Same as [the above](#frontend).

### The backend api server(fastapi)

Prepare python venv and install packages
~~~
cd backend-fastapi/
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi sqlalchemy uvicorn google-auth requests python-dotenv python-multipart
~~~

Create database
~~~
rm data/data.db data/cache.db
python3 data/db.py
./data/create_data.sh
echo "select * from customer"  | sqlite3 data/data.db
echo "select * from sessions"  | sqlite3 data/cache.db
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

## 3. An alternative React.js app

Here in this repository, I implemented two types of React.js frontend app with Sign in with Google.

1. [frontend-01](frontend-01): React.js frontend app with Sign in with Google, using "@react-oauth/google".
   - https://www.npmjs.com/package/@react-oauth/google
1. [frontend-02](frontend-02): React.js frontend app with Sign in with Google, using Google's client library.
   - https://youtu.be/roxC8SMs7HU
   - https://developers.google.com/identity/gsi/web/guides/client-library

To test the frontend-02, please go into the directory frontend-02, then follow [the step above](#frontend).


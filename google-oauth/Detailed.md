# A detailed explanation of authentication-related codes

The ["@react-oauth/google" library](https://github.com/MomenSherif/react-oauth) is used for google-oauth-01/frontend,
whereas [Google's client library](https://developers.google.com/identity/gsi/web/guides/client-library) is used for google-oauth-02/frontend.

## 1. frontend-01

### AuthProvider.js

Most of the authentication-related codes in the frontend React.js app are contained in [AuthProvider.js](google-oauth-01/frontend/src/AuthProvider.js).
Here I explain some of the key features in the code.

The UserLogin component is to show the "Sign in with Google button" and the "Google One Tap."
The below is an implementation using the "@react-oauth/google" library.

~~~
export const UserLogin = () => {
    const { onLogin } = useContext(AuthContext);

    useGoogleOneTapLogin({
	onSuccess: r => onLogin(r),
	onError: () => { console.log('Google Login Failed') }
    });

    return (
	<div className="App">
	    <GoogleLogin
		theme="filled_black" shape="pill"
		onSuccess={onLogin}
		onError={() => { console.log('Google Login Failed') }}
	    />
	</div>
    );
};
~~~

The backendAuth is a callback function that sends Google's auth credential to the login endpoint of the API server.
We expect the backend server to verify the credential and set a session cookie.

~~~
    const backendAuth = (response) => {
	const origin = location.state?.from?.pathname || '/' ;
	const data=JSON.stringify(response, null, 2);
	console.log("response\n", JSON.stringify(response, null, 2));

	apiAxios.post(`/api/login/`, data, )
	    .then(res => {
		console.log("Backend Auth: ", res)
		navigate(origin);
	    })
	    .catch(error => {
		console.log(error.response)
		console.log("backendAuth failed. Redirecting to /login... ")
		navigate('/login', {state: { from: location }}, {replace: true});
	    })
    }
~~~

An axios instance with the following property defined is shared throughout this app:
* If there is a session cookie, it always sends it in communication with the API server.
* The interceptor redirects to "/login" when data fetching from the API server fails with 403.

~~~
    const apiAxios = axios.create({
	baseURL: `${process.env.REACT_APP_API_SERVER}`,
	withCredentials: true,
    });

    apiAxios.interceptors.response.use(response => {return response}, error => {
	if (error.response.status === 403) {
	    console.log("apiAxios failed. Redirecting to /login... ")
	    userRef.current = null;
	    navigate('/login', {state: { from: location }}, {replace: true});
	}
	return Promise.reject(error);
    });
~~~

The getUser function tries to fetch user data from the API server.
If we already have a valid session cookie, we can obtain the user data, causing us to regard the user as authenticated.
When the obtained user data is null, we can regard them as unauthenticated.

~~~
    const getUser = () => {
	setLoadUser(true);
	apiAxios.get(`/api/user/`)
	    .then(res => {
		userRef.current = res.data
		setLoadUser(false);
		console.log("getUser: user:", userRef.current.username)
	    })
	    .catch(error => console.log("getUser faild: ", error.response))
    };
~~~

The RequireAuth is a wrapper component redirecting an unauthenticated user to the login page.

~~~
export const RequireAuth = ({ children }) => {
    const { LoadUser, user } = useContext(AuthContext);
    const location = useLocation();

    console.log("RequireAuth: LoadUser:", LoadUser, "user:", user?.username)

    if (LoadUser || user) {
	return <Outlet />
    }

    console.log("No user object! Redirecting to /login ...")
    return <Navigate to="/login" replace state={{ from: location }} />
};
~~~

### App.js

The authentication mechanisms in AuthProvider.js are made effective in [App.js](google-oauth-01/frontend/src/App.js) by wrapping components using `<GoogleOAuthProvider>`, `<AuthProvider>` and `<Route element={<RequireAuth />}>`.

~~~
const App = () => {
  return (
==>       <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID}>
==>       <AuthProvider>
	  <Container fluid="sm">
	      <Table borderless responsive size="sm">
		  <tbody>
		      <tr><td><Link to={`/`}>Top</Link></td></tr>
		      <tr><td><Link to={`/customer`}>Customer</Link></td></tr>
		  </tbody>
	      </Table>

	      <LogoutButton />

	      <Routes>
		  <Route index element={ <Top /> } />
		  <Route path="/login" element={<UserLogin />} />
==> 		  <Route element={<RequireAuth />}>
		      <Route path="/customer" element={ <Customer /> } />
==> 		  </Route>
		  <Route path="*" element={<NoMatch />} />
	      </Routes>
	  </Container>
==>       </AuthProvider>
==>       </GoogleOAuthProvider>
  );
}
~~~

## 2. frontend-02

The only significant difference from frontend #1 is the UserLogin component in [AuthProvider.js](google-oauth-02/frontend/src/AuthProvider.js), which is implemented using [Google's client library](https://developers.google.com/identity/gsi/web/guides/client-library).

### public/index.html

First, we need to load the library in [public/index.html](google-oauth-02/frontend/public/index.html).
At the end of `<head></head>` section, we include the client script provided by Google.

~~~
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   </head>
~~~

### AuthProvider.js

Then, implement the "Sign in with Google button" and "Google One Tap" using Google's library.
Please note that the line "/* global google */" is essential, i.e., without this, react won't recognize the functions starting with "google.".

~~~
export const UserLogin = () => {
    const { onLogin } = useContext(AuthContext);

    useEffect(() => {
	/* global google */
	google.accounts.id.initialize({
	    client_id: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID,
	    callback: r => onLogin(r),
	    ux_mode: "popup",
	});

	google.accounts.id.renderButton(
	    document.getElementById("signInDiv"),
	    { theme: "filled_blue", size: "large", shape: "circle", }
	);

	google.accounts.id.prompt();
    });

    return (
	<div className="App">
	    <div id="signInDiv"></div>
	</div>
    );
};
~~~

## 3. backend-django

The functionality required by the Django backends are the flowings:
* [Verify credential.](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
* Create the user if it does not exist.
* Set a session cookie for the user.

The backend codes are the same for "google-oauth-01" and "google-oauth-02."

### restapi/views.py

The [restapi/views.py](google-oauth-01/backend/restapi/views.py) is the main place where we implement funtions the API provides. 

ApiLoginView receives credential(JWT) signed by google as the request body.
It verifies credential(auth.authenticate), then creates a session for that user([auth.login](https://github.com/django/django/blob/main/django/contrib/auth/__init__.py#L94)).

ApiLogoutView clears the session.

ApiGetUserView returns user data as a response if the request have a valid session cookie set in the header.

~~~
class ApiLoginView(APIView):
    def post(self, request):
        user = auth.authenticate(request)
        if user:
            request.user = user
            auth.login(request, user)
        else:
            return Response({"Error: Auth failed"})

        print({"Authenticated as:", user.username})
        return Response({"Authenticated as": user.username})

class ApiLogoutView(APIView):
    def get(self, request):
        auth.logout(request)
        print("logout")
        return Response({"Logout": "success"})

class ApiGetUserView(APIView):
    def get(self, request):
        user = auth.get_user(request)
        print("user:", user)

        if user.is_authenticated:
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response(None)
~~~

### restapi/backend/GIStoken.py

The [GIStoken.py](google-oauth-01/backend/restapi/backend/GIStoken.py) provides authentication backend functions to verify the credential and create the user if it does not yet exist.

The id_token.verify_oauth2_token function called form VerifyToken, is to [verify token as follows](https://github.com/googleapis/google-auth-library-python/blob/main/google/auth/jwt.py#L215):
* Verify the signature of the JWT with Google's certificate.
* Verify aud: is the same as the client\_id we obtained from [Google APIs console](https://console.cloud.google.com/apis/credentials).
* Verify "now" is in between the issue and the expiration date.

~~~
import json
from google.oauth2 import id_token
from google.auth.transport import requests

from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User

class GISBackend(BaseBackend):

    def VerifyToken(self, request):
        buf=json.loads(request.body)
        if buf == None:
            return None
        token=buf["credential"]

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_OAUTH2_CLIENT_ID)
        except ValueError:
            return None

        return idinfo

    def authenticate(self, request):
        idinfo = self.VerifyToken(request)
        if not idinfo:
            return None

        user = None
        username = idinfo['email']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = User(username=username)
            user.email = idinfo['email']
            user.first_name = idinfo['given_name']
            user.last_name = idinfo['family_name']
            user.save()
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
~~~

### restapi/urls.py

The API endpoint urls are defined here.

~~~
urlpatterns += [
    path('api/login/', views.ApiLoginView.as_view(), name="api_login"),
    path('api/logout/', views.ApiLogoutView.as_view(), name="api_logout"),
    path('api/user/', views.ApiGetUserView.as_view(), name="api_user"),
]
~~~

### restapi/serializer.py

This serializer defines what should be returned in the JSON response for the '/api/usr/' request.

~~~
from django.contrib.auth.models import User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')
~~~

### backend/settings.py

Some parameters regarding authentication are defined here.

~~~
AUTHENTICATION_BACKENDS = [
    'restapi.backend.GIStoken.GISBackend',
    'django.contrib.auth.backends.ModelBackend',
]

GOOGLE_OAUTH2_CLIENT_ID=config('GOOGLE_OAUTH2_CLIENT_ID')
SESSION_COOKIE_AGE = 600
CORS_ALLOW_CREDENTIALS = True
~~~

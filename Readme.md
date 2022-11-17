# React.js + Django Rest framework + Sign in with Google

The example apps provided in this repository consist of a frontend and a backend API server using the React.js and the Django REST framework(DRF).
OAuth services provided by major companies, including Google, have been widely used as authentication mechanisms for limiting access to certain pages.
Since Google decided to [replace their OAuth service with the new one by March 31, 2023](https://developers.googleblog.com/2022/03/gis-jsweb-authz-migration.html),
I somehow implemented OAuth to my React.js + DRF pages with a new Sign in with Google.

As for maintaining sessions, many examples on the Internet are using JWT access tokens themselves, which are provided by Google or the backend API server.
However, there are arguments that [JWT tokens should not be used for sessions](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/).
Therefore I also implemented an auth backend using the native session mechanism of Django where a session cookie is set after successful [verification of credential](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token) provided by Google.

The authentication follows the following steps:

1. A user visits a restricted page.
1. React.js app redirects the user to the login page.
1. The user authenticates them at the Google OAuth endpoint. Google OAuth API returns a credential as a Json Web Token(JWT).
1. React.js app receives the JWT from Google and sends it to the Django API endpoint.
1. Django app verifies the JWT's signature using Google public certificate and trusts the user's information in the JWT's payload.
1. Django creates the user if it does not exist and returns the user's information setting a new session cookie in the response header.
1. React.js app regards the user as authenticated and sets a property to always send a request with the session cookie in the following API communications.
1. The Django API app allows what is allowed for the user as long as the session is valid.

Here in this repository, I provide a simplified version of the code to illustrate the authentication mechanism.

1. [noauth](noauth): React.js + DRF app without authentication.
1. [google-oauth/frontend-01](google-oauth/frontend-01): React.js app with Sign in with Google, using "@react-oauth/google".
   - https://www.npmjs.com/package/@react-oauth/google
1. [google-oauth/frontend-02](google-oauth/frontend-02): React.js app with Sign in with Google, using Google's client library.
   - https://youtu.be/roxC8SMs7HU
   - https://developers.google.com/identity/gsi/web/guides/client-library

## How the app works without authentication

The app in this repository consists of two pages, "Top" and "Customer."

![Top no-auth](./images/NoauthTop.png "Top page - no auth")

![Customer no-auth](./images/NoauthCustomer.png "Customer page - no auth")

The Customer page, which fetches the data from the API server, is sensitive. Therefore the page must not be seen by unauthenticated users, and the API server must not provide requested data.

##  How the app works with authentication

With authentication implemented, anonymous users' access is redirected to the login page, where they can sign in with their Google account.

![Login page](./images/AuthLogin3-2.png "Login page")

The Customer page can only be seen after successful authentication.

![Customer page for authenticated users](./images/AuthCustomer.png "Customer page for authenticated users")

Please note that the authentication mechanism protects both the Customer page and data fetch from the API server.


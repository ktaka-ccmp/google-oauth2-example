# React.js + Django Rest framework + Sign in with Google

The example apps provided in this repository consist of a React.js frontend and a backend API server using the Django REST framework(DRF).
OAuth services provided by major companies, including Google, have been widely used as authentication mechanisms for limiting access to certain pages.
Since Google decided to replace their OAuth service with the new one by March 31, 2023(https://developers.googleblog.com/2022/03/gis-jsweb-authz-migration.html),
I somehow implemented OAuth to my React.js + DRF pages with a new Sign in with Google.

As for maintaining sessions, many examples on the Internet are using JWT access tokens themselves, which are provided by Google or the backend API server.
However, there are arguments that JWT tokens should not be used for sessions(http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/).
Therefore I also implemented an auth backend using the native session mechanism of Django where a session cookie is set after successful verification of credential provided by Google.

Here I provide a simplified version of them to illustrate the authentication mechanism.

1. noauth: React.js + DRF app without authentication.
1. google-oauth-01: React.js + DRF app with Sign in with Google, using @react-oauth/google.
   - https://www.npmjs.com/package/@react-oauth/google
1. google-oauth-02: React.js + DRF app with Sign in with Google, using Google's client library.
   - https://youtu.be/roxC8SMs7HU
   - https://developers.google.com/identity/gsi/web/guides/client-library

## Without authentication

The app in this repository consists of two pages, "Top" and "Customer."

![Top no-auth](./images/NoauthTop.png "Top page - no auth")

![Customer no-auth](./images/NoauthCustomer.png "Customer page - no auth")

The Customer page, which fetches the data from the API server, is sensitive. Therefore it must not be seen by unauthenticated users.

## With authentication

With authentication implemented, anonymous users' access is redirected to the login page, where they can sign in with their Google account.

![Login page](./images/AuthLogin3-2.png "Login page")

The Customer page can only be seen after successful authentication.

![Customer page for authenticated users](./images/AuthCustomer.png "Customer page for authenticated users")

Please note that the authentication mechanism protects both the Customer page and data fetch from the API server.


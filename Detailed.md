# Detailed expranation of authentication related codes

## frontend

Most of the authentication-related codes are contained in AuthProvider.js.
There are the following components and a context in this file:
      AuthContext: a context to pass auth-related data between components.
      AuthProvider: main functions related to authentication.
      LogoutButton: a component to show the "Sign Out" button.
      UserLogin: a component to show the "Sign with Google button" and "Google One Tap."
      RequireAuth: a switcher to show restricted pages or redirect to the login page, depending on the auth status.

AuthProvider.js
~~~
import { useState, useRef, useMemo, useContext, createContext } from 'react';
import { Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useGoogleOneTapLogin, GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [LoadUser, setLoadUser] = useState(false);
    const userRef = useRef(null);

    const apiAxios = axios.create({
	baseURL: `${process.env.REACT_APP_API_SERVER}`,
	withCredentials: true,
    });

// This axios interceptor redirects to /login when data fetching from API server fails with 403.

    apiAxios.interceptors.response.use(response => {return response}, error => {
	if (error.response.status === 403) {
	    console.log("apiAxios failed. Redirecting to /login... ")
	    userRef.current = null;
	    navigate('/login', {state: { from: location }}, {replace: true});
	}
	return Promise.reject(error);
    });

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

    useMemo(() => {
	getUser();
	console.log("useMemo: user:", userRef.current?.username)
	console.log("useMemo: location:", location.pathname)
    }, [location]);

// A callback function "backendAuth" send Google's auth credential to the login endpoint of the API server.
// Then the backend server verifies the credential and creates a session.

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

    const handleLogout = () => {
	userRef.current = null;
	googleLogout();
	apiAxios.get(`/api/logout/`)
	    .catch(error => console.log("Logout failed: ", error))
	navigate(location);
    }

    const value = {
	onLogin: backendAuth,
	onLogout: handleLogout,
	user: userRef.current,
	LoadUser,
	apiAxios,
    };

    return (
	<AuthContext.Provider value={value} >
	    {children}
	</AuthContext.Provider>
    );
};

export const LogoutButton = () => {
    const { user, onLogout } = useContext(AuthContext);
    console.log("LogoutButton user:", user?.username)
    return (
	<>
	    {user && (
		<div>
		    Authenticated as {user?.username} &nbsp;
		    <button type="button" onClick={onLogout}>Sign Out</button>
		</div>
	    )}
	</>
    );
};

export const UserLogin = () => {
    const { onLogin } = useContext(AuthContext);

// Show the "Google One Tap."

    useGoogleOneTapLogin({
	onSuccess: r => onLogin(r),
	onError: () => { console.log('Google Login Failed') }
    });

// Show the "Sign with Google button."

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

export const RequireAuth = ({ children }) => {
    const { LoadUser, user } = useContext(AuthContext);
    const location = useLocation();

    console.log("RequireAuth: LoadUser:", LoadUser, "user:", user?.username)

// If the user is not null, we can regard her as having been authenticated.

    if (LoadUser || user) {
	return <Outlet />
    }

// Otherwise redirect to the login page.

    console.log("No user object! Redirecting to /login ...")
    return <Navigate to="/login" replace state={{ from: location }} />
};
~~~

The authentication mechanism in AuthProvider.js is made effective in App.js.
Changes required are indicated with "==>" and comments(starting with //) inline.

App.js
~~~
import { Routes, Route, Link } from 'react-router-dom';
import { Table, Container } from 'reactstrap';
==> import { GoogleOAuthProvider } from '@react-oauth/google';

import Customer from './Customer';
==> import { AuthProvider, LogoutButton, UserLogin, RequireAuth } from './AuthProvider'

const NoMatch = () => {
    return <h2>Page does not exist.</h2>;
}

const Top = () => {
    return <h2>This is top page.</h2>;
}

const App = () => {
  return (

// Make authentications effective.

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

// Limit access to "/customer" only to authenticated users.

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

export default App;
~~~

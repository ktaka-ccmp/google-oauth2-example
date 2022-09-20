import { useState, useMemo, useContext, createContext } from 'react';
import { Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useGoogleOneTapLogin, GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [Loading, setLoading] = useState(false);
    const [LoadUser, setLoadUser] = useState(true);

    const apiAxios = axios.create({
	baseURL: `${process.env.REACT_APP_API_SERVER}`,
	withCredentials: true,
    });

    apiAxios.interceptors.response.use(response => {
	return response
    }, (error) => {
	if (error.response.status === 403) {
	    console.log("Interceptor: Reauthenticating...");
	    setUser(null);
	    navigate('/login', {state: { from: location }}, {replace: true});
	}
	return Promise.reject(error);
    });

    const getUser = () => {
	setLoadUser(true);
	apiAxios.get(`/api/user/`)
	    .then(res => {
		setUser(res.data);
		setLoadUser(false);
	    })
	    .catch(error => {
		console.log(error.response)
	    })
    };

    const backendAuth = (response) => {
	const origin = location.state?.from?.pathname || '/' ;
	const data=JSON.stringify(response, null, 2);
	console.log("response\n", JSON.stringify(response, null, 2));

	setLoading(true);
	apiAxios.post(
	    `/api/login/`,
	    data,
	)
	    .then(res => {
		getUser();
		console.log("Backend Auth: ", res)
		setLoading(false);
		navigate(origin);
	    })
	    .catch(error => {
		console.log(error.response)
		console.log("Backend Auth Failed, redirecting to /login ")
		navigate('/login', {state: { from: location }}, {replace: true});
	    })
    }

    const handleLogout = () => {
	googleLogout();

	apiAxios.get(`/api/logout/`)
	    .catch(error => {
		console.log("Logout failed: ", error)
	    })

	window.location.reload();
    }

    const value = {
	onLogin: backendAuth,
	onLogout: handleLogout,
	Loading,
	LoadUser,
	user,
	getUser,
	apiAxios,
    };

    return (
	<AuthContext.Provider value={value}>
	    {children}
	</AuthContext.Provider>
    );
};

export const UserLogout = () => {
    const { user, getUser, onLogout } = useContext(AuthContext);

    useMemo(() => {
	getUser();
    }, []);

    return (
	<>
	    {user && (
		<div>
		    Authenticated as {user.username} &nbsp; 
		    <button type="button" onClick={onLogout}>Sign Out</button>
		</div>
	    )}
	</>
    );
};

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

export const RequireAuth = ({ children }) => {
    const { Loading, LoadUser, user } = useContext(AuthContext);
    const location = useLocation();

    console.log("Loading: ", Loading, "LoadUser: ", LoadUser, " user: ", user)

    if (!Loading && !LoadUser && !user) {
	    return <Navigate to="/login" replace state={{ from: location }} />
    }

    return <Outlet />
};

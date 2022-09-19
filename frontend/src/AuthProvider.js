import {
    useState,
    useMemo,
    useContext,
    createContext,
} from 'react';

import {
    Navigate,
    useNavigate,
    useLocation,
    Outlet,
} from 'react-router-dom';

import {
    useGoogleOneTapLogin,
    GoogleLogin,
    googleLogout,
} from '@react-oauth/google';

import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [Loading, setLoading] = useState(false);
    const [LoadUser, setLoadUser] = useState(true);
    const [googleResponse, setGoogleResponse] = useState(null);

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
	    if (googleResponse == null) {
		navigate('/login', {state: { from: location }}, {replace: true});
	    } else {
		backendAuth(googleResponse);
	    }
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
	setGoogleResponse(response);
	const origin = location.state?.from?.pathname || '/' ;
	const data=JSON.stringify(response, null, 2);
	console.log("GoogleResponse", JSON.stringify(response, null, 2));

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
		console.log("(Provably, Google Oauth2 token expired.)")
		navigate('/login', {state: { from: location }}, {replace: true});
	    })
    }

    const handleLogout = () => {
	googleLogout();

	apiAxios.get(`/api/logout/`)
	    .then(res => {
		console.log("Logout: ", res)
	    })
	    .catch(error => {
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
	googleResponse,
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
	console.log("getUser");
	getUser();
    }, []);

    return (
	<div>
	    {user && (
		<>
		    Authenticated as {user.username} <br/>
		    <button type="button" onClick={onLogout}>
			Sign Out
		    </button>
		</>
	    )}
	</div>
    );
};

export const UserLogin = () => {
    console.log('Login Page')

    const { onLogin } = useContext(AuthContext);

    useGoogleOneTapLogin({
	onSuccess: r => onLogin(r),
	onError: () => {
	    console.log('Login Failed')
	}
    });

    return (
	<div className="App">
	    <GoogleLogin
		theme="filled_black"
		shape="pill"
		onSuccess={onLogin}
		onError={() => {
		    console.log('Login Failed');
		}}
		/>
	</div>
    );
};

export const RequireAuth = ({ children }) => {
    const { Loading, LoadUser, user } = useContext(AuthContext);
    const location = useLocation();

    console.log("Loading: ", Loading, "LoadUser: ", LoadUser, " user: ", user)

    if (!Loading && !LoadUser && !user) {
	    return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

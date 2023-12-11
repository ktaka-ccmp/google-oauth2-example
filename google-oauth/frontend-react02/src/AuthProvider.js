import { useState, useRef, useMemo, useEffect, useContext, createContext } from 'react';
import { Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
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

    apiAxios.interceptors.response.use(response => {return response}, error => {
	if (error.response.status === 401 || error.response.status === 403) {
	    console.log("apiAxios failed. Redirecting to /login... ")
	    userRef.current = null;
		if (location.pathname!=="/login"){
			navigate('/login', {state: { from: location }}, {replace: true});
		}
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
	apiAxios.get(`/api/logout/`)
	    .then(res => navigate(location))
	    .catch(error => console.log("Logout failed: ", error))
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

    useEffect(() => {
	google.accounts.id.initialize({
	    /* global google */
	    client_id: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID,
	    callback: r => onLogin(r),
	    ux_mode: "popup",
//	    ux_mode: "redirect",
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

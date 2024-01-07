import { useState, useMemo, useEffect, useContext, createContext } from 'react';
import { Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [LoadUser, setLoadUser] = useState(false);
	const [User, setUser] = useState(null);

	const apiAxios = axios.create({
		baseURL: `${process.env.REACT_APP_API_SERVER}`,
		withCredentials: true,
	});

	const getUser = () => {
		setLoadUser(true)
		setUser(null)
		apiAxios.get(`/api/user/`)
		.then(res => setUser(res.data))
		.catch(error => console.log("getUser faild: ", error.response))
		.finally(() => {
			setLoadUser(false)
			console.log("getUser: user:", User)
			console.log("getUser: location:", location.pathname)
		})
	};

	useMemo(() => {
		getUser();
	}, [location]);

    const backendAuth = (response) => {
		const origin = location.state?.from?.pathname || '/' ;
		const data=JSON.stringify(response, null, 2);
		console.log("backendAuth: response\n", JSON.stringify(response, null, 2));
		console.log("backendAuth: location.state.from\n", location.state.from)

		apiAxios.post(`/api/login/`, data, )
		.then(res => {
			console.log("backendAuth: res.data", res.data)
			navigate(origin);
		})
		.catch(error => {
			console.log(error.response)
			console.log("backendAuth failed. Redirecting to /login... ")
			navigate('/login', {state: { from: location }}, {replace: true});
		})
	}

	const handleLogout = () => {
		apiAxios.get(`/api/logout/`)
		.catch(error => console.log("Logout failed: ", error))
		.finally(() => {
			setUser(null);
			console.log("handleLogout redirecting to ", location.pathname)
			navigate(location);
		})
	}

    const value = {
		onLogin: backendAuth,
		onLogout: handleLogout,
		user: User,
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

export const RequireAuth = () => {
    const { LoadUser, user } = useContext(AuthContext);
    const location = useLocation();

    console.log("RequireAuth: user:", user)

    if (LoadUser || user) {
		return <Outlet />
    } else {
		console.log("RequireAuth: Redirecting to /login ...")
		return <Navigate to="/login" replace state={{ from: location }} />
	}
};

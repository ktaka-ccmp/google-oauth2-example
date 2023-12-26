import axios from "axios";
import { navigate } from "svelte-routing";

export const apiAxios = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_SERVER}`,
  withCredentials: true,
});

apiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      console.log(
        "apiAxios failed. Redirecting to /login... from",
        location.pathname
      );
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
    return Promise.reject(error);
  }
);

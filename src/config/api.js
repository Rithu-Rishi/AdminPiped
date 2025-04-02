import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "./constants";

const API = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true, // Important: allows cookies (CSRF token) to be sent
});

// Request interceptor to add CSRF token
API.interceptors.request.use((config) => {
    const csrfToken = Cookies.get("XSRF-TOKEN"); // Laravel stores CSRF token in this cookie
    if (csrfToken) {
        config.headers["X-XSRF-TOKEN"] = csrfToken; // Attach CSRF token to headers
    }

    const authToken = sessionStorage.getItem("token");
    if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`; // (Optional: for adding auth tokens)
    }

    return config;
});

// Function to set Authorization token dynamically
export const setAuthToken = (token) => {
    if (token) {
        sessionStorage.setItem("token", token);
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        sessionStorage.removeItem("token");
        delete API.defaults.headers.common["Authorization"];
    }
};

export default API;
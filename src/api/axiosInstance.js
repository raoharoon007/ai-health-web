import axios from "axios";
import { removeAuthToken } from "../utils/auth";

// ✅ STEP 1: Define the logic OUTSIDE the object
const baseURL = import.meta.env.MODE === "production"
  ? "/ai-health"                         // 🟢 On Vercel: Use the secure proxy
  : "http://98.81.203.81/ai-health";     // 🟡 On Localhost: Use the direct link

// ✅ STEP 2: Pass the variable into axios
const api = axios.create({
    baseURL: baseURL, 
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 Request interceptor — attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🚪 Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Token expired or unauthorized");

            removeAuthToken();

            // Only redirect to login if not already on auth pages
            const currentPath = window.location.pathname;
            if (currentPath !== "/login" && currentPath !== "/signup") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
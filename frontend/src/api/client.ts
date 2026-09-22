import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Use the env variable in production; fall back to localhost in development.
// This ensures the URL is never "undefined/api/v1".
const BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor — attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — auto-refresh access token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Use BASE_URL (not import.meta.env directly) to avoid "undefined" prefix
          const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          localStorage.setItem("accessToken", data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return axios(originalRequest);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;


import axios from "axios";
const base = import.meta.env.VITE_API_BASE;
const envVersion = import.meta.env.VITE_API_VERSION;
const api = axios.create({
  baseURL: `${base}/${envVersion}`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;

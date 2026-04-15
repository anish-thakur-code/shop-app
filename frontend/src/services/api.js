import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// 🔥 AUTO TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 OPTIONAL ERROR HANDLER (recommended)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
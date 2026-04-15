import axios from "axios";

// 🔥 ALWAYS hit full backend URL in production
const API = axios.create({
  baseURL: "https://shop-app-1-l1m7.onrender.com/api"
});

// TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ERROR HANDLER
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;
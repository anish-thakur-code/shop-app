import axios from "axios";

const API = axios.create({
  baseURL: "https://shop-app-1-l1m7.onrender.com/api" // 🔥 FINAL FIX
});

console.log("BASE URL:", API.defaults.baseURL);

// 🔥 TOKEN AUTO ATTACH
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 ERROR HANDLER
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
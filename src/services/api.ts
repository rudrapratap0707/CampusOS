import axios from "axios";

const API = axios.create({
  baseURL: "https://campusos-7p9m.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("campusos_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

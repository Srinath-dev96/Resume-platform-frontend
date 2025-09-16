import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
});

// Token automatic attach cheyyadam
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// uploadClient.js
import axios from "axios";

const uploadClient = axios.create({
  baseURL: "https://cre8tlystudio.com/api",
  timeout: 0, // no timeout
  withCredentials: true,
});

// ONLY attach auth, touch nothing else
uploadClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default uploadClient;

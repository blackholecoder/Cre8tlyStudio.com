import axios from "axios";
import { toast } from "react-toastify";
import { isTokenExpired, refreshAccessToken } from "../admin/authHelpers";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://themessyattic.com/api"
    : "https://themessyattic.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// ✅ Request interceptor → attach token
axiosInstance.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");

  // 🔑 PREVENT expired tokens from ever leaving the browser
  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Response interceptor → refresh and retry seamlessly

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.warning("Your session expired. Please log in again.");
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshAccessToken();
        window.location.reload();
      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

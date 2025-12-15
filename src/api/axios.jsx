import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://cre8tlystudio.com/api"
    : "https://cre8tlystudio.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// 🔐 Single refresh lock so multiple 401s don't collide
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

// ✅ Request interceptor → attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Refresh token logic (atomic)
async function refreshToken() {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) throw new Error("No refresh token found");

    const res = await axios.post(`${BASE_URL}/auth/refresh`, {
      token: storedRefresh,
    });
    const { accessToken, refreshToken: newRefresh } = res.data;

    // ✅ Safely store new tokens
    localStorage.setItem("accessToken", accessToken);
    if (newRefresh) localStorage.setItem("refreshToken", newRefresh);

    axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

    onRefreshed(accessToken);
    return accessToken;
  } catch (err) {
    console.error("Token refresh failed:", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw err;
  } finally {
    isRefreshing = false;
  }
}

// ✅ Response interceptor → refresh and retry seamlessly
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();

        // Wait if another refresh is already in progress
        if (!newToken) {
          return new Promise((resolve) => {
            refreshSubscribers.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh retry failed:", refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 403) {
      toast.warning("Your session expired. Please log in again.");
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

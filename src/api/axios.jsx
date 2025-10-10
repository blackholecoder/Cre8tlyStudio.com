import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://cre8tlystudio.com/api" // ✅ use Nginx proxy
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

// ✅ Attach token automatically to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // store short-lived access token
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Refresh token function
async function refreshToken() {
  try {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("No refresh token");

    const res = await axios.post(`${BASE_URL}/auth/refresh`, { token: refresh });
    const { accessToken, refreshToken: newRefresh } = res.data;

    // Save new tokens
    localStorage.setItem("accessToken", accessToken);
    if (newRefresh) localStorage.setItem("refreshToken", newRefresh);

    // Update axios defaults
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;

    return accessToken;
  } catch (err) {
    console.error("Token refresh failed:", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw err;
  }
}

// ✅ Handle 401s and retry request after refreshing token
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

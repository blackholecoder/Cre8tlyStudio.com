// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children, navigate }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔹 Save tokens & user
  function saveAuth(userData, token, refreshToken) {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  // 🔹 Login
  async function login(email, password) {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const data = res.data;
      saveAuth(data.user, data.accessToken, data.refreshToken);

      toast.success("🎉 Login successful!", {
  className:
    "bg-transparent !bg-transparent border-2 border-green text-white font-bold rounded-lg shadow-[0_0_15px_rgba(123,237,159,0.6)]",
});
    } catch (err) {
      toast.error("❌ Login failed. Please check your credentials.", {
        className: "bg-red-600 text-white font-semibold rounded-lg shadow-md",
      });
    }
  }

  // 🔹 Refresh Access Token
  async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const res = await axiosInstance.post("/auth/refresh", { token: refreshToken });
      const data = res.data;

      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return data.accessToken;
    } catch (err) {
      console.error("Refresh failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
      return null;
    }
  }

  // 🔹 Logout
  async function logout() {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setAccessToken(null);
    localStorage.clear();

    navigate("/"); // 👈 send them to homepage (or /login if you prefer)
  }

  // 🔹 Restore user on mount
  useEffect(() => {
    async function restoreUser() {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAccess = localStorage.getItem("accessToken");
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedAccess) setAccessToken(storedAccess);

        const token = await refreshAccessToken();
        if (token) {
          const res = await axiosInstance.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Failed to restore user:", err);
      } finally {
        setAuthLoading(false); // ✅ always stop loading
      }
    }
    restoreUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, authLoading, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

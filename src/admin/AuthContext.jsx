// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  function enrichUser(u) {
    if (!u) return null;
    const now = new Date();

    // Calculate derived fields
    const expired =
      u.free_trial_expires_at && new Date(u.free_trial_expires_at) < now;

    return {
      ...u,
      isFreeTier: u.has_free_magnet === 1 && u.magnet_slots === 1,
      trialExpired: expired,
    };
  }

  // 🔹 Save tokens & user
  function saveAuth(userData, token, refreshToken) {
    const enriched = enrichUser(userData);
    setUser(enriched);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(enriched));
    localStorage.setItem("accessToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  }

  // 🔹 Login
  async function login(email, password) {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const data = res.data;

      // 🧩 1. If the backend requires 2FA, don't store tokens yet
      if (data.requires2FA && data.twofaToken) {
        return {
          requires2FA: true,
          twofaToken: data.twofaToken, // temporary token for verification step
          message: data.message,
        };
      }

      // 🧩 2. Otherwise, normal login flow (save tokens only)
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      if (!accessToken) throw new Error("Missing access token from login");

      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      // 🧩 3. Always pull fresh user data from /auth/me to include Stripe & latest fields
      const meRes = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const enriched = enrichUser(meRes.data);
      setUser(enriched);
      await refreshUser();
      localStorage.setItem("user", JSON.stringify(enriched));

      return { requires2FA: false };
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }

  // 🔹 Refresh Access Token
  async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const res = await axiosInstance.post("/auth/refresh", {
        token: refreshToken,
      });
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

  function logout() {
    try {
      axiosInstance.post("/auth/logout");
    } catch {}
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  useEffect(() => {
    const timer = setTimeout(() => refreshAccessToken(), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function restoreUser() {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedAccess) setAccessToken(storedAccess);

        // ✅ Only try refreshing if we have a refresh token but no access token
        if (!storedAccess && storedRefresh) {
          const token = await refreshAccessToken();
          if (token) {
            const res = await axiosInstance.get("/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(enrichUser(res.data));
            localStorage.setItem("user", JSON.stringify(enrichUser(res.data)));
          }
        }
      } catch (err) {
        console.error("Failed to restore user:", err);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreUser();
  }, []);

  async function refreshUser() {
    try {
      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const enriched = enrichUser(res.data);
      setUser(enriched);
      localStorage.setItem("user", JSON.stringify(enriched));
      return enriched;
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      toast.error("Failed to refresh user data");
      return null;
    }
  }

  // Silent refresh every 12 minutes to prevent expiry during work
  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshAccessToken();
      },
      12 * 60 * 1000
    ); // every 12 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        authLoading,
        login,
        logout,
        refreshAccessToken,
        refreshUser,
        saveAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

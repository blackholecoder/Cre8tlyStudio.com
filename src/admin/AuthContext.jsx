// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children, navigate }) {
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
      saveAuth(data.user, data.accessToken, data.refreshToken);

      // 🔥 Immediately refresh user data to include latest fields (like pro_covers)
      try {
        const meRes = await axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        const enriched = enrichUser(meRes.data);
        setUser(enriched);
        localStorage.setItem("user", JSON.stringify(enriched));
      } catch (fetchErr) {
        console.error("Failed to fetch fresh user data after login:", fetchErr);
      }
    } catch (err) {
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
    navigate("/");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

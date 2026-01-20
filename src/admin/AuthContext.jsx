// AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

function applyTheme(theme) {
  if (!theme) return;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
}

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
      theme: u.theme || "dark",
      isFreeTier: u.has_free_magnet === 1 && u.magnet_slots === 1,
      trialExpired: expired,
    };
  }

  // 🔹 Save tokens & user
  function saveAuth(userData, token, refreshToken) {
    const enriched = enrichUser(userData);
    setUser(enriched);
    setAccessToken(token);
    applyTheme(enriched.theme);
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
      applyTheme(enriched.theme);
      await refreshUser();
      localStorage.setItem("user", JSON.stringify(enriched));

      return { requires2FA: false };
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
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

  async function updateTheme(theme) {
    try {
      applyTheme(theme);

      await axiosInstance.post("/auth/theme", { theme });

      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, theme };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  }

  useEffect(() => {
    async function restoreUser() {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAccess = localStorage.getItem("accessToken");

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          applyTheme(parsed.theme);
        }
        if (storedAccess) setAccessToken(storedAccess);

        if (storedAccess) {
          const res = await axiosInstance.get("/auth/me");
          const enriched = enrichUser(res.data);
          setUser(enriched);
          localStorage.setItem("user", JSON.stringify(enriched));
          applyTheme(enriched.theme);
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
    let token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      // 2️⃣ Fetch user with a valid token
      const res = await axiosInstance.get("/auth/me");

      const enriched = enrichUser(res.data);
      setUser(enriched);
      localStorage.setItem("user", JSON.stringify(enriched));
      return enriched;
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      return null;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        authLoading,
        login,
        logout,
        refreshUser,
        saveAuth,
        updateTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

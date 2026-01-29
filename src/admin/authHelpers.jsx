import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://themessyattic.com/api"
    : "https://themessyattic.com/api";

let refreshInFlight = false;
let refreshPromise = null;

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function refreshAccessToken() {
  if (refreshInFlight) return refreshPromise;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  refreshInFlight = true;

  refreshPromise = (async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/refresh`, {
        token: refreshToken,
      });

      const { accessToken, refreshToken: newRefresh } = res.data;

      localStorage.setItem("accessToken", accessToken);
      if (newRefresh) {
        localStorage.setItem("refreshToken", newRefresh);
      }

      return accessToken;
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw err;
    } finally {
      refreshInFlight = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../admin/AuthContext.jsx";

// Create context
const MagnetContext = createContext();

export function MagnetProvider({ children }) {
  const { accessToken } = useAuth();
  const [magnets, setMagnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------------------------
  // Fetch magnets once
  // -------------------------------
  const fetchMagnets = async () => {
    if (!accessToken) return;
    try {
      const res = await axios.get("https://cre8tlystudio.com/api/lead-magnets", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMagnets(res.data);
    } catch (err) {
      console.error("Error fetching lead magnets:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Background polling
  // -------------------------------
  useEffect(() => {
    if (!accessToken) return;

    fetchMagnets(); // initial load

    const interval = setInterval(async () => {
      try {
        const res = await axios.get("https://cre8tlystudio.com/api/lead-magnets", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // ✅ Only update if changed
        setMagnets((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(res.data)) return prev;
          return res.data;
        });
      } catch (err) {
        console.warn("Polling error:", err.message);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [accessToken]);

  // Expose context values
  return (
    <MagnetContext.Provider value={{ magnets, setMagnets, fetchMagnets, loading, error }}>
      {children}
    </MagnetContext.Provider>
  );
}

// Custom hook
export function useMagnets() {
  return useContext(MagnetContext);
}

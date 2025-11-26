import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

export default function useMaintenance() {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const { data } = await axiosInstance.get("/admin/settings/maintenance");
        setMaintenance(data.maintenance);
      } catch {
        setMaintenance(false);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  return { maintenance, loading };
}

import { useEffect, useState } from "react";
import { useAuth } from "../admin/AuthContext.jsx";
import axios from "axios";

export default function AdminDashboard() {
  const { accessToken } = useAuth();
  const [magnets, setMagnets] = useState([]);

  useEffect(() => {
    async function fetchAllMagnets() {
      try {
        const res = await axios.get("https://cre8tlystudio.com/api/lead-magnets/all", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setMagnets(res.data);
      } catch (err) {
        console.error("Error fetching all lead magnets:", err);
      }
    }
    fetchAllMagnets();
  }, [accessToken]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">All Lead Magnets</h1>
      <ul className="space-y-2">
        {magnets.map((m) => (
          <li key={m.id} className="bg-charcoal p-4 rounded-lg text-white">
            <p>User: {m.user_id}</p>
            <p>Prompt: {m.prompt}</p>
            <p>Status: <span className="text-green">{m.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

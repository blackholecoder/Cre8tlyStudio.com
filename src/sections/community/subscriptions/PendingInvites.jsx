import { useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";

export default function PendingInvites({ refreshKey }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchInvites() {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/community/subscriptions/invites");
      setInvites(res.data.invites || []);
    } catch {
      toast.error("Failed to load invites");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInvites();
  }, [refreshKey]);

  async function resendInvite(id) {
    try {
      await axiosInstance.post(`/community/subscriptions/invites/${id}/resend`);
      toast.success("Invite resent");
    } catch {
      toast.error("Failed to resend invite");
    }
  }

  async function cancelInvite(id) {
    if (!window.confirm("Cancel this invite?")) return;

    try {
      await axiosInstance.delete(`/community/subscriptions/invites/${id}`);
      setInvites((prev) => prev.filter((i) => i.id !== id));
      toast.success("Invite cancelled");
    } catch {
      toast.error("Failed to cancel invite");
    }
  }

  if (loading) {
    return <p className="text-sm opacity-60">Loading invites…</p>;
  }

  if (!invites.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold mb-3">Pending invites</h2>

      <div className="rounded-xl border border-dashboard-border-light dark:border-dashboard-border-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dashboard-hover-light dark:bg-dashboard-hover-dark">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Sent</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr
                key={invite.id}
                className="border-t border-dashboard-border-light dark:border-dashboard-border-dark"
              >
                <td className="p-3">{invite.email}</td>
                <td className="p-3">
                  {new Date(invite.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => resendInvite(invite.id)}
                    className="p-2 rounded-md hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                    title="Resend"
                  >
                    <RotateCcw size={14} />
                  </button>

                  <button
                    onClick={() => cancelInvite(invite.id)}
                    className="p-2 rounded-md hover:bg-red-500/10 text-red-500"
                    title="Cancel"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

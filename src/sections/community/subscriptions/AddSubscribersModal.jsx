import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";

export default function AddSubscribersModal({ open, onClose, onSuccess }) {
  const [emails, setEmails] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function addEmail() {
    const email = input.trim().toLowerCase();
    if (!email) return;

    if (emails.includes(email)) {
      toast.info("Email already added");
      return;
    }

    setEmails((prev) => [...prev, email]);
    setInput("");
  }

  function removeEmail(email) {
    setEmails((prev) => prev.filter((e) => e !== email));
  }

  function handleCsvUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const rows = reader.result
        .split(/\r?\n/)
        .map((r) => r.trim())
        .filter(Boolean);

      const parsed = rows
        .map((r) => r.split(",")[0]?.trim().toLowerCase())
        .filter(Boolean);

      setEmails((prev) => [...new Set([...prev, ...parsed])]);
    };

    reader.readAsText(file);
  }

  async function sendInvites() {
    if (!emails.length) {
      toast.error("Add at least one email");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/community/subscriptions/invites", {
        emails,
      });

      toast.success("Invites sent");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to send invites");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="
        w-full max-w-lg
        mx-4 sm:mx-6 md:mx-0
        rounded-2xl
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        p-6
      "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add subscribers</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Manual input */}
        <div className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="email@example.com"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 rounded-lg px-3 py-2 text-sm border bg-dashboard-bg-light dark:bg-dashboard-bg-dark"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addEmail();
              }
            }}
          />
          <button
            onClick={addEmail}
            className="px-3 rounded-lg bg-dashboard-hover-light dark:bg-dashboard-hover-dark"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* CSV upload */}
        <label className="flex items-center gap-2 text-sm cursor-pointer opacity-80 hover:opacity-100 mb-4">
          <Upload size={14} />
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="hidden"
          />
        </label>

        {/* Email list */}
        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {emails.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-dashboard-hover-light dark:bg-dashboard-hover-dark"
              >
                {email}
                <button onClick={() => removeEmail(email)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={sendInvites}
            disabled={loading}
            className="text-sm px-4 py-2 rounded-lg bg-blue text-white disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send invites"}
          </button>
        </div>
      </div>
    </div>
  );
}

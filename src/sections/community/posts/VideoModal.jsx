import { useState } from "react";
import { X } from "lucide-react";
export function VideoModal({ open, onClose, onInsert }) {
  const [url, setUrl] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark border border-dashboard-border-light dark:border-dashboard-border-dark p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dashboard-text-light dark:text-dashboard-text-dark">
            Insert YouTube Video
          </h3>
          <button onClick={onClose} className="hover:opacity-80">
            <X size={20} />
          </button>
        </div>

        <input
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-dashboard-bg-light dark:bg-dashboard-bg-dark border border-dashboard-border-light dark:border-dashboard-border-dark"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!url) return;
              onInsert(url);
              setUrl("");
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-green text-black"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

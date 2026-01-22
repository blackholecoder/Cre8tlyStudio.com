import { useState } from "react";

export function LinkModal({ open, onClose, onSubmit }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("click here");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark p-6 rounded-xl w-full max-w-sm border border-dashboard-border-light dark:border-dashboard-border-dark shadow-xl">
        <h3 className="font-semibold mb-4 text-dashboard-text-light dark:text-dashboard-text-dark">
          Insert link
        </h3>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Link text"
          className="w-full mb-3 p-2 rounded border border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full mb-4 p-2 rounded border border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-sm opacity-70">
            Cancel
          </button>

          <button
            onClick={() => {
              if (!url) return;
              onSubmit({ url, text });
              setUrl("");
              setText("click here");
              onClose();
            }}
            className="px-3 py-1 bg-green text-black rounded"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PreviewSubscribeModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          relative
          w-full max-w-md
          rounded-2xl
          bg-white dark:bg-[#0f1216]
          p-6
          shadow-xl
          border
          border-dashboard-border-light
          dark:border-dashboard-border-dark
        "
      >
        <h3 className="text-sm font-semibold mb-2">
          Preview subscription page?
        </h3>

        <p className="text-sm opacity-70 mb-5">
          You have unsaved changes. The preview will show your last saved
          subscription settings, not your current edits.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              px-4 py-2
              rounded-lg
              text-sm
              border
              hover:bg-dashboard-hover-light
              dark:hover:bg-dashboard-hover-dark
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              px-4 py-2
              rounded-lg
              text-sm
              bg-blue
              text-white
              hover:opacity-90
            "
          >
            Preview anyway
          </button>
        </div>
      </div>
    </div>
  );
}

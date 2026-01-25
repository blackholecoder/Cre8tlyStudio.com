export default function SendTestEmailModal({
  open,
  email,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="
        w-full max-w-sm rounded-xl
        bg-dashboard-bg-light dark:bg-dashboard-bg-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        p-6
      "
      >
        <h3 className="text-lg font-semibold mb-2">Send test email?</h3>

        <p className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark mb-6">
          This will send a test email to <strong>{email}</strong>.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-dashboard-border-light dark:border-dashboard-border-dark"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

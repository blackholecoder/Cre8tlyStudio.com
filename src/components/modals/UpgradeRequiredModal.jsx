import { useNavigate } from "react-router-dom";

export default function UpgradeRequiredModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="
        w-full max-w-md rounded-xl p-6 shadow-xl
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        text-dashboard-text-light dark:text-dashboard-text-dark
      "
      >
        <h2 className="text-xl font-semibold mb-2">Upgrade Required!</h2>

        <p className="text-sm mb-6 text-dashboard-muted-light dark:text-dashboard-muted-dark">
          You can’t use this feature on your current plan. Upgrade to unlock it
          and continue.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
            px-4 py-2 rounded-lg text-sm transition
            bg-dashboard-hover-light dark:bg-dashboard-hover-dark
            text-dashboard-text-light dark:text-dashboard-text-dark
            hover:opacity-90
          "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/dashboard/plans");
            }}
            className="
            px-4 py-2 rounded-lg text-sm font-medium transition
            bg-green text-black hover:opacity-90
          "
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}

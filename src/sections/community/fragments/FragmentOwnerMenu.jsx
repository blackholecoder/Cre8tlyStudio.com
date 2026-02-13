import { useState } from "react";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { toast } from "react-toastify";

export default function FragmentOwnerMenu({ fragmentId, isOwner, onDeleted }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!isOwner) return null;

  function confirmDelete() {
    const toastId = toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm font-medium">Delete this fragment?</p>
          <p className="text-xs opacity-70">This cannot be undone.</p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 text-xs rounded-md border"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                try {
                  await axiosInstance.delete(`/fragments/${fragmentId}`);
                  toast.dismiss(toastId);
                  toast.success("Fragment deleted");

                  if (onDeleted) onDeleted(fragmentId);
                } catch {
                  toast.error("Failed to delete fragment");
                }
              }}
              className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { closeButton: false, className: "rounded-xl" },
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-md hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
      >
        <Ellipsis size={18} />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            absolute right-0 mt-2 z-30
            w-48
            rounded-xl
            bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light dark:border-dashboard-border-dark
            shadow-xl
            overflow-hidden
          "
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              navigate(`/community/fragments/edit/${fragmentId}`);
            }}
            className="w-full px-4 py-3 text-sm text-left hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark flex items-center gap-2"
          >
            <Pencil size={16} />
            Edit
          </button>

          <div className="h-px bg-dashboard-border-light dark:bg-dashboard-border-dark" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              confirmDelete();
            }}
            className="w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-red-500/10 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

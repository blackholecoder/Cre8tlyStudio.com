import { toast } from "react-toastify";

export function confirmDelete({ message = "Delete this comment?", onConfirm }) {
  toast(
    ({ closeToast }) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm">{message}</p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              closeToast();
            }}
            className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              closeToast();
              onConfirm();
            }}
            className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
}

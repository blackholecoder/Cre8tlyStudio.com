export default function DownloadLockWarningModal({
  open,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999] px-6">
      <div className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <h2 className="text-xl font-semibold text-white mb-3">
          ⚠️ Final Download Warning
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Downloading this book will permanently lock editing for this document.
          <br />
          <br />
          You will still be able to view and download it again, but you won’t be
          able to make any further changes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onCancel}
            className="bg-gray-800 border border-gray-700 text-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-600/90 transition"
          >
            Download & Lock
          </button>
        </div>
      </div>
    </div>
  );
}

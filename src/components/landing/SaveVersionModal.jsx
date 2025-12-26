import React from "react";

export default function SaveVersionModal({
  isOpen,
  name,
  setName,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[500]">
      <div className="bg-[#111827] border border-gray-700 rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-silver mb-4 text-center">
          Save Template Version
        </h2>

        <p className="text-gray-400 text-sm mb-6 text-center">
          Give this version a name so you can restore it later.
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Gradient Header Update"
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 
                     focus:ring-2 focus:ring-green focus:outline-none"
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-green text-black font-semibold shadow hover:bg-green transition"
          >
            Save Version
          </button>
        </div>
      </div>
    </div>
  );
}

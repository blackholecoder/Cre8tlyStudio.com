import React from "react";

export default function VersionControls({
  versions,
  selectedVersion,
  setSelectedVersion,
  appliedVersion,
  handleLoadVersion,
  handleApplyVersion,
  handleDeleteVersion,
}) {
  const applyDisabled = !selectedVersion || selectedVersion === appliedVersion;

  return (
    <div className="w-full bg-[#0f1624]/80 border border-gray-700 rounded-xl p-5 mb-10 shadow-inner pb-12">
      {/* Dropdown */}
      <div className="relative w-full mb-6">
        <select
          className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg border border-gray-600 
            focus:ring-2 focus:ring-green appearance-none"
          value={selectedVersion}
          onChange={handleLoadVersion}
        >
          <option value="">Load saved version…</option>
          {versions.map((v) => {
            const timestamp = v.updated_at || v.created_at;

            return (
              <option key={v.id} value={v.id}>
                {v.name} ({new Date(timestamp).toLocaleString()})
              </option>
            );
          })}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
          ▼
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button
          disabled={applyDisabled}
          onClick={!applyDisabled ? handleApplyVersion : undefined}
          className={`font-semibold px-6 py-2 rounded-lg shadow text-sm transition
            ${
              applyDisabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green text-black hover:bg-green/90"
            }
          `}
        >
          Apply
        </button>

        {selectedVersion && (
          <button
            type="button"
            onClick={handleDeleteVersion}
            className="px-6 py-2 rounded-lg bg-red-600/20 border border-red-500 text-red-300 
              hover:bg-red-600/30 hover:text-red-200 transition text-sm font-semibold"
          >
            Delete
          </button>
        )}
        {selectedVersion && (
          <button
            type="button"
            onClick={() => {
              setSelectedVersion("");
            }}
            className="px-6 py-2 rounded-lg bg-gray-700/50 border border-gray-500 text-gray-300 
        hover:bg-gray-600/70 hover:text-white transition text-sm font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

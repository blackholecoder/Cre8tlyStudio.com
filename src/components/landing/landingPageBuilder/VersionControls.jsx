import React from "react";

export default function VersionControls({
  versions,
  selectedVersion,
  handleLoadVersion,
  handleApplyVersion,
  handleDeleteVersion,
}) {
  return (
    <div className="w-full bg-[#0f1624]/80 border border-gray-700 rounded-xl p-5 mb-10 shadow-inner">
      {/* Dropdown */}
      <div className="relative w-full mb-6">
        <select
          className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg border border-gray-600 
            focus:ring-2 focus:ring-green appearance-none"
          value={selectedVersion}
          onChange={handleLoadVersion}
        >
          <option value="">Load saved version…</option>
          {versions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({new Date(v.created_at).toLocaleString()})
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
          ▼
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button
          className="bg-green text-black font-semibold px-6 py-2 rounded-lg shadow hover:bg-green/90 transition text-sm"
          onClick={handleApplyVersion}
        >
          Apply
        </button>

        {selectedVersion && (
          <button
            onClick={handleDeleteVersion}
            className="px-6 py-2 rounded-lg bg-red-600/20 border border-red-500 text-red-300 
              hover:bg-red-600/30 hover:text-red-200 transition text-sm font-semibold"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

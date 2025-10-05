export default function MagnetCardList({ magnets = [], onAddPrompt }) {
  if (!Array.isArray(magnets) || magnets.length === 0) return null;

  return (
    <div className="md:hidden space-y-4">
      {magnets.map((m, i) => (
        <div
          key={m.id}
          className="bg-neo p-4 rounded-xl shadow border border-gray-700"
        >
          {/* Slot number */}
          <p className="text-sm text-white font-semibold mb-2">
            Slot #{m.slot_number || i + 1}
          </p>

          <p className="text-sm text-silver">
            <span className="font-semibold">Created:</span>{" "}
            {new Date(m.created_at).toLocaleDateString()}{" "}
            {new Date(m.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="text-sm text-silver mt-1">
            <span className="font-semibold">Status:</span>{" "}
            {m.status === "completed" ? (
              <span className="bg-green text-black px-2 py-1 rounded-full text-xs font-semibold">
                Completed
              </span>
            ) : m.status === "failed" ? (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Failed
              </span>
            ) : m.status === "pending" ? (
              <span className="flex items-center gap-2 text-yellow-400 italic">
                <svg
                  className="animate-spin h-4 w-4 text-yellow"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Generating your PDF…
              </span>
            ) : (
              <span className="text-gray-400 italic">Awaiting prompt…</span>
            )}
          </p>

          <p className="text-sm text-silver mt-1">
            <span className="font-semibold">Prompt:</span>{" "}
            {m.prompt ? "Submitted" : "Awaiting prompt…"}
          </p>

          <div className="flex gap-2 mt-3">
            {!m.prompt && (
              <button
                onClick={() => onAddPrompt(m.id)}
                className="flex-1 px-3 py-2 bg-royalPurple text-white rounded"
              >
                Add Prompt
              </button>
            )}
            {m.pdf_url && (
              <>
                <a
                  href={m.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-blue text-white rounded text-center"
                >
                  View
                </a>
                <a
                  href={m.pdf_url}
                  download={`lead-magnet-${m.id}.pdf`}
                  className="flex-1 px-3 py-2 bg-downloadGreen text-white rounded text-center"
                >
                  Download
                </a>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

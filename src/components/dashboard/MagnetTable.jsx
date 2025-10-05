export default function MagnetTable({ magnets = [], onAddPrompt }) {
  if (!Array.isArray(magnets) || magnets.length === 0) return null;

  return (
    <div className="bg-[#111] hidden md:block overflow-x-auto">
      <table className="min-w-full border border-gray-700 text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Slot</th>
            <th className="px-4 py-2 text-left">Created</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Prompt</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {magnets.map((m) => (
            <tr key={m.id} className="border-t border-gray-700">
              <td className="px-4 py-2">Slot #{m.slot_number}</td>

              <td className="px-4 py-2">
                {new Date(m.created_at).toLocaleDateString()}{" "}
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="px-4 py-2">
                {m.status === "completed" ? (
                  <span className="bg-green text-black px-2 py-1 rounded-full text-xs font-semibold">
                    Completed
                  </span>
                ) : m.status === "failed" ? (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Failed
                  </span>
                ) : m.status === "pending" ? (
                  <span className="flex items-center gap-2 text-yellow italic">
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
              </td>

              <td className="px-4 py-2">
                {m.prompt ? "Submitted" : "Awaiting prompt…"}
              </td>

              <td className="px-4 py-2 flex gap-2">
                {!m.prompt && (
                  <button
                    onClick={() => onAddPrompt(m.id)}
                    className="px-3 py-1 bg-royalPurple rounded text-sm"
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
                      className="px-3 py-1 bg-blue rounded text-sm"
                    >
                      View
                    </a>
                    <a
                      href={m.pdf_url}
                      download={`lead-magnet-${m.id}.pdf`}
                      className="px-3 py-1 bg-downloadGreen rounded text-sm"
                    >
                      Download
                    </a>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

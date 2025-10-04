import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import axios from "axios";
import PromptModal from "../components/PromptModal.jsx";

export default function CustomerDashboard() {
  const { accessToken, user } = useAuth();
  const [magnets, setMagnets] = useState([]);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeMagnet, setActiveMagnet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMagnets, setLoadingMagnets] = useState(true);

  const location = useLocation();

  const ITEMS_PER_PAGE = 10;

  async function fetchMagnets() {
    try {
      setLoadingMagnets(true);
      const res = await axios.get(
        "https://cre8tlystudio.com/api/lead-magnets",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setMagnets(res.data);
    } catch (err) {
      console.error("Error fetching lead magnets:", err);
    } finally {
      setLoadingMagnets(false);
    }
  }

  useEffect(() => {
    if (accessToken) fetchMagnets();
  }, [accessToken]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("session_id")) {
      console.log("✅ Stripe checkout success:", params.get("session_id"));
      fetchMagnets();
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  function handlePromptSubmitted(magnetId, promptText, theme) {
    setMagnets((prev) =>
      prev.map((m) =>
        m.id === magnetId
          ? { ...m, prompt: promptText, status: "pending", theme }
          : m
      )
    );
  }

  async function handleCheckout() {
    try {
      const { data } = await axios.post(
        "https://cre8tlystudio.com/api/checkout",
        {
          userId: user?.id,
          priceId: "price_1SEC9lA3LinCYcoDTBYy0xY4",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Try again.");
    }
  }

  useEffect(() => {
    if (!accessToken) return;

    if (magnets.length === 0) return; // 👈 nothing to poll for
    const hasPending = magnets.some((m) => m.status === "pending");
    if (!hasPending) return;

    const interval = setInterval(() => {
      console.log("🔄 Polling for PDF updates...");
      fetchMagnets();
    }, 5000);

    return () => clearInterval(interval);
  }, [magnets, accessToken]);

  const sortedMagnets = [...magnets].sort(
  (a, b) => (a.slot_number || 0) - (b.slot_number || 0)
);
  const totalPages = Math.ceil(sortedMagnets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMagnets = sortedMagnets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 pt-28 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-2xl font-bold text-white mb-6">My Lead Magnets</h1>
      <p className="text-silver mb-6">
        You currently have {magnets.filter((m) => !m.prompt).length} of{" "}
        {magnets.length} slots available.
      </p>
      {magnets.filter((m) => !m.prompt).length === 0 && (
  <div className="mb-6">
    <button
      onClick={handleCheckout}
      className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
    >
      Purchase 5 More Slots
    </button>
  </div>
)}

      {loadingMagnets ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green mb-4"></div>
          <p className="text-silver">Loading your lead magnets...</p>
        </div>
      ) : magnets.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <p className="text-silver mb-6">
            You haven’t created any lead magnets yet.
          </p>
          <button
            onClick={handleCheckout}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
          >
            Generate My First Lead Magnet
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
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
                {paginatedMagnets.map((m, i) => (
                  <tr key={m.id} className="border-t border-gray-700">
                    {/* Slot number */}
                    <td className="px-4 py-2">
                      Slot #{m.slot_number}
                    </td>

                    {/* Created */}
                    <td className="px-4 py-2">
                      {new Date(m.created_at).toLocaleDateString()}{" "}
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Status */}
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
                        <span className="text-gray-400 italic">
                          Awaiting prompt…
                        </span>
                      )}
                    </td>

                    {/* Prompt */}
                    <td className="px-4 py-2">
                      {m.prompt ? "Submitted" : "Awaiting prompt…"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2 flex gap-2">
                      {!m.prompt && (
                        <button
                          onClick={() => {
                            setActiveMagnet(m.id);
                            setOpenPrompt(true);
                          }}
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {paginatedMagnets.map((m, i) => (
              <div
                key={m.id}
                className="bg-neo p-4 rounded-xl shadow border border-gray-700"
              >
                {/* Slot number at the top */}
                <p className="text-sm text-white font-semibold mb-2">
                  Slot #{m.slot_number || startIndex + i + 1}
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
                    <span className="text-gray-400 italic">
                      Awaiting prompt…
                    </span>
                  )}
                </p>

                <p className="text-sm text-silver mt-1">
                  <span className="font-semibold">Prompt:</span>{" "}
                  {m.prompt ? "Submitted" : "Awaiting prompt…"}
                </p>

                <div className="flex gap-2 mt-3">
                  {!m.prompt && (
                    <button
                      onClick={() => {
                        setActiveMagnet(m.id);
                        setOpenPrompt(true);
                      }}
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

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {activeMagnet && (
        <PromptModal
          isOpen={openPrompt}
          onClose={() => setOpenPrompt(false)}
          magnetId={activeMagnet}
          accessToken={accessToken}
          onSubmitted={handlePromptSubmitted}
        />
      )}
    </div>
  );
}

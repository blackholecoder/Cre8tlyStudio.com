import { useState, useEffect } from "react";
import { useAuth } from "../../admin/AuthContext.jsx";
import api from "../../api/axios.jsx";
import LoadingState from "../dashboard/LoadingState.jsx";
import PromptMemoryTable from "../dashboard/PromptMemoryTable.jsx";

export default function PromptMemoryDashboard() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tableReady, setTableReady] = useState(false);


  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    setTableReady(false);

    async function fetchPrompts() {
      try {
        const res = await api.get(
          `/lead-magnets/prompt-memory/${user.id}?page=${page}&limit=20`
        );

        setPrompts(res.data.prompts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Failed to load prompts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrompts();
  }, [user, page]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full">
      {/* Header */}
      <div className="flex flex-col mb-8 mt-2">
        <h1 className="text-3xl font-bold text-white mb-2 design-text">
          My Prompt Memory
        </h1>
        <p className="text-gray-400 text-sm">
          View all prompts you’ve generated with Cre8tly Studio.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-8"></div>

      {/* Content */}
      {loading ? (
  <div className="flex flex-col items-center justify-center py-24 text-white">
    <div className="relative">

      {/* Glowing pulse ring */}
      <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl animate-ping"></div>

      {/* Center spinner */}
      <div className="w-14 h-14 border-4 border-t-transparent border-green-400 rounded-full animate-spin"></div>
    </div>

    {/* Loading text */}
    <p className="mt-6 text-lg font-semibold tracking-wide text-gray-300 animate-pulse">
      Fetching your prompt memory...
    </p>

    <p className="text-sm text-gray-400 mt-2">
      Loading your saved prompts from Cre8tly Studio.
    </p>
  </div>
) : !loading && prompts.length > 0 ? (
  <PromptMemoryTable prompts={prompts} onReady={() => setTableReady(true)} />
) : null}
      {tableReady && !loading && prompts.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-white text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

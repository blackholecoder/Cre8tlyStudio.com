import { useState, useEffect } from "react";
import { useAuth } from "../../admin/AuthContext.jsx";
import api from "../../api/axios.jsx";
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
    <div
      className="
    flex flex-col min-h-screen
    p-6
    bg-dashboard-bg-light
    dark:bg-dashboard-bg-dark
  "
    >
      {/* Header */}
      <div className="flex flex-col mb-2 mt-2">
        <h1
          className="text-3xl font-bold mb-2 design-text normal-case
        text-dashboard-text-light
        dark:text-dashboard-text-dark"
        >
          My Prompt Memory
        </h1>
        <p
          className="text-sm
        text-dashboard-muted-light
        dark:text-dashboard-muted-dark"
        >
          View all prompts you’ve generated with Cre8tly Studio.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-8"></div>

      {/* Content */}
      <div className="flex-1">
        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-24
        text-dashboard-text-light
        dark:text-dashboard-text-dark"
          >
            <div className="relative">
              {/* Glowing pulse ring */}
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl animate-ping"></div>

              {/* Center spinner */}
              <div className="w-14 h-14 border-4 border-t-transparent border-green-400 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : !loading && prompts.length > 0 ? (
          <PromptMemoryTable
            prompts={prompts}
            onReady={() => setTableReady(true)}
          />
        ) : null}
      </div>

      {tableReady && !loading && prompts.length > 0 && (
        <div className="mt-auto pt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="
        px-4 py-2 rounded transition
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        disabled:opacity-40 disabled:cursor-not-allowed
      "
          >
            Previous
          </button>

          <span
            className="
        text-sm
        text-dashboard-text-light
        dark:text-dashboard-text-dark
      "
          >
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="
        px-4 py-2 rounded transition
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        disabled:opacity-40 disabled:cursor-not-allowed
      "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../admin/AuthContext.jsx";

import api from "../../api/axios.jsx";
import LoadingState from "../dashboard/LoadingState.jsx";
import EmptyState from "../dashboard/EmptyState.jsx";
import PromptMemoryTable from "../dashboard/PromptMemoryTable.jsx";

export default function PromptMemoryDashboard() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user?.id) return;
    async function fetchPrompts() {
      try {
        const res = await api.get(`/lead-magnets/prompt-memory/${user.id}`);
        setPrompts(res.data);
      } catch (err) {
        console.error("Failed to load prompts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrompts();
  }, [user]);

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
      <div className="flex gap-3 mb-8">
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : prompts.length === 0 ? (
        <EmptyState
          title="No Prompts Yet"
          message="Your generated prompts will appear here once you’ve created some lead magnets."
        />
      ) : (
        <PromptMemoryTable prompts={prompts} />
      )}
    </div>
  );
}

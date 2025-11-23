
import { useEffect, useState } from "react";
import { useAuth } from "../../admin/AuthContext";
import { Copy, Check, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

export default function PromptMemoryTable({ prompts = [], onReady }) {
  const [copiedId, setCopiedId] = useState(null);
  const [hasMemory, setHasMemory] = useState(false);
  const [memoryLoading, setMemoryLoading] = useState(true);
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  // ✅ Fetch latest has_memory from backend
  useEffect(() => {
  async function checkMemoryStatus() {
    try {
      if (!user?.id) return;
      const res = await axiosInstance.get("/auth/me");
      setHasMemory(!!res.data.has_memory);
    } catch (err) {
      console.error("❌ Failed to check memory access:", err);
    } finally {
      setMemoryLoading(false); // <-- IMPORTANT
    }
  }
  checkMemoryStatus();
}, [user, accessToken]);

useEffect(() => {
  if (!memoryLoading && hasMemory) {
    onReady?.();
  }
}, [memoryLoading, hasMemory]);


  const handleCopy = async (prompt, id) => {
    try {
      const cleanPrompt = prompt.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(cleanPrompt);
      setCopiedId(id);
      toast.success("Prompt copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy prompt");
    }
  };


  if (memoryLoading) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-white">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl animate-ping"></div>
        <div className="w-14 h-14 border-4 border-t-transparent border-green-400 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-semibold tracking-wide text-gray-300 animate-pulse">
        Checking your access...
      </p>
    </div>
  );
}

  // ✅ Locked view (no memory)
  if (!hasMemory) {
  return (
    <div className="flex justify-center mt-10 md:mt-20 px-4">
      <div className="relative bg-[#111] w-full max-w-6xl overflow-hidden rounded-xl border border-gray-700 shadow-lg">
        <div className="opacity-40 pointer-events-none">
          <div className="bg-[#111] px-4 sm:px-6 py-3 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-white font-semibold text-lg">
              Prompt Memory <span className="text-[#d2b6ff] text-sm ml-2">PRO Feature</span>
            </h2>
          </div>
          <div className="min-h-[400px] flex items-center justify-center text-gray-500 text-sm">
            <p>Prompt data will appear here once unlocked.</p>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md bg-black/40 rounded-xl text-center px-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={20} className="text-gray-300" />
            <h2 className="text-white font-semibold text-lg">Prompt Memory</h2>
          </div>
          <p className="text-gray-300 mb-4 max-w-md">
            Unlock this feature to access and reuse your previously generated prompts.
          </p>
          <button
            onClick={() => navigate("/plans")}
            className="border border-royalPurple bg-gradient-to-r from-[#a98aff] via-[#d2b6ff] to-[#8e66ff]
                       text-black font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition"
          >
            Unlock Feature
          </button>
        </div>
      </div>
    </div>
  );
}

// ⛔ WE ONLY CHECK FOR EMPTY PROMPTS AFTER MEMORY UNLOCKED
if (!Array.isArray(prompts) || prompts.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-400 px-4">
      <p>No prompts found yet.</p>
    </div>
  );
}

  // ✅ Unlocked view (responsive layout)
  return (
    <div className="flex justify-center mt-10 md:mt-20 px-2 sm:px-4">
      <div className="bg-[#111] w-full max-w-6xl rounded-xl border border-gray-700 shadow-lg">
        <div className="bg-[#111] px-4 sm:px-6 py-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg">Prompt Memory</h2>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-white">
            <thead className="bg-gray-800/90">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-300">Prompt</th>
                <th className="px-4 py-2 text-left font-medium text-gray-300">Created</th>
                <th className="px-4 py-2 text-left font-medium text-gray-300">Copy</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-700 hover:bg-gray-900/60 transition"
                >
                  <td className="px-4 py-3 max-w-lg">
                    <p className="truncate text-white/90">
                      {p.prompt.replace(/<[^>]*>/g, "")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
                    {p.created_at_prompt ? (
                      <>
                        {new Date(p.created_at_prompt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}{" "}
                        {new Date(p.created_at_prompt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      <span className="italic text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleCopy(p.prompt, p.id)}
                      className="text-gray-400 hover:text-green transition"
                    >
                      {copiedId === p.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col divide-y divide-gray-800">
          {prompts.map((p) => (
            <div key={p.id} className="p-4">
              <p className="text-white/90 text-sm mb-2">
                {p.prompt.replace(/<[^>]*>/g, "")}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>
                  {p.created_at_prompt
                    ? new Date(p.created_at_prompt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
                <button
                  onClick={() => handleCopy(p.prompt, p.id)}
                  className="text-gray-400 hover:text-green transition"
                >
                  {copiedId === p.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


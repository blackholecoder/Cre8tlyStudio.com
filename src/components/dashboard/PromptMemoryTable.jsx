import { useState } from "react";
import { Copy, Check, Lock } from "lucide-react";
import { toast } from "react-toastify";

export default function PromptMemoryTable({ prompts = [] }) {
  const [copiedId, setCopiedId] = useState(null);

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

  if (!Array.isArray(prompts) || prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-400">
        <p>No prompts found yet.</p>
      </div>
    );
  }

//   return (
//     <div className="flex justify-center mt-10 md:mt-20 px-4 relative">
//       {/* 🔒 Locked overlay (until subscription active) */}
//       <div className="absolute inset-0 z-10 flex flex-col items-center justify-center 
//                 backdrop-blur-md bg-black/40 rounded-xl text-center">
//   <div className="flex items-center gap-2 mb-2">
//     <Lock size={18} className="text-gray-300" />
//     <h2 className="text-white font-semibold text-lg">Prompt Memory</h2>
//   </div>
//   <p className="text-gray-300">Available with Subscription</p>
// </div>

//       {/* Main table container (blurred & disabled) */}
//       <div className="bg-[#111] w-full max-w-6xl overflow-x-auto rounded-xl border border-gray-700 shadow-lg opacity-40 pointer-events-none">
//         {/* Header */}
//         <div className="bg-[#111] px-6 py-3 border-b border-gray-700 flex justify-between items-center">
//           <h2 className="text-white font-semibold text-lg">
//             Prompt Memory{" "}
//             <span className="text-[#d2b6ff] text-sm ml-2">PRO Feature</span>
//           </h2>
//         </div>

//         {/* Table */}
//         <table className="min-w-full text-white">
//           <thead className="bg-gray-800/90">
//             <tr>
//               <th className="px-4 py-2 text-left font-medium text-gray-300">
//                 Prompt
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-300">
//                 Created
//               </th>
//               <th className="px-4 py-2 text-left font-medium text-gray-300">
//                 Copy
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {prompts.map((p) => (
//               <tr
//                 key={p.id}
//                 className="border-t border-gray-700 hover:bg-gray-900/60 transition"
//               >
//                 {/* Prompt text */}
//                 <td className="px-4 py-3 max-w-lg">
//                   <p className="truncate text-white/90">
//                     {p.prompt.replace(/<[^>]*>/g, "")}
//                   </p>
//                 </td>

//                 {/* Created date */}
//                 <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
//                   {new Date(p.created_at).toLocaleDateString()}{" "}
//                   {new Date(p.created_at).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </td>

//                 {/* Copy button */}
//                 <td className="px-4 py-3">
//                   <button
//                     onClick={() => handleCopy(p.prompt, p.id)}
//                     className="text-gray-400 hover:text-green transition"
//                   >
//                     {copiedId === p.id ? <Check size={18} /> : <Copy size={18} />}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
return (
  <div className="flex justify-center mt-10 md:mt-20 px-4 relative">
    {/* 🔒 Locked overlay */}
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center 
                    backdrop-blur-md bg-black/40 rounded-xl text-center">
      <div className="flex items-center gap-2 mb-2">
        <Lock size={18} className="text-gray-300" />
        <h2 className="text-white font-semibold text-lg">Prompt Memory</h2>
      </div>
      <p className="text-gray-300 mb-4">Available with Monthly Subscription</p>
      <button
        onClick={() => navigate("/plans")}
        className=" border-royalPurple bg-gradient-to-r from-[#a98aff] via-[#d2b6ff] to-[#8e66ff] text-black font-semibold 
                   px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        Unlock Feature
      </button>
    </div>

    {/* Main table container (blurred & disabled) */}
    <div className="bg-[#111] w-full max-w-6xl overflow-x-auto rounded-xl border border-gray-700 shadow-lg opacity-40 pointer-events-none">
      {/* Header */}
      <div className="bg-[#111] px-6 py-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg">
          Prompt Memory{" "}
          <span className="text-[#d2b6ff] text-sm ml-2">PRO Feature</span>
        </h2>
      </div>

      {/* Table */}
      <table className="min-w-full text-white">
        <thead className="bg-gray-800/90">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-300">
              Prompt
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-300">
              Created
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-300">
              Copy
            </th>
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
                {new Date(p.created_at).toLocaleDateString()}{" "}
                {new Date(p.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
  </div>
);



}

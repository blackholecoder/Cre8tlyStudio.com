import { useState } from "react";
import { cannedPrompts } from "../../constants/index";

export default function PromptSelect({ setText }) {
  const [open, setOpen] = useState(false);

  const renderSection = (title, prompts) => (
    <div>
      <div className="px-4 py-2 text-xs uppercase tracking-widest text-gray-300 bg-[#0a0a0a] sticky top-0 z-10 border-b border-gray-800">
        {title}
      </div>
      {prompts.map((p, idx) => (
        <li
          key={idx}
          onClick={() => {
            setText(p.text);
            setOpen(false);
          }}
          className="px-4 py-2 text-gray-200 bg-[#0a0a0a] hover:bg-gradient-to-r from-[#00e07a] to-[#670fe7] hover:text-white cursor-pointer transition"
        >
          {p.label}
        </li>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <label className="block text-silver mb-2 font-medium">Choose a Pre-Made Prompt</label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 text-left flex justify-between items-center hover:bg-gray-700 transition"
      >
        <span>Select a pre-made prompt...</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto 
                     rounded-lg border border-gray-700 shadow-lg
                     scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
          style={{
            backgroundColor: "#0a0a0a",
            boxShadow: "0 0 25px rgba(0,0,0,0.7)",
          }}
        >
          {renderSection("Beginner", cannedPrompts.beginner)}
          {renderSection("Professional", cannedPrompts.professional)}
          {renderSection("Advanced", cannedPrompts.expert)}
        </ul>
      )}
    </div>
  );
}

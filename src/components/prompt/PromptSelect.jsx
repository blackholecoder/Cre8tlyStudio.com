import { useState } from "react";
import { cannedPrompts } from "../../constants/index";

export default function PromptSelect({ setText }) {
  const [open, setOpen] = useState(false);

  const renderSection = (title, prompts) => (
    <div>
      <div
        className="
  px-4 py-2
  text-xs uppercase tracking-widest
  text-dashboard-muted-light
  dark:text-dashboard-muted-dark
  bg-dashboard-hover-light
  dark:bg-dashboard-hover-dark
  sticky top-0 z-10
  border-b border-dashboard-border-light
  dark:border-dashboard-border-dark
"
      >
        {title}
      </div>
      {prompts.map((p, idx) => (
        <li
          key={idx}
          onClick={() => {
            setText(p.text);
            setOpen(false);
          }}
          className="
          px-4 py-2
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          cursor-pointer
          transition
          hover:bg-dashboard-hover-light
          dark:hover:bg-dashboard-hover-dark
          hover:text-green
          "
        >
          {p.label}
        </li>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <label
        className="block mb-2 font-medium
      text-dashboard-text-light
      dark:text-dashboard-text-dark"
      >
        Choose a Pre-Made Prompt
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
        w-full px-4 py-2
        rounded-lg
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        text-left flex justify-between items-center
        hover:bg-dashboard-hover-light
        dark:hover:bg-dashboard-hover-dark
        transition
        "
      >
        <span>Select a pre-made prompt...</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul
          className="
          absolute z-50 mt-1 w-full max-h-60 overflow-y-auto
          rounded-lg
          bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          shadow-lg
          scrollbar-thin
          scrollbar-thumb-dashboard-border-light
          dark:scrollbar-thumb-dashboard-border-dark
          scrollbar-track-transparent
        "
        >
          {renderSection("Beginner", cannedPrompts.beginner)}
          {renderSection("Professional", cannedPrompts.professional)}
          {renderSection("Advanced", cannedPrompts.expert)}
        </ul>
      )}
    </div>
  );
}

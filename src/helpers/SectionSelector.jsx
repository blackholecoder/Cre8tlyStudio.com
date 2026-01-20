import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SectionSelector({
  sections,
  activeSectionId,
  setActiveSectionId,
  text,
  setText,
  setSections,
  autoSaveDraft,
}) {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  function handleSelect(section) {
    // save current section content
    setSections((prev) =>
      prev.map((s) => (s.id === activeSectionId ? { ...s, content: text } : s))
    );

    setActiveSectionId(section.id);
    setText(section.content || "");
    setIsOpen(false);

    autoSaveDraft?.();
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full sm:w-auto sm:min-w-[220px]"
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="
          w-full flex items-center justify-between
          rounded-lg px-4 py-2 text-sm transition
          bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          hover:bg-dashboard-hover-light
          dark:hover:bg-dashboard-hover-dark
        "
      >
        <span className="truncate">
          {activeSection?.title || "Untitled Section"}
        </span>

        {isOpen ? (
          <ChevronUp size={16} className="opacity-80" />
        ) : (
          <ChevronDown size={16} className="opacity-80" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute z-30 mt-2 w-full
            rounded-lg shadow-lg
            max-h-[260px] overflow-y-auto
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
          "
        >
          {sections.map((section) => {
            const isActive = section.id === activeSectionId;

            return (
              <div
                key={section.id}
                onClick={() => handleSelect(section)}
                className={`
                  px-4 py-2 cursor-pointer text-sm transition
                  ${
                    isActive
                      ? `
                        bg-dashboard-hover-light
                        dark:bg-dashboard-hover-dark
                        text-dashboard-text-light
                        dark:text-dashboard-text-dark
                      `
                      : `
                        text-dashboard-text-light/70
                        dark:text-dashboard-text-dark/70
                        hover:bg-dashboard-hover-light
                        dark:hover:bg-dashboard-hover-dark
                      `
                  }
                `}
              >
                {section.title || "Untitled Section"}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

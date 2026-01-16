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
          bg-gray-900 border border-gray-700
          rounded-lg px-4 py-2
          text-white text-sm
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
            bg-[#111] border border-gray-700
            rounded-lg shadow-lg
            max-h-[260px] overflow-y-auto
          "
        >
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => handleSelect(section)}
              className={`
                px-4 py-2 cursor-pointer text-sm
                transition
                ${
                  section.id === activeSectionId
                    ? "bg-[#1f1f1f] text-white"
                    : "text-gray-300 hover:bg-[#1f1f1f]"
                }
              `}
            >
              {section.title || "Untitled Section"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

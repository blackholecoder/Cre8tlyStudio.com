import { useMemo, useState, useEffect, useRef } from "react";

export default function TopicSelectDropdown({
  open,
  topics = [],
  selectedTopicId,
  onSelect,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const filteredTopics = useMemo(() => {
    return topics
      .filter((t) => !t.is_locked)
      .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [topics, search]);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={wrapperRef}
      className="
        mt-2
        w-full
        rounded-xl
        border
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border-dashboard-border-light
        dark:border-dashboard-border-dark
        shadow-lg
        p-3
      "
    >
      {/* Search */}
      <input
        type="text"
        placeholder="Search topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full mb-3 px-3 py-2 rounded-lg text-sm
          bg-dashboard-bg-light dark:bg-dashboard-bg-dark
          border border-dashboard-border-light dark:border-dashboard-border-dark
          text-dashboard-text-light dark:text-dashboard-text-dark
          placeholder:text-dashboard-muted-light
          dark:placeholder:text-dashboard-muted-dark
          focus:outline-none focus:ring-2 focus:ring-green
        "
      />

      {/* Scrollable list */}
      <div className="max-h-[280px] overflow-y-auto pr-1">
        {filteredTopics.map((t) => {
          const active = selectedTopicId === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg mb-1 transition
                ${
                  active
                    ? "bg-green text-black"
                    : "hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                }
              `}
            >
              {t.name}
            </button>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark py-4 text-center">
            No topics found
          </div>
        )}
      </div>
    </div>
  );
}

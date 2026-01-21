import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function VersionControls({
  versions,
  selectedVersion,
  setSelectedVersion,
  appliedVersion,
  handleLoadVersion,
  handleApplyVersion,
  handleDeleteVersion,
}) {
  const applyDisabled = !selectedVersion || selectedVersion === appliedVersion;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

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

  const selectedVersionObj = versions.find((v) => v.id === selectedVersion);

  function handleSelect(versionId) {
    setSelectedVersion(versionId);
    handleLoadVersion({ target: { value: versionId } });
    setIsOpen(false);
  }

  return (
    <div
      className="
        w-full
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        rounded-lg sm:rounded-xl
        p-3 sm:p-5
        mb-10
        shadow-inner
        pb-6 sm:pb-12
      "
    >
      {/* Custom Dropdown */}
      <div ref={wrapperRef} className="relative w-full mb-4 sm:mb-6">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="
            w-full flex items-center justify-between
            rounded-lg px-4 py-2 text-sm transition
            bg-dashboard-bg-light dark:bg-dashboard-bg-dark
            text-dashboard-text-light dark:text-dashboard-text-dark
            border border-dashboard-border-light dark:border-dashboard-border-dark
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
            focus:outline-none focus:ring-2 focus:ring-green/60
          "
        >
          <span className="truncate">
            {selectedVersionObj
              ? `${selectedVersionObj.name} (${new Date(
                  selectedVersionObj.updated_at || selectedVersionObj.created_at
                ).toLocaleString()})`
              : "Load saved version…"}
          </span>

          {isOpen ? (
            <ChevronUp
              size={16}
              className="text-dashboard-muted-light dark:text-dashboard-muted-dark"
            />
          ) : (
            <ChevronDown
              size={16}
              className="text-dashboard-muted-light dark:text-dashboard-muted-dark"
            />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="
              absolute z-30 mt-2 w-full
              rounded-lg shadow-lg
              max-h-[260px] overflow-y-auto overscroll-contain
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
            "
          >
            {versions.length === 0 && (
              <div
                className="
                  px-4 py-2 text-sm
                  text-dashboard-muted-light dark:text-dashboard-muted-dark
                "
              >
                No saved versions
              </div>
            )}

            {versions.map((v) => {
              const isActive = v.id === selectedVersion;
              const timestamp = v.updated_at || v.created_at;

              return (
                <div
                  key={v.id}
                  onClick={() => handleSelect(v.id)}
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
                  <div className="truncate">{v.name}</div>
                  <div className="text-xs opacity-60">
                    {new Date(timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-4">
        <button
          disabled={applyDisabled}
          onClick={!applyDisabled ? handleApplyVersion : undefined}
          className={`
            font-semibold px-6 py-2 rounded-lg shadow text-sm transition
            ${
              applyDisabled
                ? `
                  bg-dashboard-bg-light
                  dark:bg-dashboard-bg-dark
                  text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
                  cursor-not-allowed
                `
                : "bg-green text-black hover:bg-green/90"
            }
          `}
        >
          Apply
        </button>

        {selectedVersion && (
          <button
            type="button"
            onClick={handleDeleteVersion}
            className="
              px-6 py-2 rounded-lg
              bg-red-500/10
              border border-red-500/30
              text-red-500
              hover:bg-red-500/20
              transition text-sm font-semibold
            "
          >
            Delete
          </button>
        )}

        {selectedVersion && (
          <button
            type="button"
            onClick={() => setSelectedVersion("")}
            className="
              px-6 py-2 rounded-lg
              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              text-dashboard-muted-light dark:text-dashboard-muted-dark
              hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
              transition text-sm font-semibold
            "
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

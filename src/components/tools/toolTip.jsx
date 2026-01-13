import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

export function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    function close(e) {
      if (!e.target.closest(".tooltip-root")) {
        setOpen(false);
      }
    }

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  function toggle(e) {
    e.stopPropagation();

    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });

    setOpen((v) => !v);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="tooltip-root ml-1 text-gray-400 hover:text-green focus:outline-none"
      >
        <Info size={14} className="text-current" />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translateX(-50%)",
            }}
            className="
              fixed z-[9999]
              w-64
              bg-gray-900
              border border-gray-700
              text-xs text-gray-200
              rounded-lg
              p-3
              shadow-2xl
              normal-case
            "
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}

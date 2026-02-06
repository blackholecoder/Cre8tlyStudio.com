import { useEffect, useRef, useState } from "react";
import { Lock, Users, Eye } from "lucide-react";

const OPTIONS = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can comment",
    icon: Eye,
  },
  {
    value: "private",
    label: "Subscribers",
    description: "Any subscriber (Free or Paid) can comment",
    icon: Users,
  },
  {
    value: "paid",
    label: "Paid subscribers",
    description: "Paying subscribers only",
    icon: Lock,
  },
];

export default function CommentVisibilityDropdown({
  value = "public",
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative mt-6">
      <label
        className="
          block mb-1
          text-sm font-medium
          text-dashboard-text-light
          dark:text-dashboard-text-dark
        "
      >
        Comment access
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          w-full
          p-3
          rounded-lg
          flex items-center justify-between
          border
          bg-dashboard-bg-light dark:bg-dashboard-bg-dark
          border-dashboard-border-light dark:border-dashboard-border-dark
          text-dashboard-text-light dark:text-dashboard-text-dark
          hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
          focus:outline-none focus:ring-2 focus:ring-green
        "
      >
        <div className="flex items-center gap-3">
          <selected.icon size={16} className="opacity-70" />
          <div className="text-left">
            <div className="text-sm font-medium">{selected.label}</div>
            <div className="text-xs opacity-70">{selected.description}</div>
          </div>
        </div>

        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
            mt-2 w-full
            rounded-lg
            border
            bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
            border-dashboard-border-light dark:border-dashboard-border-dark
            shadow-xl
            overflow-hidden
          "
        >
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = opt.value === value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left
                  flex items-start gap-3
                  transition
                  ${
                    active
                      ? "bg-green/10 text-green"
                      : "hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                  }
                `}
              >
                <Icon size={16} className="mt-0.5 opacity-80" />

                <div>
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs opacity-70">{opt.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-1 text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
        Subscribers can comment on subscriber-only posts. Paid posts require an
        active paid subscription.
      </p>
    </div>
  );
}

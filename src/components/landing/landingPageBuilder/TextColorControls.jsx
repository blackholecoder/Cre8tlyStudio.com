import React from "react";

export default function TextColorControls({ landing, setLanding }) {
  const fields = [
    { key: "font_color_h1", label: "Heading 1" },
    { key: "font_color_h2", label: "Heading 2" },
    { key: "font_color_h3", label: "Heading 3" },
    { key: "font_color_p", label: "Paragraph" },
  ];

  const updateColor = (key, value) => {
    setLanding({
      ...landing,
      [key]: value.toUpperCase(),
    });
  };

  return (
    <div
      className="
      relative z-[10]
      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
      rounded-xl
      p-6
      shadow-inner
      border border-dashboard-border-light dark:border-dashboard-border-dark
    "
    >
      <h3
        className="
        text-lg font-semibold mb-4
        text-dashboard-text-light dark:text-dashboard-text-dark
      "
      >
        Text Colors
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {fields.map(({ key, label }) => (
          <div
            key={key}
            className="
            flex flex-col items-center justify-center
            bg-dashboard-bg-light dark:bg-dashboard-bg-dark
            rounded-lg
            p-4
            border border-dashboard-border-light dark:border-dashboard-border-dark
            hover:border-dashboard-muted-light dark:hover:border-dashboard-muted-dark
            transition-all duration-200
          "
          >
            <label
              className="
              text-sm font-semibold mb-2
              text-dashboard-text-light dark:text-dashboard-text-dark
            "
            >
              {label}
            </label>

            {/* Color picker */}
            <input
              type="color"
              value={landing[key] || "#FFFFFF"}
              onChange={(e) => updateColor(key, e.target.value)}
              className="
              w-14 h-14 p-0
              rounded-lg
              cursor-pointer
              border border-dashboard-border-light dark:border-dashboard-border-dark
              hover:scale-105 transition-transform
            "
            />

            {/* Hex input */}
            <input
              type="text"
              value={landing[key] || "#FFFFFF"}
              onChange={(e) => updateColor(key, e.target.value)}
              className="
              mt-3 w-full px-2 py-1 text-xs text-center uppercase
              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              rounded
              text-dashboard-text-light dark:text-dashboard-text-dark
              focus:outline-none focus:ring-1 focus:ring-green
            "
              placeholder="#FFFFFF"
            />

            <span
              className="
              text-xs mt-2 tracking-wider
              text-dashboard-muted-light dark:text-dashboard-muted-dark
            "
            >
              {landing[key] || "#FFFFFF"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

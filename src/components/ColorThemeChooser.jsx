import React from "react";

// Define available themes (20 color options — mix of solid & gradient)
const colorThemes = [
  { name: "modern", label: "Modern", preview: "#e2e8f0" },
  { name: "classic", label: "Classic", preview: "#fffaf5" },
  { name: "bold", label: "Bold", preview: "#f9e8ff" },
  { name: "dark", label: "Dark", preview: "#030712" },
  { name: "royal", label: "Royal", preview: "#2E026D" },
  { name: "mint", label: "Mint", preview: "#d1fae5" },
  { name: "sunrise", label: "Sunrise", preview: "#fed7aa" },
  { name: "ocean", label: "Ocean", preview: "#bae6fd" },
  { name: "rose", label: "Rose", preview: "#fce7f3" },
  { name: "graphite", label: "Graphite", preview: "#1f2937" },

  // Extra palettes (solid equivalents if you plan to support them)
  { name: "forest", label: "Forest", preview: "#065f46" },
  { name: "gold", label: "Gold", preview: "#f59e0b" },
  { name: "lavender", label: "Lavender", preview: "#c084fc" },
  { name: "peach", label: "Peach", preview: "#f97316" },
  { name: "midnight", label: "Midnight", preview: "#1e293b" },
  { name: "aqua", label: "Aqua", preview: "#0ea5e9" },
  { name: "berry", label: "Berry", preview: "#7e22ce" },
  { name: "lime", label: "Lime", preview: "#65a30d" },
  { name: "sand", label: "Sand", preview: "#fcd34d" },
  { name: "sky", label: "Sky", preview: "#60a5fa" },
];

export default function ColorThemeChooser({ bgTheme, setBgTheme }) {
  console.log("bgTheme from parent:", bgTheme);
  return (
    <div className="mt-6">
      <label className="block text-silver mb-3 font-medium">
        Choose Your Theme
      </label>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
        {colorThemes.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setBgTheme(item.name)}
            className={`relative w-10 h-10 rounded-full border-2 transition-all 
              ${bgTheme === item.name
                ? "border-green shadow-[0_0_10px_rgba(34,197,94,0.8)] scale-110"
                : "border-gray-700 hover:scale-105"
              }`}
            style={{
              background: item.preview,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            title={item.label}
          >
            {bgTheme === item.name && (
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

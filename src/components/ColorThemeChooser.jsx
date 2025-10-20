import React, {useState} from "react";
import { ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  const selected = colorThemes.find((c) => c.name === bgTheme) || colorThemes[0];

  return (
    <div className="relative mt-6 w-full max-w-sm">
      <label className="block text-silver mb-2 font-medium">Theme Color</label>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-6 h-6 rounded-full border border-gray-600"
            style={{ background: selected.preview }}
          />
          <span>{selected.label}</span>
        </div>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown List */}
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {colorThemes.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setBgTheme(item.name);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                bgTheme === item.name
                  ? "bg-green-600/20 text-green-400"
                  : "hover:bg-gray-800 text-gray-200"
              }`}
            >
              <span
                className="w-5 h-5 rounded-full border border-gray-600"
                style={{ background: item.preview }}
              />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

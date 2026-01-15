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
    <div className="relative z-[10] bg-[#0b0b0b] rounded-xl p-6 shadow-inner border border-gray-700">
      <h3 className="text-silver text-lg font-semibold mb-4">Text Colors</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {fields.map(({ key, label }) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center bg-[#141414] rounded-lg p-4 border border-gray-600 hover:border-[#F285C3] transition-all duration-200"
          >
            <label className="text-sm font-semibold text-white mb-2">
              {label}
            </label>

            {/* Color picker */}
            <input
              type="color"
              value={landing[key] || "#FFFFFF"}
              onChange={(e) => updateColor(key, e.target.value)}
              className="w-14 h-14 p-0 rounded-lg cursor-pointer border border-gray-400 hover:scale-105 transition-transform"
            />

            {/* Hex input */}
            <input
              type="text"
              value={landing[key] || "#FFFFFF"}
              onChange={(e) => updateColor(key, e.target.value)}
              className="mt-3 w-full px-2 py-1 text-xs text-center uppercase
                bg-black border border-gray-600 rounded text-white
                focus:outline-none focus:ring-1 focus:ring-[#F285C3]"
              placeholder="#FFFFFF"
            />

            <span className="text-xs text-gray-400 mt-2 tracking-wider">
              {landing[key] || "#FFFFFF"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

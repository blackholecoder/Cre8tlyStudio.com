import React from "react";

export default function TextColorControls({ landing, setLanding }) {
  const fields = [
    { key: "font_color_h1", label: "Heading 1" },
    { key: "font_color_h2", label: "Heading 2" },
    { key: "font_color_h3", label: "Heading 3" },
    { key: "font_color_p", label: "Paragraph" },
  ];

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

            <input
              type="color"
              value={landing[key] || "#FFFFFF"}
              onChange={(e) =>
                setLanding({ ...landing, [key]: e.target.value })
              }
              className="w-14 h-14 p-0 rounded-lg cursor-pointer border border-gray-400 hover:scale-105 transition-transform"
            />

            <span className="text-xs text-gray-300 mt-2 tracking-wider">
              {landing[key] || "#FFFFFF"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

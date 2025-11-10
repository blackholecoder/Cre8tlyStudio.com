import React, { useState, useMemo, useEffect } from "react";
import { colorThemes, gradientThemes } from "../constants";

export default function ColorThemeChooser({
  bgTheme,
  setBgTheme,
  includeGradients = true,
}) {
  // 🔹 Load collapse state from localStorage (collapsed by default)
  const [showThemes, setShowThemes] = useState(() => {
    const saved = localStorage.getItem("showThemes");
    return saved === "true" ? true : false;
  });

  // ✅ Persist state so it remembers between reloads
  useEffect(() => {
    localStorage.setItem("showThemes", showThemes);
  }, [showThemes]);

  // Combine solids and gradients safely
  const allThemes = useMemo(() => {
    return includeGradients
      ? [...(colorThemes || []), ...(gradientThemes || [])]
      : colorThemes || [];
  }, [includeGradients]);

  // Find currently selected theme by either name or preview match
  const selected =
    allThemes.find(
      (t) => t.name === bgTheme || t.preview === bgTheme
    ) || allThemes[0] || {};

  const handleThemeSelect = (theme) => {
    // Save the actual background value (gradient or solid)
    setBgTheme(theme.preview);
  };

  return (
    <div className="mt-12 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner hover:border-silver/60 transition-all">
      {/* Header toggle */}
      <div
        onClick={() => setShowThemes((prev) => !prev)}
        className="flex items-center justify-between px-6 py-5 cursor-pointer select-none"
      >
        <h3 className="text-lg font-semibold text-silver tracking-wide">
          Theme Color
        </h3>
        <span
          className={`text-gray-400 text-sm transform transition-transform duration-300 ${
            showThemes ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </div>

      {/* Collapsible content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showThemes ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          {/* 🟩 Live Preview Box */}
          <div
            className="h-14 w-full rounded-lg border border-gray-700 mb-4 shadow-inner transition-all duration-500 ease-in-out"
            style={{
              background:
                selected.preview ||
                selected.color ||
                "linear-gradient(to right, #000, #333)",
            }}
          ></div>

          {/* 🎨 Grid of Swatches */}
          <div
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 overflow-y-auto rounded-lg border border-gray-800 p-2"
            style={{ maxHeight: "300px" }}
          >
            {allThemes.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleThemeSelect(item)}
                className={`relative w-full h-12 rounded-lg transition-all duration-200 focus:outline-none border shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]
                ${
                  bgTheme === item.preview
                    ? "border-green-400 ring-2 ring-green-500/60 scale-[1.05]"
                    : "border-gray-700 hover:border-green-300 hover:scale-[1.02]"
                }`}
                style={{
                  background: item.preview,
                }}
              >
                <span
                  className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide ${
                    ["dark", "graphite", "royal"].includes(item.name)
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Click a color or gradient to set your background theme.
          </p>
        </div>
      </div>
    </div>
  );
}

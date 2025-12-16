import React, { useState, useMemo, useEffect } from "react";
import { colorThemes, gradientThemes } from "../constants";

export default function ColorThemeChooser({
  bgTheme,
  setBgTheme,
  includeGradients = true,
  isPro = false,
}) {
  const [showThemes, setShowThemes] = useState(() => {
    const saved = localStorage.getItem("showThemes");
    return saved === "true";
  });

  const [customSolid, setCustomSolid] = useState("#111827");
  const [useCustomGradient, setUseCustomGradient] = useState(false);
  const [gradStart, setGradStart] = useState("#0ea5e9");
  const [gradEnd, setGradEnd] = useState("#22c55e");
  const [gradDir, setGradDir] = useState("90deg");

  useEffect(() => {
    localStorage.setItem("showThemes", showThemes);
  }, [showThemes]);

  const solidThemes = colorThemes;
  const gradientOnlyThemes = gradientThemes;

  const allThemes = useMemo(() => {
    return includeGradients
      ? [...solidThemes, ...gradientOnlyThemes]
      : solidThemes;
  }, [includeGradients]);

  const handleThemeSelect = (theme) => {
    const isGradient = theme.preview?.includes("gradient");

    if (isGradient && !isPro) {
      return;
    }

    setBgTheme(theme.preview);
  };

  const applyCustomSolid = () => {
    setUseCustomGradient(false);
    setBgTheme(customSolid);
  };

  const applyCustomGradient = () => {
    if (!isPro) return;

    const gradient = `linear-gradient(${gradDir}, ${gradStart}, ${gradEnd})`;
    setBgTheme(gradient);
  };

  return (
    <div className="mt-12 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner">
      {/* Header */}
      <div
        onClick={() => setShowThemes((p) => !p)}
        className="flex items-center justify-between px-6 py-5 cursor-pointer select-none"
      >
        <h3 className="text-lg font-semibold text-silver">Background Theme</h3>
        <span
          className={`text-gray-400 transition-transform ${
            showThemes ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showThemes ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 space-y-6">
          {/* Live Preview */}
          <div
            className="h-14 rounded-lg border border-gray-700"
            style={{
              background: bgTheme || "linear-gradient(to right, #000, #333)",
            }}
          />

          {/* Presets */}
          <div
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 overflow-y-auto border border-gray-800 rounded-lg p-2"
            style={{ maxHeight: "240px" }}
          >
            {allThemes.map((item) => {
              const isGradient = item.preview?.includes("gradient");
              const locked = isGradient && !isPro;

              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => handleThemeSelect(item)}
                  disabled={locked}
                  className={`relative h-12 rounded-lg border transition-all
        ${
          bgTheme === item.preview
            ? "border-green-400 ring-2 ring-green-500/60"
            : "border-gray-700 hover:border-green-300"
        }
        ${locked ? "opacity-50 cursor-not-allowed" : ""}
      `}
                  style={{ background: item.preview }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase text-black/80">
                    {item.label}
                  </span>

                  {locked && (
                    <span className="absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded bg-purple-600 text-white font-semibold">
                      PRO
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {!isPro && (
            <p className="text-xs text-purple-400 mt-2 text-center">
              Unlock custom colors and gradients with Pro for complete brand
              control.
            </p>
          )}

          {/* Solid Color Picker */}
          {isPro && (
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Custom Solid Color
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customSolid}
                  onChange={(e) => setCustomSolid(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <button
                  type="button"
                  onClick={applyCustomSolid}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-green text-sm hover:border-green"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Gradient Picker */}
          {includeGradients && isPro && (
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Custom Gradient
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="color"
                  value={gradStart}
                  onChange={(e) => setGradStart(e.target.value)}
                />
                <input
                  type="color"
                  value={gradEnd}
                  onChange={(e) => setGradEnd(e.target.value)}
                />
              </div>

              <select
                value={gradDir}
                onChange={(e) => setGradDir(e.target.value)}
                className="w-full mt-2 p-2 bg-black border border-gray-700 rounded text-white"
              >
                <option value="90deg">Left → Right</option>
                <option value="180deg">Top → Bottom</option>
                <option value="45deg">Diagonal ↘</option>
                <option value="135deg">Diagonal ↙</option>
              </select>

              <button
                type="button"
                onClick={applyCustomGradient}
                className="mt-3 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded hover:border-green-400"
              >
                Apply Gradient
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            Presets or custom colors all save the same way.
          </p>
        </div>
      </div>
    </div>
  );
}

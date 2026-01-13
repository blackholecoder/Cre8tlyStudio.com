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

  const isValidHex = (value) =>
    /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value);

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

  useEffect(() => {
    if (!bgTheme) return;

    // SOLID COLOR
    if (bgTheme.startsWith("#")) {
      setCustomSolid(bgTheme);
      setUseCustomGradient(false);
      return;
    }

    // GRADIENT
    if (bgTheme.startsWith("linear-gradient")) {
      setUseCustomGradient(true);

      const match = bgTheme.match(
        /linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/
      );

      if (match) {
        const [, dir, start, end] = match;
        setGradDir(dir.trim());
        setGradStart(start.trim());
        setGradEnd(end.trim());
      }
    }
  }, [bgTheme]);

  const isCustomSolidActive =
    bgTheme?.toLowerCase() === customSolid.toLowerCase() &&
    isValidHex(customSolid);

  return (
    <div className="bg-[#0b0b0b] border border-gray-700 rounded-2xl shadow-inner">
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

              <div
                className={`flex items-center gap-3 max-w-[520px] rounded-lg p-2 transition-all
                ${
                  isCustomSolidActive
                    ? "ring-2 ring-green-500/70 border border-green-400"
                    : ""
                }
  `}
              >
                {/* Color picker */}
                <input
                  type="color"
                  value={customSolid}
                  onChange={(e) => setCustomSolid(e.target.value)}
                  className="
                  w-10
                  h-10
                  aspect-square
                  rounded-full
                  border
                  border-gray-600
                  cursor-pointer
                  appearance-none
                  p-0
                "
                />

                {/* Hex input */}
                <input
                  type="text"
                  value={customSolid}
                  onChange={(e) => setCustomSolid(e.target.value)}
                  placeholder="#111827"
                  className="
                  w-full
                  max-w-[420px]
                  px-4
                  py-2.5
                  bg-black
                  border
                  border-gray-700
                  rounded-lg
                  text-white
                  text-sm
                  uppercase
                "
                />

                <button
                  type="button"
                  onClick={applyCustomSolid}
                  disabled={!isValidHex(customSolid) || isCustomSolidActive}
                  className={`px-4 py-2 border rounded text-sm
          ${
            isValidHex(customSolid)
              ? "bg-gray-800 border-gray-700 text-green hover:border-green"
              : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed"
          }
        `}
                >
                  {isCustomSolidActive ? "Active" : "Apply"}
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
                {/* Gradient start */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={gradStart}
                    onChange={(e) => setGradStart(e.target.value)}
                    className="
                    w-10
                    h-10
                    aspect-square
                    rounded-full
                    border
                    border-gray-600
                    cursor-pointer
                    appearance-none
                    p-0
                  "
                  />
                  <input
                    type="text"
                    value={gradStart}
                    onChange={(e) => setGradStart(e.target.value)}
                    placeholder="#0ea5e9"
                    className="
                    w-full
                    max-w-[240px]
                    px-4
                    py-2.5
                    bg-black
                    border
                    border-gray-700
                    rounded-lg
                    text-white
                    text-sm
                    uppercase
                  "
                  />
                </div>

                {/* Gradient end */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={gradEnd}
                    onChange={(e) => setGradEnd(e.target.value)}
                    className="
                    w-10
                    h-10
                    aspect-square
                    rounded-full
                    border
                    border-gray-600
                    cursor-pointer
                    appearance-none
                    p-0
                  "
                  />
                  <input
                    type="text"
                    value={gradEnd}
                    onChange={(e) => setGradEnd(e.target.value)}
                    placeholder="#22c55e"
                    className="
                    w-full
                    max-w-[240px]
                    px-4
                    py-2.5
                    bg-black
                    border
                    border-gray-700
                    rounded-lg
                    text-white
                    text-sm
                    uppercase
                  "
                  />
                </div>
              </div>

              <select
                value={gradDir}
                onChange={(e) => setGradDir(e.target.value)}
                className="
                mt-3
                w-full
                max-w-[520px]
                p-2.5
                bg-black
                border
                border-gray-700
                rounded-lg
                text-white
              "
              >
                <option value="90deg">Left → Right</option>
                <option value="180deg">Top → Bottom</option>
                <option value="45deg">Diagonal ↘</option>
                <option value="135deg">Diagonal ↙</option>
              </select>

              <button
                type="button"
                onClick={applyCustomGradient}
                disabled={!isValidHex(gradStart) || !isValidHex(gradEnd)}
                className={`mt-3 w-full px-4 py-2 border rounded
        ${
          isValidHex(gradStart) && isValidHex(gradEnd)
            ? "bg-gray-800 border-gray-700 hover:border-green text-green"
            : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed"
        }
      `}
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

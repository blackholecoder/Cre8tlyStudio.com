import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fontThemes as availableFonts } from "../../constants/index";

export default function FontSelector({
  fontName,
  setFontName,
  fontFile,
  setFontFile,
  isFreePlan = false,
}) {
  const visibleFonts = availableFonts.map((f) => ({
    ...f,
    locked:
      isFreePlan &&
      !["Montserrat", "AdobeArabic", "Bebas Neue"].includes(f.name),
  }));

  const [selectedFont, setSelectedFont] = useState(
    fontName || visibleFonts?.[0]?.name || ""
  );
  const [previewFont, setPreviewFont] = useState(selectedFont);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ✅ Load font dynamically when preview changes
  useEffect(() => {
    const font = visibleFonts.find((f) => f.name === previewFont);
    if (!font?.file) return;

    const fontUrl = font.file.startsWith("http")
      ? font.file
      : `${window.location.origin}${font.file}`;

    const fontFace = new FontFace(font.name, `url(${fontUrl})`);
    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setLoaded(true);
      })
      .catch(() => setLoaded(false));
  }, [previewFont]);

  const handleFontSelect = (font) => {
    setSelectedFont(font.name);
    setFontName(font.name);
    setFontFile(font.file);
    setPreviewFont(font.name);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative mt-4 bg-[#0f1624]/80 border border-gray-700 rounded-xl p-5 shadow-inner">
      <h3 className="text-lg font-semibold text-silver pb-6">Font Style</h3>

      {/* 🔹 Live Preview (always visible on top) */}
      <div
        className="mb-4 p-4 rounded-xl border border-gray-700 bg-[#111827]/80 text-center"
        style={{
          fontFamily: loaded ? previewFont : "sans-serif",
          transition: "all 0.3s ease",
        }}
      >
        <p
          className="text-gray-200 font-medium"
          style={{
            fontSize: previewFont === "AdobeArabic" ? "24px" : "20px",
            lineHeight: previewFont === "AdobeArabic" ? "1.2" : "1.5",
          }}
        >
          AaBbCc — The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      {/* 🔹 Font Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#111827]/80 border border-gray-700 text-gray-300 text-base rounded-lg p-2.5 focus:ring-green focus:border-green"
        style={{ fontFamily: loaded ? selectedFont : "sans-serif" }}
      >
        <span>
          {visibleFonts.find((f) => f.name === selectedFont)?.label ||
            selectedFont}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* 🔹 Dropdown List */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full max-h-[260px] overflow-y-auto bg-[#111] border border-gray-700 rounded-lg shadow-lg scroll-smooth scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {visibleFonts.map((f) => (
            <div
              key={f.name}
              onMouseEnter={() => !f.locked && setPreviewFont(f.name)}
              onClick={() => !f.locked && handleFontSelect(f)}
              className={`px-4 py-2 transition-all duration-150 cursor-pointer ${
                f.locked
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-gray-300 hover:bg-[#1f1f1f]"
              } ${selectedFont === f.name ? "bg-[#1f1f1f]" : ""}`}
              style={{ fontFamily: f.name }}
            >
              {f.label}
              {f.locked && <span className="ml-2 text-yellow-500">🔒</span>}
            </div>
          ))}
        </div>
      )}
      {isFreePlan && (
        <p className="text-xs text-yellow-400 mt-2 text-center">
          Upgrade to unlock all fonts.
        </p>
      )}

      <p className="text-xs text-gray-400 mt-3 text-center">
        Hover to preview, click to select.
      </p>
    </div>
  );
}

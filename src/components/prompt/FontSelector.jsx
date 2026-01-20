import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Type } from "lucide-react";
import { fontThemes as availableFonts } from "../../constants/index";
import { Tooltip } from "../tools/toolTip";

export default function FontSelector({
  fontName,
  setFontName,
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
    <div
      className="
      w-full relative mt-4
      bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light
      dark:border-dashboard-border-dark
      rounded-xl
      p-5
      shadow-inner
    "
    >
      <h3
        className="
        flex items-center gap-2 text-lg font-semibold pb-6
        text-dashboard-text-light
        dark:text-dashboard-text-dark
"
      >
        <Type
          size={18}
          className="text-dashboard-muted-light dark:text-dashboard-muted-dark"
        />
        Font Style
        <Tooltip text="Choose how your book text appears. You can change fonts anytime before exporting or publishing." />
      </h3>

      {/* 🔹 Live Preview (always visible on top) */}
      <div
        className="
  mb-4 p-4 rounded-xl text-center
  bg-dashboard-hover-light
  dark:bg-dashboard-hover-dark
  border border-dashboard-border-light
  dark:border-dashboard-border-dark
"
        style={{
          fontFamily: loaded ? previewFont : "sans-serif",
          transition: "all 0.3s ease",
        }}
      >
        <p
          className="
          font-medium
          text-dashboard-text-light
          dark:text-dashboard-text-dark"
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
        className="
        w-full flex items-center justify-between
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        text-base rounded-lg p-2.5
        hover:bg-dashboard-hover-light
        dark:hover:bg-dashboard-hover-dark
        transition
        "
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
        <div
          className="
          absolute z-20 mt-2 w-full max-h-[260px] overflow-y-auto
          bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          rounded-lg shadow-lg
          scrollbar-thin
          scrollbar-thumb-dashboard-border-light
          dark:scrollbar-thumb-dashboard-border-dark
          scrollbar-track-transparent
        "
        >
          {visibleFonts.map((f) => (
            <div
              key={f.name}
              onMouseEnter={() => !f.locked && setPreviewFont(f.name)}
              onClick={() => !f.locked && handleFontSelect(f)}
              className={`px-4 py-2 transition-all duration-150 cursor-pointer ${
                f.locked
                  ? "text-dashboard-muted-light dark:text-dashboard-muted-dark cursor-not-allowed opacity-60 grayscale"
                  : "text-dashboard-text-light dark:text-dashboard-text-dark hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
              } ${
                selectedFont === f.name
                  ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark"
                  : ""
              }`}
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

      <p
        className="
        text-xs mt-3 text-center
        text-dashboard-muted-light
        dark:text-dashboard-muted-dark
      "
      >
        Hover to preview, click to select.
      </p>
    </div>
  );
}

import { useEffect } from "react";

export default function ThemePreviewModal({ showPreview, onClose, theme, PDFThemePreview }) {
  if (!showPreview) return null;

  // inside ThemePreviewModal
useEffect(() => {
  document.body.style.overflow = showPreview ? "hidden" : "";
}, [showPreview]);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]"
      onClick={onClose} // click outside closes preview only
    >
      <div
        className="bg-gray-900 rounded-2xl p-6 relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()} // prevent bubbling
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-lg hover:text-red-400"
        >
          ✕
        </button>
        <h2 className="text-white text-lg font-semibold mb-4 text-center">
          PDF Theme Preview ({theme})
        </h2>

        <PDFThemePreview
          themeConfig={{
            modern: {
              font: "Montserrat",
              primaryColor: "#000",
              textColor: "#222",
              ctaBg: "#00E07A",
              ctaText: "#000",
              linkGradient: "linear-gradient(90deg, #00E07A 0%, #670fe7 100%)",
            },
            classic: {
              font: "AdobeArabic",
              primaryColor: "#000",
              textColor: "#444",
              ctaBg: "#000000",
              ctaText: "#FFD700",
              linkGradient: "linear-gradient(90deg, #000000 0%, #000000 100%)",
            },
            bold: {
              font: "Bebas Neue",
              primaryColor: "#000",
              textColor: "#111",
              ctaBg: "#EC4899",
              ctaText: "#fff",
              linkGradient: "linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)",
            },
          }[theme]}
        />
      </div>
    </div>
  );
}

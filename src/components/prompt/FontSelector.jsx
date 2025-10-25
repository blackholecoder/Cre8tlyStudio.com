import { themes } from "../../constants/index";


export default function ThemeSelector({ theme, setTheme }) {
  return (
    <div className="mt-6">
      <label className="block text-silver mb-2 font-medium">
        Font Style
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTheme(t.value)}
            className={`p-4 rounded-xl border font-semibold shadow-md transition-transform duration-200 ease-out ${
              theme === t.value
                ? "border-green ring-2 ring-green/60 scale-[1.01]"
                : "border-gray-700 hover:ring-1 hover:ring-green/40 hover:scale-[1.01]"
            }`}
            style={{
              background: "#111",
              color: t.textColor,
              fontFamily:
                t.value === "modern"
                  ? "Montserrat"
                  : t.value === "classic"
                  ? "AdobeArabic"
                  : "Bebas Neue",
            }}
          >
            <p className="text-base">{t.label}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Each style uses a unique font in your final PDF.
      </p>
    </div>
  );
}



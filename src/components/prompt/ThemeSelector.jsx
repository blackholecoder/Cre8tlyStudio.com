import { themes } from "../../constants/index";

export default function ThemeSelector({ theme, setTheme, setShowPreview }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((t) => (
          <div
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${
              theme === t.value ? "border-green shadow-[0_0_15px_rgba(123,237,159,0.5)] scale-[1.02]" : "border-gray-700 hover:border-gray-500"
            }`}
          >
            <div
              className="h-24 rounded-md mb-3 flex items-center justify-center text-lg font-semibold"
              style={{
                background: t.preview,
                color: t.textColor,
                border: t.value === "classic" ? "1px solid #FFD700" : "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span>{t.label.split(" ")[0]}</span>
            </div>
            <p className="text-center text-white font-medium">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button type="button" onClick={() => setShowPreview(true)} className="text-sm font-semibold text-green hover:underline">
          👁️ Preview Theme
        </button>
      </div>
    </>
  );
}

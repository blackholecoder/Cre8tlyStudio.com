import { colorThemes } from "../constants";

export default function ColorThemeChooser({ bgTheme, setBgTheme }) {
  const selected = colorThemes.find((c) => c.name === bgTheme) || colorThemes[0];

  return (
    <div className="mt-6 w-full">
      <label className="block text-silver mb-3 font-medium">Theme Color</label>

      {/* 🟩 Live Preview Box */}
      <div
        className="h-14 w-full rounded-lg border border-gray-700 mb-4 shadow-inner transition-all duration-300"
        style={{ backgroundColor: selected.preview }}
      ></div>

      {/* 🎨 Grid of Swatches */}
      <div
  className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 overflow-y-auto rounded-lg border border-gray-800 p-2"
  style={{ maxHeight: "300px" }}
>
        {colorThemes.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setBgTheme(item.name)}
            className={`relative w-full h-12 rounded-lg transition-all duration-200 focus:outline-none border 
              ${
                bgTheme === item.name
                  ? "border-green-400 ring-2 ring-green-500/60 scale-[1.05]"
                  : "border-gray-700 hover:border-green-300 hover:scale-[1.02]"
              }`}
            style={{
              background: item.preview,
            }}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide ${
                item.name === "dark" || item.name === "graphite" || item.name === "royal"
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
        Click a color to set your PDF background theme.
      </p>
    </div>
  );
}


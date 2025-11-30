import React from "react";
import ColorThemeChooser from "../../ColorThemeChooser";
import FontSelector from "../../prompt/FontSelector";
import { colorThemes, gradientThemes } from "../../../constants";



export default function ThemeAndFontControls({
  landing,
  setLanding,
  bgTheme,
  setBgTheme,
  fontName,
  setFontName,
  fontFile,
  setFontFile,
}) {
  const pageBuilderThemes = [...colorThemes, ...gradientThemes];

  // helper to resolve actual CSS
  function resolveTheme(themeName) {
    const found = pageBuilderThemes.find((t) => t.name === themeName);
    return found?.preview || themeName;
  }

  return (
    <div className="mt-12 mb-12">
      {/* THEME PICKER */}
      <ColorThemeChooser
        bgTheme={bgTheme}
        setBgTheme={(themeName) => {
          const cssValue = resolveTheme(themeName);

          setBgTheme(cssValue);
          setLanding({
            ...landing,
            bg_theme: cssValue,
          });
        }}
        colorThemes={pageBuilderThemes}
        includeGradients={true}
      />

      {/* FONT PICKER */}
      <div className="relative z-[60] mt-6">
        <FontSelector
          fontName={fontName}
          setFontName={(name) => {
            setFontName(name);
            setLanding({ ...landing, font: name });
          }}
          fontFile={fontFile}
          setFontFile={(file) => {
            setFontFile(file);
            setLanding({ ...landing, font_file: file });
          }}
        />
      </div>
    </div>
  );
}

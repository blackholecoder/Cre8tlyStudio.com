export default function PDFThemePreview({ themeConfig }) {
  if (!themeConfig) return null;

  const { font, primaryColor, textColor  } = themeConfig;

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg border border-gray-700 w-full max-w-md mx-auto bg-white"
      style={{
        fontFamily: font,
        color: textColor,
      }}
    >
      {/* Simulated PDF Page */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <h1
          style={{
            color: primaryColor,
            fontWeight: 700,
            fontSize: "22px",
            textAlign: "center",
          }}
        >
          Your Lead Magnet Title
        </h1>

        {/* Body Text */}
        <p className="text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae
          sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet
          orci eget eros faucibus tincidunt.
        </p>

        <p className="text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae
          sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet
          orci eget eros faucibus tincidunt.
        </p>

        {/* Link Button */}
        <div className="text-center mt-4">
          <a
            href="#"
            className="rounded-full inline-block px-6 py-2 font-semibold shadow-md transition-transform duration-200"
            style={{
              background:
                themeConfig.font === "AdobeArabic"
                  ? "#000000" // Classic = black button
                  : themeConfig.linkGradient || themeConfig.ctaBg, // Others use gradient
              color:
                themeConfig.font === "AdobeArabic"
                  ? "#C9A86A" // Classic = gold text
                  : themeConfig.font === "Montserrat"
                    ? "#FFFFFF" // Modern = white text
                    : themeConfig.ctaText || "#fff", // Default fallback
              border:
                themeConfig.font === "AdobeArabic"
                  ? "1px solid #C9A86A" // Classic = gold border
                  : "none",
              textDecoration: "none",
              boxShadow: "0 0 6px rgba(0,0,0,0.25)",
            }}
          >
            Visit My Official Website
          </a>
        </div>
      </div>
    </div>
  );
}

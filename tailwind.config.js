/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '19.5px'],
      lg: ['18px', '21.94px'],
      xl: ['20px', '24.38px'],
      '2xl': ['24px', '29.26px'],
      '3xl': ['28px', '50px'],
      '4xl': ['48px', '58px'],
      '8xl': ['96px', '106px']
    },
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: "#ECEEFF",
        "coral-red": "#FF6452",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)",
        darkGray: "#040404",
        opal: "#F9FFFE",
        silver: "#BBC2CC",
        darkRed: "#e74c3c",
        darkerGrey: "#111111",
        purpleQueen: "#440381",
        sherbert: "#ffb433",
        royalPurple: "#670fe7",
        charcoal: "#1F1F1F",
        neo: "#1e1e1e",
        mutedTeal: "#008B87",
        mutedGrey: "#333333",
        bioModal: "#0a0a0a",
        blue: "#0652DD",
        green: "#7bed9f",
        headerGreen: "#5DD801",
        yellow: "#fed330",
        downloadGreen: "#009432",
      },
      screens: {
        wide: "1440px",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gradientPulse: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        // ✅ Add this glow effect
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(123,237,159,0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(123,237,159,0.9)" },
        },
      },
      animation: {
        shine: "shine 8s linear infinite",
        gradientPulse: "gradientPulse 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 1.5s ease-in-out infinite", // ✅ add this line
      },
    },
  },
  plugins: [],
}

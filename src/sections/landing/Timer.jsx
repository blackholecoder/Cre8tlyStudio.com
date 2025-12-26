import React, { useEffect, useState } from "react";

export default function CountdownTimerPreview({
  targetDate,
  variant = "minimal",
  bgTheme,
  glowColor,
  textColor,
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(targetDate);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00:00");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${String(days).padStart(2, "0")}:${String(hours).padStart(
          2,
          "0"
        )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // 🧠 Dynamically derive glow color based on bgTheme name/value
  const getAccentColor = () => {
    if (!bgTheme) return "#10b981"; // fallback green
    if (bgTheme.includes("emerald")) return "#10b981";
    if (bgTheme.includes("royal") || bgTheme.includes("purple"))
      return "#8b5cf6";
    if (bgTheme.includes("pink") || bgTheme.includes("rose")) return "#ec4899";
    if (bgTheme.includes("yellow") || bgTheme.includes("amber"))
      return "#facc15";
    if (bgTheme.includes("blue")) return "#3b82f6";
    if (bgTheme.includes("red")) return "#ef4444";
    return "#10b981";
  };

  const accent = getAccentColor();

  const finalTextColor = textColor;
  const finalGlowColor = glowColor || accent;

  const baseClasses =
    "font-mono tracking-widest transition-all duration-500 inline-block";

  const styleMap = {
    minimal: "text-3xl",
    boxed:
      "text-3xl bg-[#0f172a] border border-gray-700 px-6 py-3 rounded-lg shadow-md",
    glow: "text-3xl animate-pulse",
  };

  return (
    <div
      className={`${baseClasses} ${styleMap[variant] || styleMap.minimal}`}
      style={{
        color: finalTextColor, // 👈 TEXT COLOR ONLY
        ...(variant === "glow"
          ? {
              textShadow: `
          0 0 6px ${finalGlowColor},
          0 0 14px ${finalGlowColor},
          0 0 28px ${finalGlowColor}
        `,
            }
          : {}),
      }}
    >
      {timeLeft || "00:00:00:00"}
    </div>
  );
}

export function adjustForLandingOverlay(baseColor, overlayRgba = "rgba(255,255,255,0.04)") {
  if (!baseColor) return "#000";

  // If gradient → keep the gradient, no blend math applied
  if (baseColor.includes("linear-gradient")) return baseColor;

  // ✅ Convert backend’s blendColors logic
  const hex = baseColor.replace("#", "");
  if (hex.length !== 6) return baseColor;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const match = overlayRgba.match(/rgba?\(([^)]+)\)/);
  if (!match) return baseColor;

  const [or, og, ob, oa = 1] = match[1].split(",").map((v) => parseFloat(v.trim()));
  const alpha = oa || 0.04;

  // 🎨 Blend the overlay toward white (same as backend)
  const nr = Math.round(or * alpha + r * (1 - alpha));
  const ng = Math.round(og * alpha + g * (1 - alpha));
  const nb = Math.round(ob * alpha + b * (1 - alpha));

  return `rgb(${nr}, ${ng}, ${nb})`;
}

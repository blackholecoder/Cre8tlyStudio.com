// helpers/adjustForLandingOverlay.js
export function adjustForLandingOverlay(baseColor) {
  // If gradient, keep it as-is but add a semi-white overlay effect
  if (baseColor.includes("linear-gradient")) {
    return `${baseColor}, rgba(255,255,255,0.05)`; // slightly brightens
  }

  // For solid colors, brighten slightly by blending toward white
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // blend 5% toward white to mimic overlay
  const brighten = (c) => Math.min(255, Math.round(c + (255 - c) * 0.05));
  return `rgb(${brighten(r)}, ${brighten(g)}, ${brighten(b)})`;
}
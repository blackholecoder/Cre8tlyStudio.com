export const MOTION_PRESETS = [
  // --- Fades ---
  { value: "fade", label: "Fade In" },
  { value: "fade-up", label: "Fade Up" },
  { value: "fade-down", label: "Fade Down" },
  { value: "fade-left", label: "Fade Left" },
  { value: "fade-right", label: "Fade Right" },

  // --- Slides ---
  { value: "slide-up", label: "Slide Up" },
  { value: "slide-down", label: "Slide Down" },
  { value: "slide-left", label: "Slide Left" },
  { value: "slide-right", label: "Slide Right" },

  // --- Scale ---
  { value: "scale-up", label: "Scale Up" },
  { value: "scale-down", label: "Scale Down" },

  // --- Fancy ---
  { value: "blur-in", label: "Blur In" },
  { value: "rotate-in", label: "Rotate In" },
  { value: "flip-up", label: "Flip Up" },
  { value: "flip-left", label: "Flip Left" },

  // --- Attention ---
  { value: "pop", label: "Pop" },
  { value: "bounce", label: "Bounce" },
];

export const PRESET_VARIANTS = {
  // fades
  fade: { opacity: 0 },
  "fade-up": { opacity: 0, y: 30 },
  "fade-down": { opacity: 0, y: -30 },
  "fade-left": { opacity: 0, x: 30 },
  "fade-right": { opacity: 0, x: -30 },

  // slides
  "slide-up": { y: 60 },
  "slide-down": { y: -60 },
  "slide-left": { x: -60 },
  "slide-right": { x: 60 },

  // scale
  "scale-up": { scale: 0.9, opacity: 0 },
  "scale-down": { scale: 1.1, opacity: 0 },

  // fancy
  "blur-in": { opacity: 0, filter: "blur(10px)", y: 20 },
  "rotate-in": { opacity: 0, rotate: -8, scale: 0.95 },

  // flips
  "flip-up": { rotateX: -90, opacity: 0 },
  "flip-left": { rotateY: -90, opacity: 0 },

  // attention
  pop: { scale: 0.8, opacity: 0 },
  bounce: { y: -20, opacity: 0 },
};

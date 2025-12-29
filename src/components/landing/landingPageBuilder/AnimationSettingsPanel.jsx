import { MOTION_PRESETS } from "../../../constants/motionPresets";

export default function AnimationSettingsPanel({ landing, setLanding }) {
  const motion = {
    enabled: landing.motion_settings?.enabled ?? false,
    preset: landing.motion_settings?.preset ?? "fade-up",
    duration: landing.motion_settings?.duration ?? 0.5,
    delay: landing.motion_settings?.delay ?? 0,
    stagger: landing.motion_settings?.stagger ?? 0.12,
    easing: landing.motion_settings?.easing ?? "ease-out",
    panel_open: landing.motion_settings?.panel_open ?? false,
  };

  return (
    <div className="border border-gray-700 rounded-lg px-4 py-1 bg-black/30 mb-4">
      {/* Header */}
      <div className="relative flex items-center mb-4 mt-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-silver font-medium">
            Animate page sections
          </span>

          {/* Enable switch */}
          <button
            type="button"
            onClick={() =>
              setLanding((prev) => ({
                ...prev,
                motion_settings: {
                  enabled: !motion.enabled,
                  preset: motion.preset,
                  duration: motion.duration,
                  delay: motion.delay,
                  stagger: motion.stagger,
                  easing: motion.easing,
                  panel_open: motion.panel_open,
                },
              }))
            }
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
              motion.enabled ? "bg-green" : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                motion.enabled ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Collapse toggle */}
        {motion.enabled && (
          <button
            type="button"
            onClick={() =>
              setLanding((prev) => ({
                ...prev,
                motion_settings: {
                  enabled: motion.enabled,
                  preset: motion.preset,
                  duration: motion.duration,
                  delay: motion.delay,
                  stagger: motion.stagger,
                  easing: motion.easing,
                  panel_open: !motion.panel_open,
                },
              }))
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
          >
            <span
              className={`inline-block transition-transform duration-200 ${
                motion.panel_open ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
        )}
      </div>

      {/* Entire panel */}
      {motion.enabled && motion.panel_open && (
        <div className="space-y-4 max-w-md">
          {/* Preset */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-4">
              Animation preset
            </label>
            <select
              value={motion.preset}
              onChange={(e) =>
                setLanding((prev) => ({
                  ...prev,
                  motion_settings: {
                    ...prev.motion_settings,
                    preset: e.target.value,
                  },
                }))
              }
              className="w-full rounded-md bg-black/40 border border-gray-600 text-white text-sm px-3 py-2"
            >
              {MOTION_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <Range
            label="Animation speed (seconds)"
            value={motion.duration}
            min={0.2}
            max={2}
            step={0.1}
            onChange={(v) =>
              setLanding((prev) => ({
                ...prev,
                motion_settings: { ...prev.motion_settings, duration: v },
              }))
            }
          />

          {/* Stagger */}
          <Range
            label="Stagger delay between sections"
            value={motion.stagger}
            min={0}
            max={0.5}
            step={0.02}
            onChange={(v) =>
              setLanding((prev) => ({
                ...prev,
                motion_settings: { ...prev.motion_settings, stagger: v },
              }))
            }
          />

          {/* Delay */}
          <Range
            label="Initial page delay"
            value={motion.delay}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) =>
              setLanding((prev) => ({
                ...prev,
                motion_settings: { ...prev.motion_settings, delay: v },
              }))
            }
          />

          {/* Easing */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Animation easing
            </label>
            <select
              value={motion.easing}
              onChange={(e) =>
                setLanding((prev) => ({
                  ...prev,
                  motion_settings: {
                    ...prev.motion_settings,
                    easing: e.target.value,
                  },
                }))
              }
              className="w-full bg-black/40 border border-gray-600 rounded-md px-3 py-2 text-sm"
            >
              <option value="ease-out">Ease out</option>
              <option value="ease-in">Ease in</option>
              <option value="ease-in-out">Ease in out</option>
              <option value="linear">Linear</option>
              <option value="cubic-bezier(0.4, 0, 0.2, 1)">
                Material smooth
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

/* Small helper */
function Range({ label, value, min, max, step, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-xs text-gray-500">{value}s</div>
    </div>
  );
}

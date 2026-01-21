import { MOTION_PRESETS } from "../../../constants/motionPresets";
import { MotionPreview } from "./MotionPreview";

export default function AnimationSettingsPanel({ landing, setLanding }) {
  const DEFAULT_MOTION = {
    enabled: false,
    preset: "fade-up",
    duration: 0.5,
    delay: 0,
    stagger: 0.12,
    easing: [0, 0, 0.2, 1],
    panel_open: false,
  };

  const motion = {
    ...DEFAULT_MOTION,
    ...(landing.motion_settings || {}),
  };

  const EASING_MAP = {
    linear: "linear",
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  };

  function updateMotion(patch) {
    const SAFE_EASINGS = [
      "linear",
      "cubic-bezier(0, 0, 0.2, 1)",
      "cubic-bezier(0.4, 0, 1, 1)",
      "cubic-bezier(0.4, 0, 0.2, 1)",
    ];

    setLanding((prev) => {
      const next = {
        ...DEFAULT_MOTION,
        ...(prev.motion_settings || {}),
        ...patch,
      };

      if (!SAFE_EASINGS.includes(next.easing)) {
        next.easing = DEFAULT_MOTION.easing;
      }

      return {
        ...prev,
        motion_settings: next,
      };
    });
  }

  return (
    <div className="border border-dashboard-border-light dark:border-dashboard-border-dark rounded-lg px-4 py-1 bg-dashboard-bg-light dark:bg-dashboard-bg-dark mb-4">
      {/* Header */}
      <div className="relative flex items-center mb-4 mt-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
            Animate page sections
          </span>

          {/* Enable switch */}
          <button
            type="button"
            onClick={() =>
              updateMotion({
                enabled: !motion.enabled,
                panel_open: !motion.enabled ? true : motion.panel_open,
              })
            }
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
              motion.enabled
                ? "bg-green"
                : "bg-dashboard-border-light dark:bg-dashboard-border-dark"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full shadow transition-transform duration-200
  bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
  ${motion.enabled ? "translate-x-4" : "translate-x-1"}
`}
            />
          </button>
        </div>

        {/* Collapse toggle */}
        {motion.enabled && (
          <button
            type="button"
            onClick={() =>
              updateMotion({
                panel_open: !motion.panel_open,
              })
            }
            className="absolute right-0 top-1/2 -translate-y-1/2
text-dashboard-muted-light dark:text-dashboard-muted-dark
hover:text-dashboard-text-light dark:hover:text-dashboard-text-dark
transition"
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
        <div
          className="space-y-4 max-w-md pb-6 pt-6
"
        >
          {/* Preset */}
          <div>
            <label className="block text-xs font-semibold text-dashboard-muted-light dark:text-dashboard-muted-dark mb-4">
              Animation preset
            </label>

            <select
              value={motion.preset}
              onChange={(e) =>
                updateMotion({
                  preset: e.target.value,
                })
              }
              className="w-full rounded-md
bg-dashboard-bg-light dark:bg-dashboard-bg-dark
border border-dashboard-border-light dark:border-dashboard-border-dark
text-dashboard-text-light dark:text-dashboard-text-dark
text-sm px-3 py-2"
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
              updateMotion({
                duration: v,
              })
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
              updateMotion({
                stagger: v,
              })
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
              updateMotion({
                delay: v,
              })
            }
          />

          {/* Easing */}
          <div>
            <label className="block text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
              Animation easing
            </label>
            <select
              value={motion.easing}
              onChange={(e) =>
                updateMotion({
                  easing: EASING_MAP[e.target.value],
                })
              }
              className="w-full rounded-md
bg-dashboard-bg-light dark:bg-dashboard-bg-dark
border border-dashboard-border-light dark:border-dashboard-border-dark
text-dashboard-text-light dark:text-dashboard-text-dark
px-3 py-2 text-sm"
            >
              <option value="easeOut">Ease out</option>
              <option value="easeIn">Ease in</option>
              <option value="easeInOut">Ease in out</option>
              <option value="linear">Linear</option>
              <option value="cubic-bezier(0.4, 0, 0.2, 1)">
                Material smooth
              </option>
            </select>
            <MotionPreview
              preset={motion.preset}
              duration={motion.duration}
              easing={motion.easing}
              stagger={motion.stagger}
              delay={motion.delay}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Range({ label, value, min, max, step, onChange }) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <label className="block text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
        {label}
      </label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="custom-range"
        style={{
          background: `linear-gradient(
            to right,
            #670fe7 ${percent}%,
            var(--dashboard-border-light) ${percent}%
          )`,
        }}
      />

      <div className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mt-1">
        {value}s
      </div>
    </div>
  );
}

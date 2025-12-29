<div className="flex items-center gap-3 mb-4">
  <span className="text-sm text-silver font-medium">Animate page sections</span>

  <button
    type="button"
    onClick={() =>
      setLanding((prev) => ({
        ...prev,
        motion_settings: {
          ...(prev.motion_settings || {}),
          enabled: !prev.motion_settings?.enabled,
        },
      }))
    }
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      landing.motion_settings?.enabled ? "bg-green" : "bg-gray-600"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        landing.motion_settings?.enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
</div>;
{
  landing.motion_settings?.enabled && (
    <div className="mb-4 max-w-xs">
      <label className="block text-xs font-semibold text-gray-400 mb-1">
        Animation preset
      </label>

      <select
        value={landing.motion_settings?.preset || "fade-up"}
        onChange={(e) =>
          setLanding((prev) => ({
            ...prev,
            motion_settings: {
              ...(prev.motion_settings || {}),
              preset: e.target.value,
            },
          }))
        }
        className="
                w-full
                rounded-md
                bg-black/40
                border
                border-gray-600
                text-white
                text-sm
                px-3
                py-2
                focus:outline-none
                focus:border-green
      "
      >
        {MOTION_PRESETS.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}
{
  landing.motion_settings?.enabled && (
    <div className="space-y-4 max-w-md mt-4">
      {/* Duration */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Animation speed (seconds)
        </label>
        <input
          type="range"
          min="0.2"
          max="2"
          step="0.1"
          value={landing.motion_settings.duration}
          onChange={(e) =>
            setLanding((prev) => ({
              ...prev,
              motion_settings: {
                ...prev.motion_settings,
                duration: Number(e.target.value),
              },
            }))
          }
        />
        <div className="text-xs text-gray-500">
          {landing.motion_settings.duration}s
        </div>
      </div>

      {/* Stagger */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Stagger delay between sections
        </label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.02"
          value={landing.motion_settings.stagger}
          onChange={(e) =>
            setLanding((prev) => ({
              ...prev,
              motion_settings: {
                ...prev.motion_settings,
                stagger: Number(e.target.value),
              },
            }))
          }
        />
        <div className="text-xs text-gray-500">
          {landing.motion_settings.stagger}s
        </div>
      </div>

      {/* Initial Delay */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Initial page delay
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={landing.motion_settings.delay}
          onChange={(e) =>
            setLanding((prev) => ({
              ...prev,
              motion_settings: {
                ...prev.motion_settings,
                delay: Number(e.target.value),
              },
            }))
          }
        />
        <div className="text-xs text-gray-500">
          {landing.motion_settings.delay}s
        </div>
      </div>

      {/* Easing */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Animation easing
        </label>
        <select
          value={landing.motion_settings.easing}
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
          <option value="ease-out">Ease out (default)</option>
          <option value="ease-in">Ease in</option>
          <option value="ease-in-out">Ease in out</option>
          <option value="linear">Linear</option>
          <option value="cubic-bezier(0.4, 0, 0.2, 1)">Material smooth</option>
        </select>
      </div>
    </div>
  );
}

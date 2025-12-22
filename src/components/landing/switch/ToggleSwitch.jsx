function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange(!enabled);
      }}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
        ${enabled ? "bg-green" : "bg-gray-600"}
      `}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${enabled ? "translate-x-4" : "translate-x-1"}
        `}
      />
    </button>
  );
}

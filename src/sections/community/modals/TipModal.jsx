import { useState } from "react";

const MIN_TIP_DOLLARS = 2;
export default function TipModal({ open, onTip, onClose, loading }) {
  const [customAmount, setCustomAmount] = useState("");

  if (!open) return null;

  const handleCustomTip = () => {
    const dollars = parseFloat(customAmount);

    if (isNaN(dollars) || dollars < MIN_TIP_DOLLARS) return;

    onTip(Math.round(dollars * 100));
    setCustomAmount("");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          rounded-2xl
          p-6
          w-full
          max-w-sm
          space-y-5
          shadow-2xl
          border
          border-dashboard-border-light
          dark:border-dashboard-border-dark
        "
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-2xl">💖</div>
          <h3 className="text-lg font-semibold text-dashboard-text-light dark:text-dashboard-text-dark">
            Support this writer
          </h3>
          <p className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
            A small tip goes a long way and lets them know their words mattered.
          </p>
        </div>

        {/* Preset amounts */}
        <div className="grid grid-cols-3 gap-3">
          {[2, 5, 10].map((amount) => (
            <button
              key={amount}
              onClick={() => onTip(amount * 100)}
              disabled={loading}
              className="
                py-3
                rounded-xl
                border
                border-dashboard-border-light
                dark:border-dashboard-border-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                font-medium
                transition
                hover:bg-green/10
                hover:border-green/40
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="space-y-1">
          <label className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
            Custom amount (minimum $2)
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dashboard-muted-light dark:text-dashboard-muted-dark">
                $
              </span>
              <input
                type="number"
                min={MIN_TIP_DOLLARS}
                step="0.01"
                placeholder="2.00"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="
                w-full
                pl-7
                pr-3
                py-2.5
                rounded-lg
                bg-dashboard-bg-light
                dark:bg-dashboard-bg-dark
                border
                border-dashboard-border-light
                dark:border-dashboard-border-dark
                text-dashboard-text-light
                dark:text-dashboard-text-dark
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-green/40
              "
              />
            </div>

            <button
              onClick={handleCustomTip}
              disabled={
                loading ||
                !customAmount ||
                parseFloat(customAmount) < MIN_TIP_DOLLARS
              }
              className="
              px-4
              rounded-lg
              bg-green
              text-black
              font-medium
              text-sm
              transition
              hover:bg-green/90
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            >
              Send
            </button>
          </div>

          {Number(customAmount) > 0 &&
            Number(customAmount) < MIN_TIP_DOLLARS && (
              <p className="text-[11px] text-dashboard-muted-light dark:text-dashboard-muted-dark">
                Minimum tip is $2
              </p>
            )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="
            w-full
            text-xs
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
            hover:opacity-80
          "
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

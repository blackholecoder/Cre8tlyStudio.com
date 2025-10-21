// components/OnboardingGuide.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function OnboardingGuide({ steps = [], onFinish }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (steps.length > 0 && steps[activeIndex]) {
      const el = document.querySelector(steps[activeIndex].target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      }
    }
  }, [activeIndex, steps]);

  function handleNext() {
    if (activeIndex < steps.length - 1) setActiveIndex(activeIndex + 1);
    else onFinish?.();
  }

  function handleBack() {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  }

  if (!steps.length || !targetRect) return null;
  const step = steps[activeIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black/70 z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Highlight ring */}
        <motion.div
          className="absolute border-4 border-emerald-400 rounded-xl shadow-[0_0_25px_5px_rgba(16,185,129,0.6)] pointer-events-none"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Tooltip */}
        <motion.div
          className="absolute bg-[#111827] text-white rounded-xl shadow-lg border border-emerald-500/30 p-4 w-72"
          style={{
            top: targetRect.bottom + 12,
            left: targetRect.left,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm mb-4 leading-relaxed">{step.content}</p>

          <div className="flex justify-between text-sm">
            <button
              onClick={handleBack}
              disabled={activeIndex === 0}
              className={`px-3 py-1 rounded-lg border border-gray-600 hover:bg-gray-800 transition ${
                activeIndex === 0 && "opacity-50 cursor-not-allowed"
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition"
            >
              {activeIndex === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

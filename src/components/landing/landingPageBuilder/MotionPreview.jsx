import { useState } from "react";
import { motion } from "framer-motion";
import { PRESET_VARIANTS } from "../../../constants/motionPresets";

export function MotionPreview({
  preset,
  duration,
  easing,
  stagger = 0,
  delay = 0,
}) {
  const [replayKey, setReplayKey] = useState(0);

  const hidden = PRESET_VARIANTS[preset] || PRESET_VARIANTS.fade;

  return (
    <div className="mt-4 rounded-md border border-gray-700 bg-black/40 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">Preview</span>

        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="text-xs rounded px-2 py-2 text-white bg-royalPurple hover:text-white transition"
        >
          Replay
        </button>
      </div>

      {/* Preview area */}
      <motion.div
        key={`${preset}-${duration}-${easing}-${stagger}-${delay}-${replayKey}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: delay,
              staggerChildren: stagger,
            },
          },
        }}
        className="flex flex-col gap-2 items-center h-32 overflow-hidden"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={{
              hidden,
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                filter: "blur(0px)",
                transition: {
                  duration,
                  ease: easing,
                },
              },
            }}
            className="w-16 h-6 rounded-md bg-royalPurple shadow-md"
          />
        ))}
      </motion.div>
    </div>
  );
}

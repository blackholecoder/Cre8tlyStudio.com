import { motion, AnimatePresence } from "framer-motion";

export default function GenerationOverlay({ visible, progress, type = "lead" }) {
  const label =
    type === "book"
      ? "book"
      : type === "lead"
      ? "lead magnet"
      : type === "content";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-[9999] text-center p-6"
        >
          {/* Pulsing header text */}
          <motion.h2
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white text-xl sm:text-2xl font-semibold mb-4"
          >
            {type === "book"
              ? "📚 Generating your book..."
              : "🚀 Creating your digital asset..."}
          </motion.h2>

          {/* Animated progress container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-3/4 max-w-md mt-6"
          >
            <div className="relative w-full h-[3px] bg-gray-800/60 rounded-full overflow-hidden">
              {/* Self-glowing green bar */}
              <div
                className="absolute top-0 left-0 h-full rounded-full 
                bg-gradient-to-r from-white to-[#00E07A]
                transition-all duration-200 ease-linear animate-progressGlowGreen"
                style={{
                  width: `${progress}%`,
                  boxShadow: `
                    0 0 8px rgba(0,224,122,0.8),
                    0 0 16px rgba(0,224,122,0.7),
                    0 0 28px rgba(0,224,122,0.6),
                    0 0 45px rgba(0,224,122,0.5)
                  `,
                }}
              />
            </div>
          </motion.div>

          {/* White flash effect when complete */}
          <AnimatePresence>
            {progress >= 100 && (
              <motion.div
                key="complete-flash"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 bg-white/30"
              />
            )}
          </AnimatePresence>

          {/* Subtext fade-up */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, duration: 0.6 },
            }}
            className="text-gray-400 text-sm mt-4 italic"
          >
            {type === "book"
              ? "This may take a few minutes — crafting a great story takes time ✨"
              : "This might take a moment — crafting something powerful ✨"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

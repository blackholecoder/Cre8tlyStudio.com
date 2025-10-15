import { motion, AnimatePresence } from "framer-motion";

export default function GenerationOverlay({ visible, progress, type = "lead" }) {
  // Capitalize first letter for consistency
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
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-white text-xl sm:text-2xl font-semibold mb-4"
          >
            {type === "book" ? "📚 Generating your book..." : "🚀 Creating your lead magnet..."}
          </motion.h2>

          {/* Progress bar */}
          <div className="w-3/4 max-w-md">
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00E07A] to-[#6A5ACD] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Subtext */}
          <p className="text-gray-400 text-sm mt-4 italic">
            {type === "book"
              ? "This may take a few minutes — crafting a great story takes time ✨"
              : "This might take a moment — crafting something powerful ✨"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


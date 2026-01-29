import { useNavigate, Outlet, useMatch } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle, GraduationCap, LifeBuoy } from "lucide-react";

export default function Resources() {
  const navigate = useNavigate();
  const isVideos = useMatch("/resources/videos");

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  return (
    <main className="relative w-full min-h-screen bg-white pt-32 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* soft background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-green-400/10 blur-3xl pointer-events-none" />

      {!isVideos && (
        <>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-black design-text mb-4"
          >
            Resources
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-black/80 max-w-2xl mb-16"
          >
            Free training, guides, and tools to help you design, launch, and
            sell your book faster.
          </motion.p>
        </>
      )}

      {!isVideos && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {/* Training Videos */}
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigateWithReferral("videos")}
            className="group w-full text-left rounded-3xl border border-gray-200 p-10 bg-white shadow-sm hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div className="flex items-center gap-4 mb-4">
              <PlayCircle className="h-8 w-8 text-downloadGreen" />
              <h3 className="text-2xl font-semibold text-black">
                Training Videos
              </h3>
            </div>

            <p className="text-black/70 leading-relaxed">
              Step by step walkthroughs covering the full The Messy Attic Pro
              workflow, from idea to launch.
            </p>

            <div className="mt-6 text-sm font-semibold text-green-600 group-hover:underline">
              Start watching →
            </div>
          </motion.button>

          {/* Courses Coming Soon */}
          <div className="relative rounded-3xl border border-gray-200 p-10 bg-gray-50">
            <div className="flex items-center gap-4 mb-4">
              <GraduationCap className="h-8 w-8 text-gray-400" />
              <h3 className="text-2xl font-semibold text-black">
                Training Courses
              </h3>
            </div>

            <p className="text-gray-500 leading-relaxed">
              Deep dive structured courses designed to help you master digital
              products and sales.
            </p>

            <span className="inline-block mt-6 px-4 py-1 text-xs font-semibold rounded-full bg-black text-white">
              Coming soon
            </span>
          </div>
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigateWithReferral("/contact")}
            className="group w-full text-left rounded-3xl border border-gray-200 p-10 bg-white shadow-sm hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-black"
          >
            <div className="flex items-center gap-4 mb-4">
              <LifeBuoy className="h-8 w-8 text-red-600" />
              <h3 className="text-2xl font-semibold text-black">
                Contact Support
              </h3>
            </div>

            <p className="text-black/70 leading-relaxed">
              Get help with your account, products, billing, or technical
              questions from the Messy Attic support team.
            </p>

            <div className="mt-6 text-sm font-semibold text-green-600 group-hover:underline">
              Contact us →
            </div>
          </motion.button>
        </div>
      )}
      {/* Contact Support */}

      <Outlet />
    </main>
  );
}

import { motion } from "framer-motion";
import {ebookCover} from "../assets/images/"

export default function PremiumEbooksCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative mt-28 mb-20 rounded-2xl overflow-hidden border border-white/10 bg-[#0b0f1a] p-10"
    >
      {/* Background glow */}
      <div className="absolute inset-0 blur-3xl opacity-40" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
        {/* Left text */}
        <div className="max-w-xl">
          <h3 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-green bg-clip-text text-transparent">
            Ready to Go Deeper?
          </h3>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Unlock our full library of{" "}
            <span className="text-white font-semibold">
              premium guides
            </span>{" "}
            designed to help entrepreneurs, marketers, and creators dominate
            their niche. Each guide is downloadable instantly.
          </p>

          <a 
            href="/shop"
            className="inline-block px-8 py-4 bg-royalPurple text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.03]"
          >
            🚀 Browse Premium Ebooks
          </a>
        </div>

        {/* Right image */}
        <div className="flex justify-center w-full lg:w-auto">
          <img
            src={ebookCover}
            alt="Ebook Collection Preview"
            className="rounded-xl w-80 sm:w-96 border border-white/10 "
          />
        </div>
      </div>
    </motion.section>
  );
}

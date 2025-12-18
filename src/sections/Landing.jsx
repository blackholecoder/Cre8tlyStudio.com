import { motion } from "framer-motion";
import VideoPlayer from "../components/VideoPlayer";
import Hero from "../components/hero/Hero";
import PlatformShowcase from "../sections/landing/PlatformShowcase";

const Landing = () => {
  return (
    <div className="min-h-screen w-full text-white flex flex-col font-sans overflow-x-hidden">
      <Hero />
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-32 relative overflow-hidden">
        <motion.h1
          className="text-[34px] sm:text-[44px] md:text-[64px] lg:text-[80px]
          font-extrabold tracking-tight text-black leading-[1.05]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Create High-Converting <br />
          Lead Magnets in Seconds
        </motion.h1>

        <motion.p
          style={{ fontFamily: '"PT Serif", serif' }}
          className="mt-8 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Cre8tly Studio is an{" "}
          <span className="text-red-600 font-bold">
            AI-powered digital product builder
          </span>{" "}
          that helps{" "}
          <span className="text-black font-bold">
            creators, coaches, and entrepreneurs
          </span>{" "}
          design professional digital products, eBooks, and brand assets in
          seconds. Boost conversions, grow your email list, and sell faster with{" "}
          <span className="text-black font-bold">
            automated content creation
          </span>
          , pro-level cover design, and{" "}
          <span className="text-red-600 font-bold">instant PDF generation</span>{" "}
          all in one platform built for modern online businesses.
        </motion.p>

        {/* Responsive full-width video */}
        <div className="w-full max-w-5xl mt-12 rounded-2xl overflow-hidden">
          <VideoPlayer />
        </div>
      </section>

      <PlatformShowcase />
    </div>
  );
};

export default Landing;

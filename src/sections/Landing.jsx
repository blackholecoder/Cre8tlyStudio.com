import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HowItWorks from "./HowItWorks";
import VideoPlayer from "../components/VideoPlayer";
import PremiumEbooksCTA from "./PremiumEbooksCTA";
import { getVersion } from "@tauri-apps/api/app";
import AnimatedLogo from "../components/animation/AnimatedLogo";

const Landing = () => {
  const [isApp, setIsApp] = useState(false);

   useEffect(() => {
    async function checkIfApp() {
      try {
        await getVersion();
        setIsApp(true);
      } catch {
        setIsApp(false);
      }
    }
    checkIfApp();
  }, []);

  return (
    <div className="min-h-screen w-full text-white flex flex-col font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-32 relative overflow-hidden">
       
        <AnimatedLogo />
        

        <h1 className="text-headerGreen text-4xl sm:text-6xl font-extrabold">
          Cre8tly Studio
        </h1>

        <motion.h2
          className="text-5xl sm:text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Create High-Converting Lead Magnets in Seconds
        </motion.h2>

        <motion.p
          className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-2xl lead-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The fastest way to turn your idea into a
          <br /> sellable digital product.
        </motion.p>

        {/* Responsive full-width video */}
        <div className="w-full max-w-5xl mt-12 rounded-2xl overflow-hidden">
          <VideoPlayer />
        </div>
      </section>


      <HowItWorks />
        {!isApp && (
          <PremiumEbooksCTA />
      )}
    </div>
  );
};

export default Landing;

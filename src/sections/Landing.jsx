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

        <h1 className="relative inline-block text-green text-4xl sm:text-8xl font-extrabold design-text">
  Cre8tly Studio
  <span className="absolute -top-2 sm:-top-1 -right-8 sm:-right-10 text-green text-2xl sm:text-3xl font-bold lead-text">
    AI
  </span>
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

        <motion.p
          className="mt-8 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Cre8tly Studio is an <span className="text-green font-bold">AI-powered</span>  digital product builder that helps
          creators, coaches, and entrepreneurs <span className="text-white font-bold">design professional digital
          products</span>, eBooks, and <span className="text-hotPink font-bold">brand assets in seconds</span>. Boost conversions, grow
          your email list, and sell faster with automated content creation,
          pro-level cover design, and <span className="text-green font-bold">instant PDF generation</span> all in one platform
          built for modern online businesses.
        </motion.p>

        {/* Responsive full-width video */}
        <div className="w-full max-w-5xl mt-12 rounded-2xl overflow-hidden">
          <VideoPlayer />
        </div>
      </section>
      

      <motion.p
  className="mt-16 mb-10 text-2xl sm:text-4xl text-center font-semibold leading-snug text-green tracking-tight max-w-4xl mx-auto design-text"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
>
 Creators don’t dream about success<br/> they generate it
</motion.p>
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 400 60"
  className="w-56 sm:w-72 mx-auto mt-2 mb-20"
>
  <defs>
    <linearGradient id="underline-gradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
    </linearGradient>
  </defs>
  <path
    d="M10 25 Q200 -10 390 25"
    stroke="url(#underline-gradient)"
    strokeWidth="5"
    fill="transparent"
    strokeLinecap="round"
  />
</svg>


      <HowItWorks />
      {!isApp && <PremiumEbooksCTA />}
    </div>
  );
};

export default Landing;

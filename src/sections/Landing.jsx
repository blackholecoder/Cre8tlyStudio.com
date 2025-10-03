import Button from "../components/Button";
import { motion } from "framer-motion";
import HowItWorks from "./HowItWorks";
import PricingSection from "./Pricing";

const Landing = () => {
  return (
    <div className="min-h-screen w-full text-white flex flex-col font-sans">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 relative overflow-hidden">
        <h1 className="text-green text-4xl sm:text-6xl font-extrabold">
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
          The fastest lead magnet generation software<br/> on the planet.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <a href="#pricing">
          <Button label="Generate My Lead Magnet" fullWidth={false} />
          </a>
        </motion.div>
      </section>

      <HowItWorks />
      <PricingSection />
    </div>
  );
};

export default Landing;

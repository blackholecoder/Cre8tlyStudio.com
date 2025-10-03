import { brand } from "../constants";
import { motion } from "framer-motion";

const textVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 4.5,
      delay: 0.2,
    },
  },
};

const Hero = () => {
  return (
    <section id="home" className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${brand.bgHero})` }}
        aria-hidden="true"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 min-h-screen">
        
        <h1 className="font-palanquin !text-[12vw] sm:!text-[8rem] font-bold text-white leading-[0.95] tracking-tight hero-text">
          {brand.name}
        </h1>

        {/* Slogan */}
        <motion.p
          className="mt-4 text-lg sm:text-2xl text-gray-200 max-w-2xl"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          The fastest lead generation software on the planet
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;

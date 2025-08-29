import { artist } from "../constants";
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
        style={{ backgroundImage: `url(${artist.bgHero})` }}
        aria-hidden="true"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 min-h-screen">
        <h1 className="font-palanquin !text-[12vw] sm:!text-[8rem] font-bold text-white leading-[0.95] tracking-tight hero-text">
  {artist.name}
</h1>

        <motion.p
          className="font-montserrat text-white/80 text-lg sm:text-xl leading-8 mt-6 mb-12 max-w-2xl"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {artist.tagline}
          <br />
          New single "{artist.latestSingle.title}" out now.
        </motion.p>

        {/* Latest Single Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-white/10">
          <img
            src={artist.latestSingle.cover}
            alt={artist.latestSingle.title}
            className="w-28 h-28 rounded-xl object-cover ring-1 ring-white/10"
          />
          <div className="text-center sm:text-left">
            <p className="text-sm text-silver">Latest single</p>
            <p className="text-2xl font-bold text-white">
              {artist.latestSingle.title}
            </p>
            <div className="mt-3 flex justify-center sm:justify-start gap-3">
              <a
                href="#features"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-blue text-white font-montserrat hover:opacity-90 transition"
              >
                Listen now
              </a>
              <a
                href={artist.ctas.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl border border-white/20 text-white font-montserrat hover:bg-white/10 transition"
              >
                Buy Single Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

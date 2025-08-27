import { merch } from "../constants";
import { MerchCard } from "../sections";
import { MdVerified } from "react-icons/md";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Merch = ({ user }) => {
  return (
    <section className="max-container">
      {/* Animated Heading */}
      <motion.div
        className="flex flex-col items-center justify-center text-center"
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
      >
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-palanquin text-white text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg">
            Phlokk <span className="text-phlokkGreen">Verified</span>
          </h3>
          <MdVerified className="text-phlokkGreen text-1xl drop-shadow" />
        </div>

        <p className="mt-2 text-lg text-phlokkGreen font-semibold uppercase tracking-wide">
          Get Officially Verified Today
        </p>

        <p className="mt-3 max-w-xl text-center text-gray-300 text-base leading-relaxed">
          Get Verified. Get Noticed. Get Support. Unlock exclusive visibility
          and build real trust with your audience — a verified badge isn’t just
          a look, it’s a level up. Stand out on every feed Boost credibility
          with fans and brands Access VIP Phone Support — verified creators now
          get direct access to our support team at 1 (888) 332-0774 for faster
          help, Monday–Saturday. This is your moment. Get verified and take your
          creator journey to the next level.
        </p>
      </motion.div>

      {/* Merch Cards */}
      <div className="mt-20 flex flex-wrap justify-center gap-14">
        {merch.map((tees) => (
          <MerchCard key={tees.title} {...tees} user={user} />
        ))}
      </div>
    </section>
  );
};

export default Merch;

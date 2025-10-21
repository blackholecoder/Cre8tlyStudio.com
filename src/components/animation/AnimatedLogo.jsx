import { motion } from "framer-motion";
import headerLogo from "../../assets/images/Robot-AI-white.svg";


export default function AnimatedLogo() {
  return (
    <motion.img
      src={headerLogo}
      alt="Logo"
      className="w-32 h-32 relative z-10"
      initial={{ scale: 0.98, filter: "drop-shadow(0 0 0px rgba(0,255,204,0))" }}
      animate={{
        scale: [1, 1.05, 1],
        filter: [
          "drop-shadow(0 0 0px rgba(0,255,204,0))",
          "drop-shadow(0 0 12px rgba(0,255,204,0.8))",
          "drop-shadow(0 0 0px rgba(0,255,204,0))",
        ],
      }}
      transition={{
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      whileHover={{
        scale: 1.1,
        filter: "drop-shadow(0 0 16px rgba(0,255,204,1))",
        transition: { type: "spring", stiffness: 150 },
      }}
    />
  );
}

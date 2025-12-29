import { motion } from "framer-motion";
import { PRESET_VARIANTS } from "../../../constants/motionPresets";

export default function MotionWrapper({
  children,
  index,
  motionSettings,
  blockMotion,
}) {
  if (!children) return null;

  const shouldAnimate =
    motionSettings?.enabled === true && blockMotion?.disabled !== true;

  if (!shouldAnimate) return <>{children}</>;

  const preset = blockMotion?.preset || motionSettings?.preset || "fade-up";

  const hidden = PRESET_VARIANTS[preset] || { opacity: 0 };

  const variants = {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        duration: motionSettings.duration ?? 0.5,
        delay:
          (motionSettings.delay ?? 0) +
          index * (motionSettings.stagger ?? 0.12),
        ease: motionSettings.easing ?? "easeOut",
        type: preset === "bounce" ? "spring" : "tween",
        bounce: preset === "bounce" ? 0.35 : 0,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: motionSettings.viewport_once ?? true }}
    >
      {children}
    </motion.div>
  );
}

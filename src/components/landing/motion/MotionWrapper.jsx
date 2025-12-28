import { motion } from "framer-motion";

export default function MotionWrapper({
  children,
  index,
  motionSettings,
  blockMotion,
}) {
  if (!children) return null;

  const shouldAnimate =
    motionSettings?.enabled === true && blockMotion?.disabled !== true;

  if (!shouldAnimate) return children;

  const variants = {
    hidden: {
      opacity: 0,
      y: motionSettings.preset === "fade-up" ? 30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionSettings.duration ?? 0.5,
        delay:
          (motionSettings.delay ?? 0) + index * (motionSettings.stagger ?? 0.1),
        ease: motionSettings.easing ?? "easeOut",
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

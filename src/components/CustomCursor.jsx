import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // track mouse position
  const mouseX = useMotionValue(-100); // start off-screen
  const mouseY = useMotionValue(-100); // start off-screen

  // springy motion for smooth follow
  const springX = useSpring(mouseX, { stiffness: 225, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 225, damping: 30 });

  useEffect(() => {
    const move = (e) => {
      if (!visible) setVisible(true); // fade in only once
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);

    // detect hover states on clickable elements
    const clickables = document.querySelectorAll("a, button, .clickable");
    clickables.forEach((el) => {
      el.addEventListener("mouseenter", () => setHovered(true));
      el.addEventListener("mouseleave", () => setHovered(false));
    });

    return () => {
      window.removeEventListener("mousemove", move);
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", () => setHovered(true));
        el.removeEventListener("mouseleave", () => setHovered(false));
      });
    };
  }, [visible]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.6,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        translateX: springX,
        translateY: springY,
      }}
    >
      {/* cursor dot */}
      <div
        className={`w-4 h-4 rounded-full transition-all duration-200 ${
          hovered
            ? "bg-[#7bed9f]/80 shadow-[0_0_15px_rgba(123,237,159,0.5)]"
            : "bg-[#7bed9f]/70 shadow-[0_0_10px_rgba(123,237,159,0.5)]"
        }`}
      />
    </motion.div>
  );
}

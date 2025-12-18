import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { Footer, Nav } from "../../sections";

export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    const wrapper = document.querySelector("#lenis-root");

    if (!wrapper) return;

    const lenis = new Lenis({
      wrapper,
      content: wrapper,
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Nav />

      {/* Lenis-controlled scroll area ONLY */}
      <div id="lenis-root" className="relative min-h-screen bg-transparent">
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

import { Footer, Landing } from "./sections";
import Nav from "./components/Nav";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4, // slightly longer glide
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out (natural feel)
      direction: "vertical", // default
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.5, // faster on touch devices
      wheelMultiplier: 1, // standard speed for mouse wheel
      infinite: false, // disables looping
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // optional: for scroll-linked animations
    lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }) => {
      // console.log({ scroll, velocity })
    });

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    // Instantly reset scroll position on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        // Delay ensures DOM is ready before smooth scroll
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      localStorage.setItem("ref_slug", ref);
    }
  }, []);

  // 🧭 If running inside Tauri, don’t render marketing site

  // 🌐 Normal web visitors get the full landing site
  return (
    <main className="relative min-h-screen bg-transparent">
      <Nav />
      <section id="landing">
        <Landing />
      </section>
      <Footer />
    </main>
  );
};

export default App;

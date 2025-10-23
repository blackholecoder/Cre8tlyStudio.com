import { Footer, Landing } from "./sections";
import Nav from "./components/Nav";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from '@studio-freight/lenis'
import CustomCursor from "./components/CustomCursor";


const App = () => {

  const location = useLocation();

useEffect(() => {
  const lenis = new Lenis({
    duration: 1.4, // slightly longer glide
    easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out (natural feel)
    direction: 'vertical', // default
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 1.5, // faster on touch devices
    wheelMultiplier: 1, // standard speed for mouse wheel
    infinite: false, // disables looping
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  // optional: for scroll-linked animations
  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    // console.log({ scroll, velocity })
  })

  return () => lenis.destroy()
}, [])


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

  // 🧭 If running inside Tauri, don’t render marketing site

  // 🌐 Normal web visitors get the full landing site
  return (
    <main className="relative min-h-screen bg-transparent">
      <CustomCursor />
      <Nav />
      <section id="landing" className="padding">
        <Landing />
      </section>
      <Footer />
    </main>
  );
};

export default App;

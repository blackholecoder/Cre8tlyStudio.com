import { Footer, Landing } from "./sections";
import Nav from "./components/Nav";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const isTauri = Boolean(window.__TAURI__);

const App = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        // Delay ensures the DOM has rendered before scrolling
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [location]);
  // 🧭 If running inside Tauri, don’t render marketing site
  if (isTauri) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-black text-white text-xl font-semibold">
        Redirecting to app...
      </main>
    );
  }

  // 🌐 Normal web visitors get the full landing site
  return (
    <main>
      <Nav />
      <section id="landing" className="padding">
        <Landing />
      </section>
      <Footer />
    </main>
  );
};

export default App;

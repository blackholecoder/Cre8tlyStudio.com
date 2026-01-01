import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Footer, Nav } from "../../sections";

export default function SiteLayout() {
  const location = useLocation();

  // Native scroll reset on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Nav />

      <main className="relative min-h-screen bg-white">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

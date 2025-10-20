import { useEffect, useState } from "react";
import { headerLogo } from "../assets/images";
import { Link } from "react-router-dom";
import { getVersion } from "@tauri-apps/api/app";

const Footer = () => {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    async function checkIfApp() {
      try {
        await getVersion();
        setIsApp(true);
      } catch {
        setIsApp(false);
      }
    }
    checkIfApp();
  }, []);

  return (
    <footer className="text-white py-8 px-6">
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/60">
        {/* Left: Logo + Branding */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-6">
          <a href="/" className="flex-shrink-0">
            <img
              src={headerLogo}
              alt="Cre8tly Studio Logo"
              width={50}
              height={50}
            />
          </a>
          <p>© {new Date().getFullYear()} Cre8tlyStudio</p>
        </div>

        {/* Right: Links */}
        <div className="flex flex-col items-center md:items-end gap-2 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>|</span>
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>

            {/* Hide these on app */}
            {!isApp && (
              <>
                <span>|</span>
                <Link
                  to="/cookie-policy"
                  className="hover:text-white transition-colors"
                >
                  Cookies
                </Link>
                <span>|</span>
                <Link
                  to="/refund-policy"
                  className="hover:text-white transition-colors"
                >
                  Refunds
                </Link>
              </>
            )}
          </div>

          <p className="text-xs text-white/40">
            Designed by{" "}
            {isApp ? (
              <span className="cursor-not-allowed">
                Alure Digital
              </span>
            ) : (
              <a
                href="https://aluredigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Alure Digital
              </a>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

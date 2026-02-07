import { headerLogo } from "../assets/images";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-white py-8 px-6">
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-black/60">
        {/* Left: Logo + Branding */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-6">
          <a href="/" className="flex-shrink-0">
            <img
              src={headerLogo}
              alt="The Messy Attic Logo"
              width={50}
              height={50}
            />
          </a>
          <p>
            © {new Date().getFullYear()} The Messy Attic. All rights reserved
          </p>
        </div>

        {/* Right: Links */}
        <div className="flex flex-col items-center md:items-end gap-2 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            <Link to="/terms" className="hover:text-black transition-colors">
              Terms
            </Link>
            <span>|</span>
            <Link
              to="/privacy-policy"
              className="hover:text-black transition-colors"
            >
              Privacy
            </Link>

            <span>|</span>
            <Link
              to="/cookie-policy"
              className="hover:text-black transition-colors"
            >
              Cookies
            </Link>
            <span>|</span>
            <Link
              to="/refund-policy"
              className="hover:text-black transition-colors"
            >
              Refunds
            </Link>
            <span>|</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

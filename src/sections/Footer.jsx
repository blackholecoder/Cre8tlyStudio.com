import { headerLogo } from "../assets/images";
import {
  socialMedia,
} from "../constants";

const Footer = () => {
  return (
    <footer className="bg-bioModal text-white py-8 px-6">
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/60">
        
        {/* Left side: Logo + Social */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-6">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img src={headerLogo} alt="Drama Music Logo" width={50} height={50} />
          </a>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socialMedia.map((icon) => (
              <a
                key={icon.alt}
                href={icon.href}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-blue transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={icon.src} alt={icon.alt} width={16} height={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Right side: © + Links */}
        <div className="flex flex-col items-center md:items-end gap-2 mt-6 md:mt-0">
          <p>© {new Date().getFullYear()} Drama Music</p>
          <div className="flex items-center gap-3">
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <span>|</span>
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
            <span>|</span>
            <a href="/cookie-policy" className="hover:text-white transition-colors">Cookies</a>
            <span>|</span>
            <a href="/refund-policy" className="hover:text-white transition-colors">Refunds</a>
          </div>
        </div>

      </div>
    </footer>
  );
};



export default Footer;

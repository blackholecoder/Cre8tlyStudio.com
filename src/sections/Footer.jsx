import { headerLogo } from "../assets/images";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/60">
        
        {/* Left side: Logo*/}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4 md:gap-6">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img src={headerLogo} alt="Cre8tly Studio Logo" width={50} height={50} />
          </a>

          {/* Company/Branding */}
          <div className="flex items-center gap-3">
             <p>© {new Date().getFullYear()} Cre8tlyStudio</p>
          </div>
          
        </div>

        {/* Right side: © + Links */}
        <div className="flex flex-col items-center md:items-end gap-2 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <span>|</span>
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
            <span>|</span>
            <a href="/cookie-policy" className="hover:text-white transition-colors">Cookies</a>
            <span>|</span>
            <a href="/refund-policy" className="hover:text-white transition-colors">Refunds</a>
          </div>
          <p className="text-xs text-white/40">
    Designed by <a href="https://aluredigital.com" className="hover:text-white transition-colors">Alure Digital</a>
  </p>
        </div>

      </div>
    </footer>
  );
};



export default Footer;

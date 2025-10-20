import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { navLinks } from "../constants";
import { headerLogo } from "../assets/images";
import { motion } from "framer-motion";
import { useAuth } from "../admin/AuthContext";
import { getVersion } from "@tauri-apps/api/app";
import { Cog, Home, User, LogOut, MessageCircleQuestionMarkIcon, Crown, Store, LayoutDashboard  } from "lucide-react";

const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isApp, setIsApp] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed"; // prevents iOS bounce scroll
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [isOpen]);

  if (["/dashboard", "/books", "/settings"].includes(location.pathname)) {
    return null;
  }

  const filteredNavLinks = navLinks.filter((link) => {
    // Hide "Pricing" on /signup
    if (link.label === "Pricing" && location.pathname !== "/home") {
      return false;
    }

    // Hide "Contact Us" on /contact page
    if (link.label === "Contact Us" && location.pathname === "/contact")
      return false;
    if (isApp && link.label === "Shop") return false;

    return true;
  });

  return (
    <div
      className={`bg-[#0b0f1a] ${
        isScrolled ? "bg-opacity-90" : "bg-opacity-0"
      } transition duration-300 ease-in-out fixed top-0 left-0 w-full z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between px-4 h-[72px]"
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" preventScrollReset={true}>
              <motion.img
                src={headerLogo}
                width={50}
                height={50}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 4.5, delay: 2 }}
              />
            </Link>
          </div>


<div
  className="hidden md:block relative"
  onMouseEnter={() => setIsOpen(true)}
  onMouseLeave={() => setIsOpen(false)}
>
  {/* Cog button */}
  <button
    type="button"
    className={`p-3 bg-muteGrey hover:bg-gray-800 text-white shadow-md transition
      ${isOpen ? "rounded-t-lg" : "rounded-lg"}`}
  >
    <Cog className="h-5 w-5 text-white" />
  </button>

  {/* Icon dropdown */}
  <div
    className={`absolute right-0 top-full flex flex-col items-center gap-2 
                 bg-muteGrey  shadow-xl
                py-2 px-1 mt-[-2px] z-50
                transition-all duration-150 ease-out rounded-b-lg 
                ${
                  isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
  >
    {/* Always visible — Home */}
    <button
      onClick={() => navigate("/home")}
      className="p-2 hover:bg-gray-800/60  transition"
      title="Home"
    >
      <Home className="h-5 w-5 text-gray-300 hover:text-white" />
    </button>

    {/* Logged-in vs Logged-out logic */}
    {user ? (
      <>
        {/* Help */}
        
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 hover:bg-gray-800/60  transition"
          title="Dashboard"
        >
          <LayoutDashboard className="h-5 w-5 text-gray-300 hover:text-white" />
        </button>
        <button
          onClick={() => navigate("/contact")}
          className="p-2 hover:bg-gray-800/60  transition"
          title="Help"
        >
          <MessageCircleQuestionMarkIcon className="h-5 w-5 text-gray-300 hover:text-white" />
        </button>

        {/* Logout (user only) */}
        <button
          onClick={() => logout()}
          className="p-2 hover:bg-gray-800/60  transition"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-gray-300 hover:text-white" />
        </button>
      </>
    ) : (
      <>
        {/* Not logged in — Show Login & Help */}
        

        <button
          onClick={() => navigate("/sign-up")}
          className="p-2 hover:bg-gray-800/60  transition"
          title="Sign Up"
        >
          <Crown className="h-5 w-5 text-gray-300 hover:text-white" />
        </button>
        <button
          onClick={() => navigate("/shop")}
          className="p-2 hover:bg-gray-800/60  transition"
          title="Shop"
        >
          <Store className="h-5 w-5 text-gray-300 hover:text-white" />
        </button>
        <button
          onClick={() => navigate("/login")}
          className="p-2 hover:bg-gray-800/60  transition"
          title="Login"
        >
          <User className="h-5 w-5 text-gray-300 hover:text-white" />
        </button>

        <button
          onClick={() => navigate("/contact")}
          className="p-2 hover:bg-gray-800/60  transition"
          title="Contact"
        >
          <MessageCircleQuestionMarkIcon className="h-5 w-5 text-gray-300 hover:text-white" />
        </button>
      </>
    )}
  </div>
</div>


          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none z-50 relative"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isOpen && window.innerWidth < 768}
        enter="transition duration-300 ease-out"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition duration-200 ease-in"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {(ref) => (
          <div
            ref={ref}
            className="md:hidden fixed top-0 left-0 w-full h-screen bg-bioModal z-40 flex flex-col items-center pt-24 space-y-4 lead-text"
          >
            {filteredNavLinks.map((item) => {
              if (
                user &&
                (item.label === "Sign Up" ||
                  item.label === "Pricing" ||
                  item.label === "How it works" ||
                  item.label === "Contact Us" ||
                  item.label === "Shop")
              )
                return null;

              if (item.label === "Login" && user) {
                return (
                  <Link
                    key="user-dashboard"
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="font-montserrat text-md text-white-400 hover:text-white transition-all"
                  >
                    {user.name?.split(" ")[0] || "User"}
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-montserrat text-md text-white-400 hover:text-white transition-all cursor-pointer"
                >
                  {item.label}
                </a>
              );
            })}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="font-montserrat text-md text-white-400 hover:text-white transition-all"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </Transition>
    </div>
  );
};

export default Nav;

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { navLinks } from "../constants";
import { headerLogo } from "../assets/images";
import { motion } from "framer-motion";
import { useAuth } from "../admin/AuthContext";
import { getVersion } from "@tauri-apps/api/app";

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
      className={`bg-[#0b0f1a] ${isScrolled ? "bg-opacity-90" : "bg-opacity-0"} transition duration-300 ease-in-out fixed top-0 left-0 w-full z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between px-4 h-[72px]">
          {/* Logo */}

          <div className="flex-shrink-0">
            <a href="/">
              <motion.img
                src={headerLogo}
                width={50}
                height={50}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 4.5, delay: 2 }}
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 list-none lead-text">
            {filteredNavLinks.map((item) => {
              // Hide "Sign Up" if user is logged in
              if (
                user &&
                (item.label === "Sign Up" ||
                  item.label === "Pricing" ||
                  item.label === "How it works" ||
                  item.label === "Contact Us" ||
                  item.label === "Shop")
              )
                return null;

              // If logged in, replace "Login" with first name and point to dashboard
              if (item.label === "Login" && user) {
                return (
                  <li
                    key="user-dashboard"
                    className="flex items-center space-x-6"
                  >
                    <Link
                      to="/dashboard"
                      className="font-montserrat leading-normal text-md text-white-400 hover:text-white transition"
                    >
                      {user.name?.split(" ")[0] || "User"}
                    </Link>
                    <button
                      onClick={logout}
                      className="font-montserrat leading-normal text-md text-white-400 hover:text-white transition"
                    >
                      Logout
                    </button>
                  </li>
                );
              }

              // Default case
              return (
                <li key={item.label} className="flex items-center">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault();
                        const targetSection = document.querySelector(item.href);

                        if (
                          location.pathname === "/" ||
                          location.pathname === "/home"
                        ) {
                          // already on home, just scroll
                          if (targetSection) {
                            targetSection.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        } else {
                          // not on home → navigate to home and include hash
                          navigate(`/home${item.href}`);
                        }
                      }
                    }}
                    className="font-montserrat leading-normal text-md text-white-400 hover:text-white cursor-pointer transition"
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

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
        show={isOpen}
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
              // Hide "Sign Up" if logged in
              if (
                user &&
                (item.label === "Sign Up" ||
                  item.label === "Pricing" ||
                  item.label === "How it works" ||
                  item.label === "Contact Us" ||
                  item.label === "Shop")
              )
                return null;

              // Replace "Login" with first name linking to dashboard
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

              // Default case
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

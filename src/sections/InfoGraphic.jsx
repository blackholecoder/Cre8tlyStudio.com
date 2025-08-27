import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { navLinks } from "../constants";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { headerLogo } from "../assets/images";
import { motion } from "framer-motion";

const InfoGraphic = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

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

  return (
    <div
      className={`bg-gray-900 ${isScrolled ? "bg-opacity-90" : "bg-opacity-0"} transition duration-300 ease-in-out fixed top-0 left-0 w-full z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
          <a href="/">
              <motion.img src={headerLogo} width={50} height={50} 
              initial={{ 
                opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                transition={{
                  duration: 4.5,
                  delay: 2
                }}
              />
            </a>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 max-lg:hidden"></div>
          {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-montserrat leading-normal text-md text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}



          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
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
          <div ref={ref} className="md:hidden bg-gray-900">
            <div className="flex flex-col items-center py-4 space-y-4"></div>

            {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-montserrat leading-normal text-md text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}




          </div>
        )}
      </Transition>
    </div>
  );
};

export default InfoGraphic;

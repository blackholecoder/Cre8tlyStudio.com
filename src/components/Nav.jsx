import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { navLinks } from "../constants";
import { headerLogo } from "../assets/images";
import { motion } from "framer-motion";
import { useAuth } from "../admin/AuthContext";

import {
  User,
  LayoutTemplate,
  BookOpen,
  Users,
  Sparkles,
  Mail,
  Workflow,
  CreditCard,
  BarChart3,
  Database,
} from "lucide-react";

const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const productsTriggerRef = useRef(null);
  const productsMenuRef = useRef(null);

  const [productsOpen, setProductsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (
        !productsMenuRef.current?.contains(e.target) &&
        !productsTriggerRef.current?.contains(e.target)
      ) {
        setProductsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  const MegaItem = ({ icon: Icon, title, desc, onClick, disabled }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick();
        setProductsOpen(false);
      }}
      className={`
      w-full flex items-start gap-3 mb-4 rounded-md p-2 text-left transition
      ${
        disabled
          ? "cursor-default opacity-40"
          : "hover:bg-gray-50 cursor-pointer"
      }
    `}
    >
      {/* Icon */}
      <div className={`mt-1 ${disabled ? "text-gray-400" : "text-gray-700"}`}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Text */}
      <div>
        <div
          className={`text-sm font-semibold ${
            disabled ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {title}
        </div>
        <div
          className={`text-xs leading-snug ${
            disabled ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {desc}
        </div>
      </div>
    </button>
  );

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

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

  const noNavRoutes = [
    "/dashboard",
    "/books",
    "/settings",
    "/prompts",
    "/notifications",
    "/canvas-editor",
    "/landing-page-builder",
    "/leads",
    "/landing-analytics",
    "/seller-dashboard",
    "/docs/pro-document",
    "/docs/lead-magnets",
    "/docs/smartprompt",
    "/docs/canvas-editor",
    "/docs/landing-page-builder",
    "/docs/analytics-docs",
    "/docs/analytics",
    "/docs/settings",
    "/docs",
  ];

  if (
    noNavRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/community")
  ) {
    return null;
  }

  const filteredNavLinks = navLinks.filter((link) => {
    // Hide "How It Works" on /signup
    if (link.label === "Home" && location.pathname === "/") {
      return false;
    }

    // Hide "Contact Us" on /contact page
    if (link.label === "Contact Us" && location.pathname === "/contact")
      return false;

    return true;
  });

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          onClick={(e) => e.stopPropagation()}
          className="flex justify-between md:grid md:grid-cols-3 items-center h-[72px]"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigateWithReferral("/")}
            >
              <motion.img
                src={headerLogo}
                width={50}
                height={50}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />

              {/* Text next to logo */}
              <span
                style={{ fontFamily: '"PT Serif", serif' }}
                className="ml-2 text-lg font-semibold text-black tracking-tight whitespace-nowrap"
              >
                Cre8tly Studio
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-gray-700">
            {/* PRODUCTS (MEGA MENU) */}
            <div className="relative">
              <button
                ref={productsTriggerRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setProductsOpen((v) => !v);
                }}
                className="flex items-center gap-1 text-[16.5px] md:text-[16.5px] lg:text-[16.5px] font-medium text-gray-800 hover:text-black"
              >
                Products
                <svg
                  className={`h-4 w-4 transition-transform ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* ===== MEGA MENU ===== */}
              <div
                ref={productsMenuRef}
                className={`fixed left-0 top-[72px] w-full pt-2
    bg-white border border-gray-200 shadow-2xl z-50
    transition-all duration-150 ease-out
    ${productsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              >
                <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10 p-12">
                  {/* BUILD & LAUNCH */}
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6 border-b pb-3">
                      Build & Launch
                    </h4>

                    <MegaItem
                      icon={LayoutTemplate}
                      title="Landing Pages"
                      desc="Build high converting pages"
                      onClick={() => navigateWithReferral("/landing")}
                    />

                    <MegaItem
                      icon={BookOpen}
                      title="Digital Products"
                      desc="Sell downloads and content"
                      onClick={() => navigateWithReferral("/smart-prompt")}
                    />

                    <MegaItem
                      icon={Users}
                      title="Communities"
                      desc="Create engaged audiences"
                      disabled
                      // onClick={() => navigateWithReferral("/community")}
                    />
                  </div>

                  {/* SCALE */}
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6 border-b pb-3">
                      Scale
                    </h4>

                    <MegaItem
                      icon={Sparkles}
                      title="Smart Prompts"
                      desc="AI powered content creation"
                      onClick={() => navigateWithReferral("/smart-prompt")}
                    />

                    <MegaItem
                      icon={Mail}
                      title="Email Marketing"
                      desc="Automated campaigns"
                      disabled
                      // onClick={() => navigateWithReferral("/leads")}
                    />

                    <MegaItem
                      icon={Workflow}
                      title="Funnels"
                      desc="Automations that convert"
                      disabled
                      // onClick={() =>
                      //   navigateWithReferral("/landing-page-builder")
                      // }
                    />
                  </div>

                  {/* EARN & MEASURE */}
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6 border-b pb-3">
                      Earn & Measure
                    </h4>

                    <MegaItem
                      icon={CreditCard}
                      title="Payments"
                      desc="Accept and track revenue"
                      disabled
                      // onClick={() => navigateWithReferral("/plans")}
                    />

                    <MegaItem
                      icon={BarChart3}
                      title="Analytics"
                      desc="Performance and insights"
                      disabled
                      // onClick={() => navigateWithReferral("/landing-analytics")}
                    />

                    <MegaItem
                      icon={Database}
                      title="CRM"
                      desc="Own your audience"
                      disabled
                      // onClick={() => navigateWithReferral("/leads")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* OTHER NAV ITEMS */}
            <button
              onClick={() => navigateWithReferral("/resources")}
              className="hover:text-black text-[16.5px] md:text-[16.5px] lg:text-[16.5px]"
            >
              Resources
            </button>

            <button
              onClick={() => navigateWithReferral("/plans")}
              className="hover:text-black text-[16.5px] md:text-[16.5px] lg:text-[16.5px]"
            >
              Pricing
            </button>
          </div>

          <div className="hidden md:flex items-center justify-end relative">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-[16.5px] md:text-[16.5px] lg:text-[16.5px] font-medium text-gray-700 hover:text-black px-5"
                >
                  Login
                </button>

                <button
                  onClick={() => navigateWithReferral("/plans")}
                  className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900 transition"
                >
                  Get Started for Free →
                </button>
              </>
            ) : (
              <div className="relative ml-4">
                {/* Trigger */}
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-black"
                >
                  <User className="h-4 w-4" />
                  Account
                  <svg
                    className={`h-4 w-4 transition-transform duration-150 ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {accountOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-44 rounded-lg border bg-white shadow-lg z-50"
                    onMouseLeave={() => setAccountOpen(false)}
                  >
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setAccountOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-50"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                        navigate("/login");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex justify-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black focus:outline-none z-50 relative"
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
              if (item.label === "Home" && location.pathname === "/")
                return null;

              if (
                user &&
                (item.label === "Sign Up" ||
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
                    Dashboard
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigateWithReferral(item.href);
                    setIsOpen(false);
                  }}
                  className="font-montserrat text-md text-white-400 hover:text-white transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              );
            })}

            {/* ✅ Add Plans link here */}
            {!user && (
              <button
                onClick={() => {
                  navigateWithReferral("/plans");
                  setIsOpen(false);
                }}
                className="font-montserrat text-md text-white-400 hover:text-white transition-all"
              >
                Plans
              </button>
            )}

            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate("/login");
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

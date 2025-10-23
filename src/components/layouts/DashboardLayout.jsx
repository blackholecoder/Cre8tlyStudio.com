import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";
import { headerLogo } from "../../assets/images";
import {
  Menu,
  X,
  BookOpen,
  Settings,
  LogOut,
  SquareTerminal,
  Package,
  DollarSign
} from "lucide-react";
import CustomCursor from "../CustomCursor";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ Auto-close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu = [
    {
      label: "Digital Products",
      path: "/dashboard",
      icon: <Package size={18} />,
    },
    { label: "Assistant", path: "/books", icon: <BookOpen size={18} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
    {
      label: "Prompt Memory",
      path: "/prompts",
      icon: <SquareTerminal size={18} />,
    },
    { label: "Plans", path: "/plans", icon: <DollarSign size={18} /> },

  ];

  return (
    <div className="flex min-h-screen bg-[#030712] text-white relative">
      <CustomCursor />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900/95 border-r border-gray-800 
             flex flex-col justify-between transform transition-transform duration-300 z-[60]
             ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full p-6">
          {/* Top Section */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src={headerLogo} alt="Cre8tly" className="w-8 h-8" />
                <h1 className="relative inline-block text-1xl font-bold text-white design-text">
                  Cre8tly Studio
                </h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* User */}
            {user && (
              <div className="mb-6 text-sm text-gray-400">
                Welcome,{" "}
                <span className="font-semibold text-white">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </div>
            )}

            {/* Nav */}
            <nav className="space-y-3">
              {menu.map((item) => {
                const active = location.pathname === item.path;
                const hasBrandFile =
                  user?.brand_identity_file && item.path === "/settings";

                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`relative w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                      ${
                        active
                          ? "bg-muteGrey text-white shadow-md"
                          : "bg-gray-800/40 hover:bg-gray-800 text-gray-300"
                      }`}
                  >
                    {item.icon}
                    {item.label}

                    {hasBrandFile && (
                      <>
                        <span className="absolute right-3 w-3 h-3 bg-green rounded-full opacity-75 animate-ping" />
                        <span className="absolute right-3 w-3 h-3 bg-green rounded-full shadow-[0_0_6px_3px_rgba(34,197,94,0.8)]" />
                      </>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full mt-8 text-sm font-semibold py-2 flex items-center justify-center gap-2 
                       bg-red-600 text-white hover:bg-red-700 transition rounded-md"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && window.innerWidth < 1024 && (
  <div
    onClick={() => setIsSidebarOpen(false)}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
  />
)}

      {/* Toggle button (mobile) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 bg-gray-800/80 p-2 rounded-lg text-gray-200 hover:text-white z-50 transition"
      >
        <Menu size={22} />
      </button>

      {/* Main content (scrolls independently) */}
      <main className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 lg:ml-64">
        {children}
      </main>
    </div>
  );
}

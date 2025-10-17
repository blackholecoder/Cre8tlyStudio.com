import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";
import { headerLogo } from "../../assets/images";
import {
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  Settings,
  LogOut,
  Magnet
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ Auto-close sidebar when window shrinks
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu = [
    { label: "Lead Magnets", path: "/dashboard", icon: <Magnet size={18} /> },
    { label: "Assistant", path: "/books", icon: <BookOpen size={18} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#030712] text-white relative">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen bg-gray-900/95 border-r border-gray-800 flex flex-col justify-between transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        }`}
      >
        {/* Content Wrapper */}
        <div className="flex flex-col justify-between h-full p-6">
          {/* Top Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src={headerLogo} alt="Cre8tly" className="w-8 h-8" />
                <h1 className="text-xl font-bold text-headerGreen">
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

            {/* ✅ User Name */}
            {user && (
              <div className="mb-6 text-sm text-gray-400">
                Welcome,{" "}
                <span className="font-semibold text-white">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </div>
            )}

            {/* Navigation */}
           <nav className="space-y-3">
  {menu.map((item) => {
    const active = location.pathname === item.path;
    const hasBrandFile = user?.brand_identity_file && item.path === "/settings";

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

        {/* ✅ Double-layer glowing dot */}
        {hasBrandFile && (
          <>
            {/* Outer pulsing ring */}
            <span className="absolute right-3 w-3 h-3 bg-green rounded-full opacity-75 animate-ping" />
            {/* Solid inner core */}
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
            className="w-full mt-8 text-sm font-semibold py-2 flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 transition rounded-md"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 bg-gray-800/80 p-2 rounded-lg text-gray-200 hover:text-white z-50 transition"
      >
        <Menu size={22} />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

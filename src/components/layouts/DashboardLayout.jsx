import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";
import { headerLogo } from "../../assets/images";
import api from "../../api/axios";
import {
  Menu,
  X,
  BookOpen,
  Settings,
  LogOut,
  SquareTerminal,
  Package,
  DollarSign,
  Inbox,
  Globe,
} from "lucide-react";
import CustomCursor from "../CustomCursor";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Auto-close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/admin/messages/count");
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user?.id]);

  const menu = [
    {
      label: "Digital Products",
      path: "/dashboard",
      icon: <Package size={22} />,
    },
    { label: "Assistant", path: "/books", icon: <BookOpen size={22} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={22} /> },
    {
      label: "Prompt Memory",
      path: "/prompts",
      icon: <SquareTerminal size={22} />,
    },
    {
      label: "Inbox",
      path: "/notifications",
      icon: <Inbox size={22} />,
    },
    { label: "Plans", path: "/plans", icon: <DollarSign size={22} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#030712] text-white relative">
      <CustomCursor />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-[120px] h-full bg-gray-900/95 border-r border-gray-800 
       flex flex-col justify-between transform transition-transform duration-300 z-[60]
       ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full p-6">
          {/* Top Section */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col items-center justify-center mt-6 mb-4">
                <img
                  src={headerLogo}
                  alt="Cre8tly"
                  className="w-16 h-16 mb-2"
                />
                <h1 className="text-sm font-semibold text-white text-center tracking-wide">
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

            <nav className="flex flex-col items-center gap-5 mt-8">
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
                    className="flex flex-col items-center justify-center space-y-2 focus:outline-none"
                  >
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all 
            ${
              active
                ? "bg-green/10 border-green text-green shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-green hover:text-green"
            }`}
                    >
                      {item.icon}

                      {/* 🔔 Unread badge */}
                      {item.path === "/notifications" && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-[18px] h-[18px] text-[10px] bg-red-600 text-white font-bold rounded-full shadow-md">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}

                      {/* 💚 Brand indicator */}
                      {hasBrandFile && (
                        <>
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green rounded-full opacity-75 animate-ping" />
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green rounded-full shadow-[0_0_6px_2px_rgba(34,197,94,0.8)]" />
                        </>
                      )}
                    </div>
                  </button>
                );
              })}

              {user?.pro_status === "active" && (
                <button
                  onClick={() => {
                    navigate("/landing-page-builder");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className="flex flex-col items-center justify-center space-y-2 focus:outline-none"
                >
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all 
        ${
          location.pathname === "/landing-page-builder"
            ? "bg-green/10 border-green text-green shadow-[0_0_12px_rgba(34,197,94,0.4)]"
            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-green hover:text-green"
        }`}
                  >
                    <Globe size={22} />
                    <span className="absolute -bottom-5 text-[10px] text-gray-400 whitespace-nowrap">
                      Builder
                    </span>
                  </div>
                </button>
              )}
            </nav>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="relative flex items-center justify-center w-12 h-12 mx-auto mb-6 rounded-xl 
             bg-red-600/20 border border-red-600/40 text-red-500 hover:text-white hover:bg-red-600/40 
             hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all"
            title="Logout"
          >
            <LogOut size={20} />
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
      <main className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 lg:ml-[120px]">
        {children}
      </main>
    </div>
  );
}

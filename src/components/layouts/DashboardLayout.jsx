import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";
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
  Users,
  BarChart2,
  Banknote,
  MessageSquare,
  Bell,
} from "lucide-react";
import CustomCursor from "../CustomCursor";
import AnimatedLogo from "../animation/AnimatedLogo";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);

  const isFreeTier = user?.has_free_magnet === 1 && user?.magnet_slots === 1;

  // ✅ Auto-close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1280);
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

  // ⭐ Fetch unread community notifications
  useEffect(() => {
    if (!user?.id) return;

    const fetchCommunityCount = async () => {
      try {
        const res = await api.get("/notifications/count");
        setCommunityCount(res.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch community notifications:", err);
      }
    };

    fetchCommunityCount();

    const interval = setInterval(fetchCommunityCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user?.id]);

  let menu = [
    {
      label: "Digital Products",
      path: "/dashboard",
      icon: <Package size={22} />,
    },
    { label: "Assistant", path: "/books", icon: <BookOpen size={22} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={22} /> },
    {
      label: "Community",
      path: "/community",
      icon: <MessageSquare size={22} />,
    },
    {
  label: "Alerts",
  path: "/community-alerts",
  icon: <Bell size={22} />,
},
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

  if (isFreeTier) {
    menu = menu.filter(
      (item) => item.label !== "Prompt Memory" && item.label !== "Assistant"
    );
  }

  return (
    <div className="flex bg-[#030712] text-white relative min-h-full">
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
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative flex items-center justify-center w-16 h-16 mb-3 overflow-visible">
                  {/* Soft outer glow (contained, doesn’t push text) */}
                  <div className="absolute w-[90%] h-[90%] rounded-full bg-green-400/25 blur-lg animate-pulse"></div>

                  {/* Logo itself */}
                  <AnimatedLogo className="relative z-10 w-16 h-16 animate-glow" />
                </div>

                <h1 className="text-[13px] font-semibold text-white text-center leading-snug mt-1">
                  Cre8tly
                  <br />
                  Studio
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

                      {/* 🟢 Community unread badge */}
                      {item.path === "/community" && communityCount > 0 && (
                        <span
                          className="absolute -top-1 -right-1 flex items-center justify-center 
                     w-[18px] h-[18px] text-[10px] bg-green-600 text-white font-bold 
                     rounded-full shadow-md"
                        >
                          {communityCount > 9 ? "9+" : communityCount}
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
                  </div>
                </button>
              )}
              {user?.pro_status === "active" && (
                <button
                  onClick={() => {
                    navigate("/leads");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className="flex flex-col items-center justify-center space-y-2 focus:outline-none"
                >
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all 
      ${
        location.pathname === "/leads"
          ? "bg-green/10 border-green text-green shadow-[0_0_12px_rgba(34,197,94,0.4)]"
          : "bg-gray-800/50 border-gray-700 text-gray-300  hover:border-green hover:text-green"
      }`}
                  >
                    <Users size={22} />
                  </div>
                </button>
              )}

              {user?.pro_status === "active" && (
                <button
                  onClick={() => {
                    navigate("/landing-analytics");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className="flex flex-col items-center justify-center space-y-2 focus:outline-none"
                >
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all 
        ${
          location.pathname === "/landing-analytics"
            ? "bg-green/10 border-green text-green shadow-[0_0_12px_rgba(34,197,94,0.4)]"
            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-green hover:text-green"
        }`}
                  >
                    <BarChart2 size={22} />{" "}
                    {/* import this from lucide-react */}
                  </div>
                </button>
              )}

              {user?.stripe_connect_account_id && (
                <button
                  onClick={() => {
                    navigate("/seller-dashboard");
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className="flex flex-col items-center justify-center space-y-2 focus:outline-none"
                >
                  <div
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl border transition-all 
        ${
          location.pathname === "/seller-dashboard"
            ? "bg-green/10 border-green text-green shadow-[0_0_12px_rgba(34,197,94,0.4)]"
            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-green hover:text-green"
        }`}
                  >
                    <Banknote size={22} />
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
      <main className="flex-1 min-h-screen overflow-y-auto transition-all duration-300 lg:ml-[120px]  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {children}
      </main>
    </div>
  );
}

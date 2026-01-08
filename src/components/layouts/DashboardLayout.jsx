import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";
import axiosInstance from "../../api/axios";
import { Menu, LogOut } from "lucide-react";
import AnimatedLogo from "../animation/AnimatedLogo";
import {
  SIDEBAR_SECTIONS,
  SidebarToggleIcon,
} from "../../constants/sideBarSections";

const SIDEBAR_COLLAPSE_KEY = "cre8tly_sidebar_collapsed";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const SIDEBAR_EXPANDED_WIDTH = 260;
  const SIDEBAR_COLLAPSED_WIDTH = 72;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
    } catch {
      return false;
    }
  });

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
        const res = await axiosInstance.get("/messages/user/count");
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
        const res = await axiosInstance.get("/notifications/count");
        setCommunityCount(res.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch community notifications:", err);
      }
    };

    fetchCommunityCount();

    const interval = setInterval(fetchCommunityCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(isCollapsed));
    } catch {
      // ignore write failures
    }
  }, [isCollapsed]);

  function hasAccess(item) {
    if (item.access === "pro" && isFreeTier) return false;
    if (item.access === "seller" && !user?.stripe_connect_account_id)
      return false;
    return true;
  }

  function renderSidebarItem(item) {
    const active = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <button
        key={item.key}
        onClick={() => {
          navigate(item.path);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center rounded-lg transition
  ${isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3 text-left"}
  ${
    active
      ? isCollapsed
        ? "bg-green/20 text-green"
        : "bg-green/10 text-green border border-green/30"
      : "text-gray-300 hover:bg-gray-800/60"
  }`}
      >
        <Icon size={20} />

        {!isCollapsed && (
          <div className="flex flex-col flex-1">
            <span className="font-medium leading-tight">{item.label}</span>
            <span className="text-xs text-gray-400">{item.description}</span>
          </div>
        )}

        {item.badge === "unreadCount" && unreadCount > 0 && (
          <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}

        {item.badge === "communityCount" && communityCount > 0 && (
          <span className="ml-auto bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {communityCount > 9 ? "9+" : communityCount}
          </span>
        )}

        {item.indicator === "brandConfigured" && user?.brand_identity_file && (
          <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div className="dashboard flex bg-[#030712] text-white relative min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full overflow-hidden bg-gray-900/95 border-r border-gray-800 
  flex flex-col transform transition-all duration-300 z-[60]
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{
          width: isCollapsed
            ? `${SIDEBAR_COLLAPSED_WIDTH}px`
            : `${SIDEBAR_EXPANDED_WIDTH}px`,
        }}
      >
        {/* TOP (fixed) */}
        <div className="p-4 border-b border-gray-800">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-start gap-3"
            }`}
          >
            {/* Menu toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-9 h-9 flex items-center justify-center rounded-md 
                 text-gray-400 hover:text-white hover:bg-gray-800 transition"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <SidebarToggleIcon size={18} />
            </button>

            {/* Logo (removed entirely when collapsed) */}
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute w-[90%] h-[90%] rounded-full bg-green-400/25 blur-lg animate-pulse" />
                  <AnimatedLogo className="relative z-10 w-10 h-10 animate-glow" />
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="logoText font-semibold text-white">
                    Cre8tly
                  </span>
                  <span className="logoText text-sm text-gray-300">Studio</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE (SCROLL AREA) */}
        <nav
          className={`flex-1 overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent ${
            isCollapsed ? "px-2" : "px-6"
          }`}
        >
          <div className="flex flex-col gap-5 mt-2">
            {SIDEBAR_SECTIONS.map((section) => (
              <div key={section.section}>
                {!isCollapsed && (
                  <p className="px-4 mb-2 text-xs uppercase tracking-wide text-gray-500">
                    {section.section}
                  </p>
                )}

                <div className="flex flex-col gap-1">
                  {section.items.filter(hasAccess).map(renderSidebarItem)}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* BOTTOM (fixed logout) */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className={`w-full flex items-center rounded-lg transition ${
              isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
            } text-red-500 hover:bg-red-600/10`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
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

      {/* Main content */}
      <main
        className="flex-1 min-h-screen overflow-y-auto transition-all duration-300"
        style={{
          marginLeft:
            window.innerWidth >= 1280
              ? isCollapsed
                ? `${SIDEBAR_COLLAPSED_WIDTH}px`
                : `${SIDEBAR_EXPANDED_WIDTH}px`
              : "0px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

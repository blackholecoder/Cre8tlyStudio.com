import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";
import axiosInstance from "../../api/axios";
import {
  Menu,
  LogOut,
  CircleQuestionMark,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import AnimatedLogo from "../animation/AnimatedLogo";
import {
  SIDEBAR_SECTIONS,
  SidebarToggleIcon,
} from "../../constants/sideBarSections";
import { defaultImage } from "../../assets/images";
import UpgradeRequiredModal from "../modals/UpgradeRequiredModal";

const SIDEBAR_COLLAPSE_KEY = "cre8tly_sidebar_collapsed";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateTheme } = useAuth();

  const SIDEBAR_EXPANDED_WIDTH = 260;
  const SIDEBAR_COLLAPSED_WIDTH = 72;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [communityOpen, setCommunityOpen] = useState(false);

  const isCommunityOnly =
    user?.is_member === 1 && !user?.plan && !user?.free_trial_expires_at;

  const isFreeTier = user?.has_free_magnet === 1 && user?.magnet_slots === 1;

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

  useEffect(() => {
    if (location.pathname.startsWith("/community")) {
      setCommunityOpen(true);
    }
  }, [location.pathname]);

  function hasAccess(item) {
    if (item.access === "pro" && isFreeTier) return false;
    if (item.access === "seller" && !user?.stripe_connect_account_id)
      return false;
    return true;
  }

  function renderSidebarItem(item) {
    const active = location.pathname === item.path;
    const Icon = item.icon || null;

    const locked = isCommunityOnly && !item.allowCommunity;
    const isSubItem = item.isSubItem;
    const isParent = item.isParent;

    return (
      <button
        key={item.key}
        onClick={() => {
          if (isParent) {
            setCommunityOpen((prev) => !prev);
            return;
          }

          if (locked) {
            setShowUpgradeModal(true);
            return;
          }

          navigate(item.path);

          // only close sidebar on mobile if NOT a sub-item
          if (window.innerWidth < 1024 && !isSubItem) {
            setIsSidebarOpen(false);
          }
        }}
        className={`w-full flex items-center rounded-lg transition
${
  isCollapsed
    ? "justify-center px-3 py-3"
    : `gap-3 px-4 py-3 text-left ${isSubItem ? "pl-10 text-sm opacity-80" : ""}`
}
${
  active
    ? isCollapsed
      ? "bg-green/20 text-green"
      : "bg-green/10 text-green border border-green/30"
    : "text-dashboard-muted-light dark:text-dashboard-muted-dark hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
}
${locked ? "opacity-50 cursor-pointer" : ""}
`}
      >
        {Icon && <Icon size={18} />}

        {!isCollapsed && (
          <div className="flex items-center flex-1">
            <div className="flex flex-col">
              <span className="font-medium leading-tight">{item.label}</span>
              <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                {item.description}
              </span>
            </div>

            {item.isParent && (
              <ChevronDown
                size={16}
                className={`ml-auto transition-transform ${
                  communityOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        )}

        {item.badge === "unreadCount" && unreadCount > 0 && (
          <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}

        {item.badge === "communityCount" && communityCount > 0 && (
          <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
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
    <div
      className="dashboard flex relative min-h-screen
  bg-dashboard-bg-light
  dark:bg-dashboard-bg-dark
  text-dashboard-text-light
  dark:text-dashboard-text-dark"
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full overflow-hidden
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border-r border-dashboard-border-light dark:border-dashboard-border-dark
        flex flex-col transform transition-all duration-300 z-[60]
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{
          width: isCollapsed
            ? `${SIDEBAR_COLLAPSED_WIDTH}px`
            : `${SIDEBAR_EXPANDED_WIDTH}px`,
        }}
      >
        {/* TOP (fixed) */}
        <div className="p-4 border-b border-dashboard-border-light dark:border-dashboard-border-dark">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-start gap-3"
            }`}
          >
            {/* Menu toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-9 h-9 flex items-center justify-center rounded-md transition
            text-dashboard-muted-light dark:text-dashboard-muted-dark
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
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
                  <span className="logoText font-semibold text-dashboard-text-light dark:text-dashboard-text-dark">
                    Cre8tly
                  </span>
                  <span className="logoText text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    Studio
                  </span>
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
                  <p
                    className="px-4 mb-2 text-xs uppercase tracking-wide
text-dashboard-muted-light dark:text-dashboard-muted-dark"
                  >
                    {section.section}
                  </p>
                )}

                <div className="flex flex-col gap-1">
                  {section.items
                    .filter(hasAccess)
                    .filter((item) => {
                      if (item.isSubItem && !communityOpen) return false;
                      return true;
                    })
                    .map(renderSidebarItem)}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* BOTTOM (fixed logout) */}
        <div className="p-4 border-t border-dashboard-border-light dark:border-dashboard-border-dark space-y-3">
          <button
            onClick={() => navigate("/docs")}
            className={`w-full flex items-center rounded-lg transition ${
              isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
            } text-dashboard-muted-light dark:text-dashboard-muted-dark hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark`}
          >
            <CircleQuestionMark size={20} />
            {!isCollapsed && <span className="font-medium">Documentation</span>}
          </button>
          {/* Profile Avatar */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-3 px-2"
            }`}
          >
            <img
              src={user?.profile_image || defaultImage}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-dashboard-border-light dark:border-dashboard-border-dark"
            />
            {!isCollapsed && (
              <span className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark truncate">
                {user?.name || "Account"}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              updateTheme(user?.theme === "dark" ? "light" : "dark")
            }
            className={`
    w-full flex items-center rounded-lg transition
    ${isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"}
    text-dashboard-muted-light dark:text-dashboard-muted-dark
    hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
  `}
          >
            {user?.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}

            {!isCollapsed && (
              <span className="font-medium">
                {user?.theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={`w-full flex items-center rounded-lg transition ${
              isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
            } text-red-500 hover:bg-red-600/10`}
          >
            <LogOut size={20} />
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
        className="lg:hidden fixed top-4 right-4 p-2 rounded-lg z-50 transition bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark text-dashboard-muted-light dark:text-dashboard-muted-dark"
      >
        <Menu size={22} />
      </button>

      {/* Main content */}
      <main
        className="flex-1 min-h-screen overflow-y-auto transition-all duration-300"
        style={{
          marginLeft:
            window.innerWidth >= 1024
              ? isCollapsed
                ? `${SIDEBAR_COLLAPSED_WIDTH}px`
                : `${SIDEBAR_EXPANDED_WIDTH}px`
              : "0px",
        }}
      >
        {children}
      </main>
      <UpgradeRequiredModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}

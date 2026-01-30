import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";
import axiosInstance from "../../api/axios";
import { Menu, LogOut, Sun, Moon, ChevronDown, X } from "lucide-react";

import {
  SIDEBAR_SECTIONS,
  SidebarToggleIcon,
} from "../../constants/sideBarSections";
import { defaultImage, headerLogo } from "../../assets/images";
import UpgradeRequiredModal from "../modals/UpgradeRequiredModal";

const SIDEBAR_COLLAPSE_KEY = "cre8tly_sidebar_collapsed";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateTheme } = useAuth();

  const SIDEBAR_EXPANDED_WIDTH = 260;
  const SIDEBAR_COLLAPSED_WIDTH = 72;

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

  const [communityOpen, setCommunityOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("communityOpen") === "true";
  });

  const isFreeTier = user?.has_free_magnet === 1 && user?.magnet_slots === 1;

  const hasActiveAuthorsAssistant =
    Boolean(user?.authors_assistant_override) ||
    (user?.subscription_status === "active" && user?.has_book === 1);

  const isCommunityOnly =
    user?.is_member === 1 &&
    !hasActiveAuthorsAssistant &&
    !user?.free_trial_expires_at;

  const isDesktop = useIsDesktop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem("communityOpen", String(communityOpen));
    }
  }, [communityOpen, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      setCommunityOpen(false);
    }
  }, [location.pathname, isDesktop]);

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
    if (item.access === "books") {
      return hasActiveAuthorsAssistant;
    }

    if (item.access === "pro" && isFreeTier) return false;
    if (item.access === "seller" && !user?.stripe_connect_account_id)
      return false;
    return true;
  }

  function renderSidebarItem(item) {
    const active = location.pathname === item.path;
    const Icon = item.icon || null;

    const locked =
      isCommunityOnly && !hasActiveAuthorsAssistant && !item.allowCommunity;
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
      className="dashboard relative min-h-screen 
  bg-dashboard-bg-light
  dark:bg-dashboard-bg-dark
  text-dashboard-text-light
  dark:text-dashboard-text-dark"
    >
      {/* Sidebar */}
      {isDesktop && (
        <aside
          className={`fixed top-0 left-0 h-full overflow-hidden
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border-r border-dashboard-border-light dark:border-dashboard-border-dark
        flex flex-col transform transition-all duration-300 z-[60]
       lg:translate-x-0`}
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
                    <img
                      src={headerLogo}
                      alt="The Messy Attic"
                      className="h-12 w-12 object-contain"
                    />
                  </div>

                  <div className="flex flex-col leading-tight">
                    <span className="logoText text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark.  ">
                      The Messy
                    </span>
                    <span className="logoText text-dashboard-text-light dark:text-dashboard-text-dark">
                      Attic
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
      )}

      {!isDesktop && (
        <div className="sticky top-0 z-30 bg-dashboard-bg-light dark:bg-dashboard-bg-dark ">
          <div className="flex justify-end p-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      )}
      {!isDesktop && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-dashboard-bg-light dark:bg-dashboard-bg-dark overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Menu items */}
            {SIDEBAR_SECTIONS.map((section) => (
              <div
                key={section.section}
                className="space-y-3 pb-4 border-b border-dashboard-border-light dark:border-dashboard-border-dark"
              >
                <p className="text-xs uppercase text-dashboard-muted-light dark:text-dashboard-muted-dark">
                  {section.section}
                </p>

                {section.items
                  .filter(hasAccess)
                  .filter((item) => !item.isSubItem || communityOpen)
                  .map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (item.isParent) {
                          setCommunityOpen((v) => !v);
                          return;
                        }

                        if (isCommunityOnly && !item.allowCommunity) {
                          setShowUpgradeModal(true);
                          return;
                        }

                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                      w-full
                      px-4 py-4
                      rounded-xl
                      text-left
                      text-dashboard-text-light dark:text-dashboard-text-dark
                      flex
                      border
                      transition
                      shadow-sm
                      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                      border-dashboard-border-light dark:border-dashboard-border-dark
                      hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
                      active:scale-[0.98]
                      ${item.isSubItem ? "opacity-90" : ""}
                    `}
                    >
                      <div className="flex items-center w-full gap-3">
                        {item.isSubItem && (
                          <span className="w-1 h-6 rounded-full bg-green/40" />
                        )}

                        {item.icon && (
                          <item.icon
                            size={18}
                            className="text-dashboard-muted-light dark:text-dashboard-muted-dark"
                          />
                        )}

                        <span
                          className={`font-medium ${item.isSubItem ? "text-sm opacity-90" : ""}`}
                        >
                          {item.label}
                        </span>

                        {/* BADGES */}
                        {item.badge === "unreadCount" && unreadCount > 0 && (
                          <span className="ml-auto mr-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}

                        {item.badge === "communityCount" &&
                          communityCount > 0 && (
                            <span className="ml-auto mr-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {communityCount > 9 ? "9+" : communityCount}
                            </span>
                          )}

                        {item.isParent && (
                          <ChevronDown
                            size={18}
                            className={`ml-auto transition-transform ${
                              communityOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            ))}
            {/* MOBILE FOOTER */}
            <div className="pt-4 mt-4 border-t border-dashboard-border-light dark:border-dashboard-border-dark space-y-3">
              {/* Profile */}
              <div className="flex items-center gap-3 px-2">
                <img
                  src={user?.profile_image || defaultImage}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border border-dashboard-border-light dark:border-dashboard-border-dark"
                />
                <span className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark truncate">
                  {user?.name || "Account"}
                </span>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => {
                  updateTheme(user?.theme === "dark" ? "light" : "dark");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
      text-dashboard-muted-light dark:text-dashboard-muted-dark
      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light dark:border-dashboard-border-dark
      hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
      transition"
              >
                {user?.theme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
                <span className="font-medium">
                  {user?.theme === "dark" ? "Light mode" : "Dark mode"}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-red-500
                bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light dark:border-dashboard-border-dark
                hover:bg-red-600/10
                transition"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className={`
    flex-1
    ${isDesktop ? (isCollapsed ? "ml-[72px]" : "ml-[260px]") : ""}
    px-4 pb-24
  `}
      >
        {/* Page content */}
        {children}
      </main>

      <UpgradeRequiredModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}

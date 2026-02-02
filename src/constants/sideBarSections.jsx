import {
  BookOpen,
  Settings,
  SquareTerminal,
  Package,
  Inbox,
  BarChart2,
  MessagesSquare,
  MailSearch,
  Landmark,
  LayoutTemplate,
  FileText,
  Mail,
  Cog,
  User,
  Home,
  BellRing,
  MailCheck,
  CircleQuestionMark,
  Bookmark,
} from "lucide-react";

export const SIDEBAR_SECTIONS = [
  {
    section: "Community",
    items: [
      {
        key: "community",
        label: "Community",
        icon: MessagesSquare,
        badge: "communityCount",
        isParent: true,
      },
      {
        key: "community-topics",
        label: "Home",
        path: "/community",
        icon: Home,
        allowCommunity: true,
        isSubItem: true,
      },
      {
        key: "posts",
        label: "My Posts",
        path: "/community/posts",
        icon: FileText,
        allowCommunity: true,
        isSubItem: true,
      },
      {
        key: "saved",
        label: "Saved",
        path: "/community/bookmarks",
        icon: Bookmark,
        allowCommunity: true,
        isSubItem: true,
      },
      {
        key: "notifications",
        label: "Notifications",
        path: "/community-alerts",
        icon: BellRing,
        badge: "communityCount",
        allowCommunity: true,
        isSubItem: true,
      },
      {
        key: "subscriptions",
        label: "Subscriptions",
        path: "/community/subscriptions",
        icon: Mail,
        allowCommunity: true,
        isSubItem: true,
      },
      {
        key: "profile",
        label: "Profile",
        path: "/community/profile",
        icon: User,
        allowCommunity: true,
        isSubItem: true,
      },
      {
        key: "profile-settings",
        label: "Profile Settings",
        path: "/community/settings",
        icon: Cog,
        allowCommunity: true,
        isSubItem: true,
      },
      {
        key: "subscriber-templates",
        label: "Email Templates",
        path: "/community/email-templates",
        icon: MailCheck,
        allowCommunity: true,
        isSubItem: true,
      },
    ],
  },
  {
    section: "Tools",
    items: [
      {
        key: "assistant",
        label: "Assistant",
        path: "/books",
        icon: BookOpen,
        access: "books",
      },
      {
        key: "dashboard",
        label: "Digital Products",
        path: "/dashboard",
        icon: Package,
        access: "all",
      },

      {
        key: "prompts",
        label: "Prompt Memory",
        path: "/prompts",
        icon: SquareTerminal,
        access: "pro",
      },
    ],
  },

  {
    section: "Growth",
    access: "pro",
    items: [
      {
        key: "landing",
        label: "Landing Pages",
        path: "/landing-page-builder",
        icon: LayoutTemplate,
        access: "pro",
      },
      {
        key: "leads",
        label: "Leads",
        path: "/leads",
        icon: MailSearch,
        access: "pro",
      },
      {
        key: "analytics",
        label: "Analytics",
        path: "/landing-analytics",
        icon: BarChart2,
        access: "pro",
      },
      {
        key: "seller",
        label: "Seller Dashboard",
        path: "/seller-dashboard",
        icon: Landmark,
        access: "seller",
      },
    ],
  },

  {
    section: "Account",
    items: [
      {
        key: "inbox",
        label: "Inbox",
        path: "/notifications",
        icon: Inbox,
        badge: "unreadCount",
        allowCommunity: true,
      },
      {
        key: "settings",
        label: "Settings",
        path: "/settings",
        icon: Settings,
        indicator: "brandConfigured",
        allowCommunity: true,
      },

      {
        key: "docs",
        label: "Help",
        path: "/docs",
        icon: CircleQuestionMark,
        allowCommunity: true,
      },
    ],
  },
];

export function SidebarToggleIcon({ size = 18, stroke = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="4" width="14" height="2" rx="1" fill={stroke} />
      <rect x="3" y="9" width="10" height="2" rx="1" fill={stroke} />
      <rect x="3" y="14" width="12" height="2" rx="1" fill={stroke} />
    </svg>
  );
}

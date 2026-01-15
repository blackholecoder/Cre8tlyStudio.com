import {
  BookOpen,
  Settings,
  SquareTerminal,
  Package,
  DollarSign,
  Inbox,
  BarChart2,
  MessageSquare,
  Bell,
  MailSearch,
  Landmark,
  LayoutTemplate,
} from "lucide-react";

export const SIDEBAR_SECTIONS = [
  {
    section: "Core",
    items: [
      {
        key: "dashboard",
        label: "Digital Products",
        path: "/dashboard",
        icon: Package,
        access: "all",
      },
      {
        key: "assistant",
        label: "Assistant",
        path: "/books",
        icon: BookOpen,
        access: "pro",
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
    section: "Community",
    items: [
      {
        key: "community",
        label: "Community",
        path: "/community",
        icon: MessageSquare,
        badge: "communityCount",
      },
      {
        key: "alerts",
        label: "Alerts",
        path: "/community-alerts",
        icon: Bell,
      },
      {
        key: "inbox",
        label: "Inbox",
        path: "/notifications",
        icon: Inbox,
        badge: "unreadCount",
      },
    ],
  },

  {
    section: "Account",
    items: [
      {
        key: "settings",
        label: "Settings",
        path: "/settings",
        icon: Settings,
        indicator: "brandConfigured",
      },
      {
        key: "plans",
        label: "Plans",
        path: "/plans",
        icon: DollarSign,
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

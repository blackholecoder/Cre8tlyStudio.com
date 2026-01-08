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
  CircleQuestionMark,
  LayoutTemplate,
} from "lucide-react";

export const SIDEBAR_SECTIONS = [
  {
    section: "Core",
    items: [
      {
        key: "dashboard",
        label: "Digital Products",
        description: "Create and manage PDFs and assets",
        path: "/dashboard",
        icon: Package,
        access: "all",
      },
      {
        key: "assistant",
        label: "Assistant",
        description: "Generate content with AI",
        path: "/books",
        icon: BookOpen,
        access: "pro",
      },
      {
        key: "prompts",
        label: "Prompt Memory",
        description: "Save and reuse prompts",
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
        description: "Build high converting pages",
        path: "/landing-page-builder",
        icon: LayoutTemplate,
        access: "pro",
      },
      {
        key: "leads",
        label: "Leads",
        description: "Capture and manage email leads",
        path: "/leads",
        icon: MailSearch,
        access: "pro",
      },
      {
        key: "analytics",
        label: "Analytics",
        description: "Track views and conversions",
        path: "/landing-analytics",
        icon: BarChart2,
        access: "pro",
      },
      {
        key: "seller",
        label: "Seller Dashboard",
        description: "Sales, payouts, and performance",
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
        description: "Connect with builders",
        path: "/community",
        icon: MessageSquare,
        badge: "communityCount",
      },
      {
        key: "alerts",
        label: "Alerts",
        description: "Community notifications",
        path: "/community-alerts",
        icon: Bell,
      },
      {
        key: "inbox",
        label: "Inbox",
        description: "Messages and replies",
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
        description: "Brand and preferences",
        path: "/settings",
        icon: Settings,
        indicator: "brandConfigured",
      },
      {
        key: "plans",
        label: "Plans",
        description: "Billing and upgrades",
        path: "/plans",
        icon: DollarSign,
      },
      {
        key: "docs",
        label: "Documentation",
        description: "Guides and help articles",
        path: "/docs",
        icon: CircleQuestionMark,
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

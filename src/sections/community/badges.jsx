import { PenLine, HandHeart, Ear, Sparkles } from "lucide-react";

export const BADGE_DEFS = {
  helpful: {
    label: "Helpful Creator",
    icon: HandHeart,
    color: "text-green",
    bg: "bg-green/10",
  },

  great_listener: {
    label: "Great Listener",
    icon: Ear,
    color: "text-blue",
    bg: "bg-blue/10",
  },

  posted_regularly: {
    label: "Posted Regularly",
    icon: PenLine,
    color: "text-royalPurple",
    bg: "bg-royalPurple/10",
  },

  quality_content: {
    label: "Quality Content",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
};

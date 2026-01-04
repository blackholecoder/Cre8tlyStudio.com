// src/components/AddSectionButton.jsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../../admin/AuthContext";
import { PRO_ONLY_BLOCKS } from "../../sections/landing/landingBlocksRules";
import { toast } from "react-toastify";
import { BLOCK_PILL_STYLES } from "../../constants";

export default function AddSectionButton({ addBlock, canAddBlock }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  const isPro =
    user?.plan === "business_builder_pack" && user?.pro_status === "active";

  const isDisabled = (value) => {
    return typeof canAddBlock === "function" && !canAddBlock(value);
  };

  const isProLocked = (value) => {
    return PRO_ONLY_BLOCKS.includes(value) && !isPro;
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".add-section-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    if (showDropdown) {
      // Lock background scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll
      document.body.style.overflow = "";
    }

    // Cleanup in case component unmounts while open
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDropdown]);

  const options = [
    { label: "Section Container", value: "container" },
    { label: "Divider", value: "divider" },
    { label: "Heading (H1)", value: "heading" },
    { label: "Subheading (H2)", value: "subheading" },
    { label: "Sub-Subheading (H3)", value: "subsubheading" },
    { label: "List Heading", value: "list_heading" },
    { label: "Paragraph", value: "paragraph" },
    { label: "FAQ", value: "faq" },
    { label: "Video", value: "video" },
    { label: "Audio Player", value: "audio_player" },
    { label: "Pro Image", value: "image" },
    { label: "Profile Card", value: "profile_card" },
    { label: "Single Offer", value: "single_offer" },
    { label: "Scroll Arrow", value: "scroll_arrow" },
    { label: "Mini Offer", value: "mini_offer" },
    { label: "Verified Reviews", value: "verified_reviews" },
    { label: "Stripe Checkout", value: "stripe_checkout" },
    { label: "Offer Banner", value: "offer_banner" },
    { label: "Secure Checkout", value: "secure_checkout" },
    { label: "Button Url", value: "button_url" },
    { label: "Social Links Row", value: "social_links" },
    { label: "Countdown Timer", value: "countdown" },
    { label: "Calendly", value: "calendly" },
  ];

  if (user?.is_admin_employee === 1) {
    options.push({ label: "Referral Button", value: "referral_button" });
  }

  return (
    <div className="add-section-dropdown relative inline-block text-left">
      {/* Compact floating button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev) => !prev);
        }}
        className="p-3 rounded-full bg-blue text-white shadow-lg hover:bg-green hover:text-black 
                   transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green"
        title="Add Section"
      >
        <Plus size={22} />
      </button>

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-64 sm:w-56 bg-[#0F172A] border border-gray-700 rounded-xl shadow-xl overflow-y-auto max-h-[60vh] sm:max-h-[480px] pb-2 z-50">
          {options.map((opt) => {
            const blockLimitReached = isDisabled(opt.value);
            const proLocked = isProLocked(opt.value);

            return (
              <button
                key={opt.value}
                type="button"
                disabled={blockLimitReached}
                onClick={(e) => {
                  e.stopPropagation();

                  if (proLocked) {
                    toast.error(
                      "This is a Pro feature. Upgrade to Pro to unlock it."
                    );
                    return;
                  }

                  if (blockLimitReached) return;

                  addBlock(opt.value);
                  setShowDropdown(false);
                }}
                className={`block w-full text-left px-5 py-3 transition-all
  ${
    blockLimitReached
      ? "text-gray-500 cursor-not-allowed opacity-40"
      : "text-gray-200 hover:bg-white/5"
  }
`}
                title={
                  isProLocked(opt.value)
                    ? "Upgrade to Pro to unlock this block"
                    : blockLimitReached
                      ? "Block limit reached"
                      : ""
                }
              >
                {/* ✅ span instead of div */}
                <span className="flex items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                      text-[10px]
                      uppercase
                      px-2
                      py-0.5
                      whitespace-nowrap
                      border
                      rounded-md
        ${
          BLOCK_PILL_STYLES[opt.label] ||
          "bg-white/5 text-white-400 border-white/20"
        }
      `}
                    >
                      {opt.label}
                    </span>

                    {/* PRO badge */}
                    {isProLocked(opt.value) && (
                      <span className="text-[10px] px-2 py-0.5 text-royalPurple uppercase">
                        PRO
                      </span>
                    )}
                  </div>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// src/components/AddSectionButton.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../../admin/AuthContext";
import { PRO_ONLY_BLOCKS } from "../../sections/landing/landingBlocksRules";
import { toast } from "react-toastify";

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

  const options = [
    { label: "Section Container", value: "container" },
    { label: "Heading (H1)", value: "heading" },
    { label: "Subheading (H2)", value: "subheading" },
    { label: "Sub-Subheading (H3)", value: "subsubheading" },
    { label: "List Heading", value: "list_heading" },
    { label: "Paragraph", value: "paragraph" },
    { label: "Video", value: "video" },
    { label: "Divider", value: "divider" },
    { label: "Offer Banner", value: "offer_banner" },
    { label: "Calendly", value: "calendly" },
    { label: "Countdown Timer", value: "countdown" },
    { label: "Social Links Row", value: "social_links" },
    { label: "Stripe Checkout", value: "stripe_checkout" },
    { label: "Offer Grid", value: "feature_offers_3" },
    { label: "Verified Reviews", value: "verified_reviews" },
    { label: "FAQ Accordion", value: "faq" },
    { label: "Pro Image", value: "image" },
    { label: "Secure Checkout", value: "secure_checkout" },
    { label: "Audio Player", value: "audio_player" },
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
        <div
          className="absolute right-0 mt-3 w-56 bg-[#0F172A] border border-gray-700 
                        rounded-xl shadow-xl overflow-hidden z-50"
        >
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
        : "text-gray-200 hover:bg-blue/20"
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
                <span className="flex items-center justify-between w-full">
                  <span>{opt.label}</span>

                  {isProLocked(opt.value) && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-purple-600 text-white">
                      PRO
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

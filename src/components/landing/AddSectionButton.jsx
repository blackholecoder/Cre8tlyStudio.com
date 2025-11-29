// src/components/AddSectionButton.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../../admin/AuthContext"; 

export default function AddSectionButton({ addBlock }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

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
    { label: "Verified Reviews ⭐", value: "verified_reviews" }, 
    { label: "FAQ Accordion ❓", value: "faq" },

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
        <div className="absolute right-0 mt-3 w-56 bg-[#0F172A] border border-gray-700 
                        rounded-xl shadow-xl overflow-hidden z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addBlock(opt.value);
                setShowDropdown(false);
              }}
              className="block w-full text-left px-5 py-3 text-gray-200 hover:bg-blue/20 transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

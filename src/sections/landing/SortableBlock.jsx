import React from "react";
import { Trash2 } from "lucide-react";
import { adjustForLandingOverlay } from "./adjustForLandingOverlay";
import HeadingBlock from "../../components/landing/blocks/types/HeadingBlock";
import ListHeadingBlock from "../../components/landing/blocks/types/ListHeadingBlock";
import ParagraphBlock from "../../components/landing/blocks/types/ParagraphBlock";
import VideoBlock from "../../components/landing/blocks/types/VideoBlock";
import DividerBlock from "../../components/landing/blocks/types/DividerBlock";
import OfferBannerBlock from "../../components/landing/blocks/types/OfferBannerBlock";
import CalendlyBlock from "../../components/landing/blocks/types/CalendlyBlock";
import SocialLinksBlock from "../../components/landing/blocks/types/SocialLinksBlock";
import VerifiedReviewsBlock from "../../components/landing/blocks/types/VerifiedReviewsBlock";
import CountdownBlock from "../../components/landing/blocks/types/CountdownBlock";
import StripeCheckoutBlock from "../../components/landing/blocks/types/StripeCheckoutBlock";
import ReferralButtonBlock from "../../components/landing/blocks/types/ReferralButtonBlock";
import FAQBlock from "../../components/landing/blocks/types/FAQBlock";
import ImageBlock from "../../components/landing/blocks/types/ImageBlock";
import SecureCheckoutBlock from "../../components/landing/blocks/types/SecureCheckoutBlock";
import AudioPlayerBlock from "../../components/landing/blocks/types/AudioPlayerBlock";
import { SortableContainerBlock } from "../../components/landing/blocks/types/SortableContainerBlock";
import ButtonBlock from "../../components/landing/blocks/types/ButtonBlock";
import { BLOCK_PILL_STYLES, BLOCK_TYPE_TO_LABEL } from "../../constants";
import SingleOfferBlock from "../../components/landing/blocks/types/SingleOfferBlock";
import MiniOfferBlock from "../../components/landing/blocks/types/MiniOfferBlock";
import ProfileCardBlock from "../../components/landing/blocks/types/ProfileCardBlock";
import ScrollArrowBlock from "../../components/landing/blocks/types/ScrollArrowBlock";

function SortableBlock({
  id,
  block,
  index,
  updateBlock,
  removeBlock,
  moveBlockUp,
  moveBlockDown,
  activeChild,
  setActiveChild,
  setActiveRoot,
  activeRoot,
  bgTheme,
  pdfList,
  landing,
  updateChildBlock,
  openAIModal,
  containerIndex,
}) {
  const updateField = (i, key, value) => {
    if (Number.isInteger(containerIndex) && updateChildBlock) {
      updateChildBlock(i, key, value);
    } else {
      updateBlock(i, key, value);
    }
  };

  const isActive =
    (Number.isInteger(containerIndex) && activeChild?.childId === block.id) ||
    (containerIndex == null && activeRoot?.blockId === block.id);

  const getLabelContrast = (hex) => {
    if (!hex) return "#1f2937"; // default dark gray

    const color = hex.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 160 ? "#1f2937" : "#f3f4f6";
  };

  function getBlockLabel(block) {
    switch (block.type) {
      case "container":
        return `${block.title || "Untitled Section"} • ${
          (block.children || []).length
        } blocks`;

      case "heading":
      case "subheading":
      case "subsubheading":
      case "list_heading":
        return block.text?.slice(0, 30) || "(empty heading)";

      case "paragraph":
        return block.text?.slice(0, 30) || "(empty paragraph)";

      case "offer_banner":
        return block.button_text?.slice(0, 30) || "(no button text)";

      case "divider":
        return block.style === "space"
          ? `space • ${block.height || 40}px`
          : `line • ${block.color || "#fff"} • ${block.height || 40}px`;

      case "image":
        return block.image_url
          ? block.image_url.split("/").pop().slice(0, 30)
          : "(no image)";

      case "profile_card":
        return block.tagline
          ? block.tagline.split("/").pop().slice(0, 30)
          : "(no image)";

      case "social_links":
        return `${Object.values(block.links || {}).filter(Boolean).length} links`;

      case "video":
        return block.url?.slice(0, 30) || "(no video URL)";

      case "faq":
        return `${block.items?.length || 0} questions`;

      case "stripe_checkout":
        return `$${block.price || 10} • checkout`;

      case "calendly":
        return block.calendly_url?.slice(0, 30) || "(no url)";

      case "verified_reviews":
        return block.title?.slice(0, 30) || "(reviews section)";

      case "countdown":
        return block.text?.slice(0, 30) || "(countdown timer)";

      case "referral_button":
        return block.text?.slice(0, 30) || "(referral button)";

      case "button_url":
        return block.text || "Button";

      case "single_offer":
        return block.title ? block.title.slice(0, 30) : "Single Offer";

      case "mini_offer":
        return block.title ? block.title.slice(0, 30) : "Mini Offer";

      case "secure_checkout":
        return block.title?.slice(0, 30) || "Secure Checkout";
      case "audio_player":
        return block.title?.slice(0, 30) || "Audio Player";

      case "scroll_arrow":
        return `Arrow • ${block.color || "#FFFFFF"}`;

      default:
        return "";
    }
  }

  function BlockValuePill({ value, disabled }) {
    const label = BLOCK_TYPE_TO_LABEL[value] || value;

    const colorClasses =
      BLOCK_PILL_STYLES[label] || "bg-white/10 text-gray-300 border-white/20";

    return (
      <span
        className={`
        text-[13px]
        font-semibold
        uppercase
        tracking-wide
        px-2.5
        py-0.5
        rounded-full
        border
        leading-none
        whitespace-nowrap
        transition-all
        ${disabled ? "opacity-40 grayscale" : colorClasses}
      `}
      >
        {label}
      </span>
    );
  }

  const animationsEnabled =
    landing?.motion_settings?.enabled === true && block.enabled !== false;

  if (block.type === "container") {
    return (
      <SortableContainerBlock
        id={id}
        block={block}
        index={index}
        updateBlock={updateBlock}
        removeBlock={removeBlock}
        moveBlockUp={moveBlockUp}
        moveBlockDown={moveBlockDown}
        activeChild={activeChild}
        setActiveChild={setActiveChild}
        bgTheme={bgTheme}
        pdfList={pdfList}
        landing={landing}
        openAIModal={openAIModal}
      />
    );
  }

  return (
    <div
      data-drop-id={index}
      data-parent-id={null}
      onClick={(e) => {
        e.stopPropagation();
        if (Number.isInteger(containerIndex)) {
          setActiveChild({
            containerIndex,
            childIndex: index,
            childId: block.id,
          });
          setActiveRoot(null);
        } else {
          // 🧱 root block
          setActiveRoot({
            blockId: block.id,
            blockIndex: index,
          });
          setActiveChild(null);
        }
      }}
      className={`mb-4 ${isActive ? "ring-2 ring-green" : ""} sm:mb-6
     bg-black/70 border rounded-lg sm:rounded-xl
      p-3 sm:p-5
      relative shadow-inner
      text-white transition-all duration-300
    ${
      block.enabled !== false
        ? "border-gray-600 hover:border-gray-400"
        : "border-gray-700 opacity-50 grayscale"
    }
  `}
    >
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        {/* ROW: Toggle + Block Name */}
        <div className="flex items-center gap-2">
          {/* ENABLE TOGGLE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              updateField(index, "enabled", block.enabled === false);
            }}
            className={`
        inline-flex
        h-4
        w-8
        items-center
        rounded-full
        transition-colors
        duration-200
        shadow-md
        ${block.enabled !== false ? "bg-green/80" : "bg-zinc-700"}
      `}
          >
            <span
              className={`
          h-3
          w-3
          rounded-full
          bg-white
          transition-transform
          duration-200
          ${block.enabled !== false ? "translate-x-4" : "translate-x-1"}
        `}
            />
          </button>

          {/* BLOCK TYPE */}
          <BlockValuePill
            value={block.type}
            disabled={block.enabled === false}
          />

          {block.enabled === false && (
            <span className="text-[11px] text-gray-400 italic">disabled</span>
          )}
        </div>

        {/* SUB LABEL */}
      </div>
      {/* 🧩 Collapse / Expand Header */}
      <div
        className="flex items-center justify-end mb-2 sm:mb-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); // 🔒 REQUIRED
          updateField(index, "collapsed", !block.collapsed);
        }}
      >
        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {animationsEnabled && (
            <div
              className="flex items-center gap-2 shrink-0 opacity-80 hover:opacity-100 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[11px] text-gray-400">Animate</span>

              <button
                type="button"
                onClick={() =>
                  updateField(index, "motion", {
                    ...block.motion,
                    disabled: !block.motion?.disabled,
                  })
                }
                className={`
          relative inline-flex
          h-4 w-7
          items-center
          rounded-full
          transition-colors duration-200
          ${block.motion?.disabled ? "bg-zinc-700" : "bg-royalPurple"}
        `}
              >
                <span
                  className={`
            h-3 w-3
            rounded-full
            bg-white
            transition-transform duration-200
            ${block.motion?.disabled ? "translate-x-1" : "translate-x-3"}
          `}
                />
              </button>
            </div>
          )}

          {/* CHEVRON */}
          <span
            className={`text-gray-400 text-sm transition-transform duration-300 ${
              block.collapsed ? "rotate-0" : "rotate-180"
            }`}
          >
            ▼
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-400 leading-snug mt-0.5 ml-[36px]">
        {getBlockLabel(block)}
      </div>

      {/* 🪄 Editable Fields (Collapsible) */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          block.collapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
        }`}
      >
        <div
          className={`transform transition-transform duration-500 ${
            block.collapsed ? "scale-y-95" : "scale-y-100"
          }`}
        >
          {["heading", "subheading", "subsubheading"].includes(block.type) && (
            <HeadingBlock
              block={block}
              index={index}
              updateChildBlock={updateChildBlock}
              containerIndex={containerIndex}
              updateBlock={updateField}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "list_heading" && (
            <ListHeadingBlock
              block={block}
              index={index}
              updateChildBlock={updateChildBlock}
              containerIndex={containerIndex}
              updateBlock={updateField}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "paragraph" && (
            <ParagraphBlock
              block={block}
              index={index}
              updateChildBlock={updateChildBlock}
              containerIndex={containerIndex}
              updateBlock={updateField}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "video" && (
            <VideoBlock block={block} index={index} updateBlock={updateField} />
          )}
          {block.type === "divider" && (
            <DividerBlock
              block={block}
              index={index}
              updateBlock={updateField}
            />
          )}
          {block.type === "offer_banner" && (
            <OfferBannerBlock
              block={block}
              index={index}
              updateBlock={updateField}
              bgTheme={bgTheme}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "calendly" && (
            <CalendlyBlock
              block={block}
              index={index}
              updateBlock={updateField}
            />
          )}
          {block.type === "social_links" && (
            <SocialLinksBlock
              block={block}
              index={index}
              updateBlock={updateField}
            />
          )}
          {block.type === "verified_reviews" && (
            <VerifiedReviewsBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
            />
          )}
          {block.type === "countdown" && (
            <CountdownBlock
              block={block}
              index={index}
              updateBlock={updateField}
            />
          )}
          {block.type === "stripe_checkout" && (
            <StripeCheckoutBlock
              block={block}
              index={index}
              updateBlock={updateField}
              pdfList={pdfList}
              bgTheme={bgTheme}
              landing={landing}
            />
          )}
          {block.type === "referral_button" && (
            <ReferralButtonBlock
              block={block}
              index={index}
              updateBlock={updateField}
            />
          )}
          {block.type === "faq" && (
            <FAQBlock
              block={block}
              index={index}
              updateChildBlock={updateChildBlock}
              containerIndex={containerIndex}
              updateBlock={updateField}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "image" && (
            <ImageBlock
              block={block}
              index={index}
              updateBlock={updateField}
              bgTheme={bgTheme}
              getLabelContrast={getLabelContrast}
              adjustForLandingOverlay={adjustForLandingOverlay}
              landing={landing}
            />
          )}
          {block.type === "single_offer" && (
            <SingleOfferBlock
              block={block}
              index={index}
              containerIndex={containerIndex}
              updateBlock={updateField}
              updateChildBlock={updateChildBlock}
              bgTheme={bgTheme}
              landing={landing}
              pdfList={pdfList}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "mini_offer" && (
            <MiniOfferBlock
              block={block}
              index={index}
              containerIndex={containerIndex}
              updateBlock={updateField}
              updateChildBlock={updateChildBlock}
              bgTheme={bgTheme}
              landing={landing}
              pdfList={pdfList}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "secure_checkout" && (
            <SecureCheckoutBlock
              block={block}
              index={index}
              updateBlock={updateField}
            />
          )}
          {block.type === "audio_player" && (
            <AudioPlayerBlock
              block={block}
              index={index}
              bgTheme={bgTheme}
              updateBlock={updateField}
              landing={landing}
            />
          )}
          {block.type === "button_url" && (
            <ButtonBlock
              block={block}
              index={index}
              bgTheme={bgTheme}
              updateBlock={updateField}
              landing={landing}
            />
          )}
          {block.type === "profile_card" && (
            <ProfileCardBlock
              block={block}
              index={index}
              updateBlock={updateField}
              bgTheme={bgTheme}
              getLabelContrast={getLabelContrast}
              adjustForLandingOverlay={adjustForLandingOverlay}
              landing={landing}
            />
          )}
          {block.type === "scroll_arrow" && (
            <ScrollArrowBlock
              block={block}
              index={index}
              updateBlock={updateField}
              bgTheme={bgTheme}
              getLabelContrast={getLabelContrast}
              adjustForLandingOverlay={adjustForLandingOverlay}
              landing={landing}
            />
          )}
        </div>

        {/* 🗑 Remove Button (collapses with content) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeBlock(index);
          }}
          className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold transition-all"
        >
          <Trash2 size={16} className="opacity-80" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}

export const MemoizedSortableBlock = React.memo(SortableBlock);

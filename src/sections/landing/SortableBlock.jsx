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
import { useDraggable } from "@dnd-kit/core";

function DragHandle({ id, disabled }) {
  if (!id) return null;

  const { setNodeRef, listeners, attributes } = useDraggable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        absolute top-2 left-1/2 -translate-x-1/2
        text-xs px-2 py-1 rounded
        ${
          disabled
            ? "opacity-40 cursor-default bg-gray-700"
            : "cursor-grab bg-gray-300 hover:bg-gray-400"
        }
      `}
      title={disabled ? "Close block to move" : "Drag to reorder"}
    >
      ☰
    </div>
  );
}

function SortableBlock({
  id,
  block,
  index,
  updateBlock,
  removeBlock,
  bgTheme,
  pdfList,
  landing,
  updateChildBlock,
  openAIModal,
  containerIndex,
  dragState,
  setDragState,
}) {
  const updateField = (i, key, value) => {
    if (Number.isInteger(containerIndex) && updateChildBlock) {
      updateChildBlock(i, key, value);
    } else {
      updateBlock(i, key, value);
    }
  };

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
        return block.text?.slice(0, 70) || "(empty heading)";

      case "paragraph":
        return block.text?.slice(0, 70) || "(empty paragraph)";

      case "offer_banner":
        return block.button_text?.slice(0, 70) || "(no button text)";

      case "divider":
        return block.style === "space"
          ? `space • ${block.height || 40}px`
          : `line • ${block.color || "#fff"} • ${block.height || 40}px`;

      case "image":
        return block.image_url
          ? block.image_url.split("/").pop().slice(0, 30)
          : "(no image)";

      case "profile_card":
        return block.image_url
          ? block.image_url.split("/").pop().slice(0, 30)
          : "(no image)";

      case "social_links":
        return `${Object.values(block.links || {}).filter(Boolean).length} links`;

      case "video":
        return block.url?.slice(0, 35) || "(no video URL)";

      case "faq":
        return `${block.items?.length || 0} questions`;

      case "stripe_checkout":
        return `$${block.price || 10} • checkout`;

      case "calendly":
        return block.calendly_url?.slice(0, 35) || "(no url)";

      case "verified_reviews":
        return block.title?.slice(0, 30) || "(reviews section)";

      case "countdown":
        return block.text?.slice(0, 30) || "(countdown timer)";

      case "referral_button":
        return block.text?.slice(0, 30) || "(referral button)";

      case "button_url":
        return block.text || "Button";

      case "single_offer":
        return block.title ? block.title.slice(0, 50) : "Single Offer";

      case "mini_offer":
        return block.title ? block.title.slice(0, 50) : "Mini Offer";

      case "secure_checkout":
        return block.title?.slice(0, 40) || "Secure Checkout";
      case "audio_player":
        return block.title?.slice(0, 35) || "Audio Player";

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
        bgTheme={bgTheme}
        pdfList={pdfList}
        landing={landing}
        openAIModal={openAIModal}
        dragState={dragState}
        setDragState={setDragState}
      />
    );
  }

  return (
    <div
      className={`mb-4 sm:mb-6
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
      {/* 🧩 Drag Handle */}
      <DragHandle id={id} disabled={!block.collapsed} />

      {/* 🧩 Collapse / Expand Header */}
      <div
        className="flex items-center justify-between cursor-pointer mb-2 sm:mb-3"
        onClick={() => updateField(index, "collapsed", !block.collapsed)}
      >
        {/* LEFT */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <BlockValuePill
              value={block.type}
              disabled={block.enabled === false}
            />
            {block.enabled === false && (
              <span className="text-[11px] text-gray-400 italic">disabled</span>
            )}
          </div>

          <span className="text-xs text-gray-400 mt-0.5 leading-snug">
            {getBlockLabel(block)}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-3 justify-end">
          {/* PRIMARY: Enable block */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              updateField(index, "enabled", block.enabled === false);
            }}
            className={`
            relative inline-flex 
            h-5 w-9 
            items-center 
            rounded-full 
            transition-colors duration-200
            ${block.enabled !== false ? "bg-green" : "bg-gray-600"}
          `}
          >
            <span
              className={`
          h-4 w-4 
          rounded-full 
          bg-white 
          transition-transform duration-200
          ${block.enabled !== false ? "translate-x-4" : "translate-x-1"}
        `}
            />
          </button>

          {/* DIVIDER */}
          <div className="h-4 w-px bg-white/10" />

          {/* SECONDARY: Animate */}
          {animationsEnabled && (
            <>
              {/* DIVIDER */}
              <div className="h-4 w-px bg-white/10" />

              {/* SECONDARY: Animate */}
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
            </>
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
          onClick={() => removeBlock(index)}
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

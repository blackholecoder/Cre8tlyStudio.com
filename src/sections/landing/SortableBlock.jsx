import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import FeatureOffers3Block from "../../components/landing/blocks/types/FeatureOffers3Block";
import SecureCheckoutBlock from "../../components/landing/blocks/types/SecureCheckoutBlock";
import AudioPlayerBlock from "../../components/landing/blocks/types/AudioPlayerBlock";
import { SortableContainerBlock } from "../../components/landing/blocks/types/SortableContainerBlock";
import ButtonBlock from "../../components/landing/blocks/types/ButtonBlock";

const BLOCK_LABELS = {
  heading: "Heading (H1)",
  subheading: "Subheading (H2)",
  subsubheading: "Sub-Subheading (H3)",
  list_heading: "List Heading",
  paragraph: "Paragraph",
  video: "Video",
  divider: "Divider",
  offer_banner: "Offer Banner",
  calendly: "Calendly",
  countdown: "Countdown Timer",
  social_links: "Social Links Row",
  stripe_checkout: "Stripe Checkout",
  feature_offers_3: "Offer Grid",
  verified_reviews: "Verified Reviews",
  faq: "FAQ Accordion",
  image: "Image",
  referral_button: "Referral Button",
  secure_checkout: "Secure Checkout",
  audio_player: "Audio Player",
  container: "Section Container",
  button_url: "Button Url",
};

function SortableBlock({
  id,
  block,
  index,
  updateBlock,
  removeBlock,
  bgTheme,
  pdfList,
  landing,
  openAIModal,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        return `${block.text || "Button"} • ${
          block.url ? block.url.slice(0, 35) : "no url"
        }`;

      case "feature_offers_3":
        return `${(block.items || []).length} offer cards`;
      case "secure_checkout":
        return block.title?.slice(0, 40) || "Secure Checkout";
      case "audio_player":
        return block.title?.slice(0, 35) || "Audio Player";

      default:
        return "";
    }
  }

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
        setNodeRef={setNodeRef}
        attributes={attributes}
        listeners={listeners}
        style={style}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-6 bg-black/70 border rounded-xl p-5 relative shadow-inner text-white transition-all duration-300
    ${
      block.enabled !== false
        ? "border-gray-600 hover:border-gray-400"
        : "border-gray-700 opacity-50 grayscale"
    }
  `}
    >
      {/* 🧩 Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-grab bg-gray-300 hover:bg-gray-400 
                   text-xs px-1 py-0.5 rounded"
      >
        ☰
      </div>

      {/* 🧩 Collapse / Expand Header */}
      <div
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={() => updateBlock(index, "collapsed", !block.collapsed)}
      >
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg text-green capitalize">
            {BLOCK_LABELS[block.type] || "Block"}
          </h3>

          {/* 👇 Add the preview label here */}
          <span className="text-xs text-gray-400 italic mt-0.5">
            {getBlockLabel(block)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 🚨 prevents collapse toggle
              updateBlock(index, "enabled", block.enabled === false);
            }}
            className={`text-xs px-2 py-1 rounded transition-colors
      ${
        block.enabled !== false
          ? "bg-green text-black hover:bg-green/30"
          : "bg-gray/20 text-gray-400 hover:bg-gray-600/30"
      }
    `}
          >
            {block.enabled !== false ? "On" : "Off"}
          </button>

          <span
            className={`text-gray-400 text-sm transform transition-transform duration-300 ${
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
              updateBlock={updateBlock}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "list_heading" && (
            <ListHeadingBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "paragraph" && (
            <ParagraphBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "video" && (
            <VideoBlock block={block} index={index} updateBlock={updateBlock} />
          )}
          {block.type === "divider" && (
            <DividerBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
            />
          )}
          {block.type === "offer_banner" && (
            <OfferBannerBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
              bgTheme={bgTheme}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "calendly" && (
            <CalendlyBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
            />
          )}
          {block.type === "social_links" && (
            <SocialLinksBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
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
              updateBlock={updateBlock}
            />
          )}
          {block.type === "stripe_checkout" && (
            <StripeCheckoutBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
              pdfList={pdfList}
              bgTheme={bgTheme}
              landing={landing}
            />
          )}
          {block.type === "referral_button" && (
            <ReferralButtonBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
            />
          )}
          {block.type === "faq" && (
            <FAQBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
              openAIModal={openAIModal}
            />
          )}
          {block.type === "image" && (
            <ImageBlock
              block={block}
              index={index}
              updateBlock={updateBlock}
              bgTheme={bgTheme}
              getLabelContrast={getLabelContrast}
              adjustForLandingOverlay={adjustForLandingOverlay}
              landing={landing}
            />
          )}
          {block.type === "feature_offers_3" && (
            <FeatureOffers3Block
              block={block}
              index={index}
              updateBlock={updateBlock}
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
              updateBlock={updateBlock}
            />
          )}
          {block.type === "audio_player" && (
            <AudioPlayerBlock
              block={block}
              index={index}
              bgTheme={bgTheme}
              updateBlock={updateBlock}
              landing={landing}
            />
          )}
          {block.type === "button_url" && (
            <ButtonBlock
              block={block}
              index={index}
              bgTheme={bgTheme}
              updateBlock={updateBlock}
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

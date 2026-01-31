import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../admin/AuthContext";
import { colorThemes, gradientThemes } from "../../constants";
import { MemoizedSortableBlock } from "./SortableBlock";
import { Wand2 } from "lucide-react";
import { normalizeVideoUrl } from "./NormalizeVideoUrl";
import AddSectionButton from "../../components/landing/AddSectionButton";
import { blendColors } from "./BlendColors";
import { adjustForLandingOverlay } from "./adjustForLandingOverlay";
import {
  fetchTemplateSnapshot,
  restoreTemplate,
  saveTemplate,
  loadTemplateVersions,
  deleteTemplate,
} from "../../api/saveTemplates";
import SaveVersionModal from "../../components/landing/SaveVersionModal";
import VersionControls from "../../components/landing/landingPageBuilder/VersionControls";
import PdfSelector from "../../components/landing/landingPageBuilder/PdfSelector";
import LogoUploader from "../../components/landing/landingPageBuilder/LogoUploader";
import ThemeAndFontControls from "../../components/landing/landingPageBuilder/ThemeAndFontControls";
import TextColorControls from "../../components/landing/landingPageBuilder/TextColorControls";
import PreviewPanel from "../../components/landing/landingPageBuilder/PreviewPanel";
import ToggleDownloadButton from "../../components/landing/landingPageBuilder/ToggleDownloadButton";
import BottomActionsBar from "../../components/landing/landingPageBuilder/BottomActionsBar";
import { BLOCK_LIMITS, PRO_ONLY_BLOCKS } from "./landingBlocksRules";
import AICopyModal from "./ai/AICopyModal";
import AnimationSettingsPanel from "../../components/landing/landingPageBuilder/AnimationSettingsPanel";
import { useNavigate } from "react-router-dom";
import PageUrlUsernameField from "../../components/landing/landingPageBuilder/PageUrlUsernameField";

export default function LandingPageBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontName, setFontName] = useState("");
  const [fontFile, setFontFile] = useState("");
  const [bgTheme, setBgTheme] = useState("default");
  const [pdfList, setPdfList] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverLoading, setCoverLoading] = useState(false);
  const [showPdfSection, setShowPdfSection] = useState(false);
  const [showPreviewSection, setShowPreviewSection] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [activeChild, setActiveChild] = useState(null);
  const [activeRoot, setActiveRoot] = useState(null);
  const [showContainerPicker, setShowContainerPicker] = useState(false);
  const [showLogoSection, setShowLogoSection] = useState(false);

  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [appliedVersion, setAppliedVersion] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const [blocksHidden, setBlocksHidden] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  // Ai
  const [aiContext, setAIContext] = useState(null);

  const validActiveRoot =
    activeRoot &&
    landing.content_blocks[activeRoot.blockIndex]?.id === activeRoot.blockId;

  const openAIModal = (context) => {
    setAIContext(context);
  };

  const moveBlockUp = (blockId) => {
    setLanding((prev) => {
      const blocks = prev.content_blocks;
      const loc = findLocationById(blocks, blockId);
      if (!loc) return prev;

      const targetIndex = loc.index - 1;
      if (targetIndex < 0) return prev;

      const { removed, next } = removeAtLocation(blocks, loc);

      const updated = insertAtLocation(
        next,
        {
          parentId: loc.parentId,
          index: targetIndex,
        },
        removed,
      );

      return { ...prev, content_blocks: updated };
    });
  };

  const moveBlockDown = (blockId) => {
    setLanding((prev) => {
      const blocks = prev.content_blocks;
      const loc = findLocationById(blocks, blockId);
      if (!loc) return prev;

      const siblings =
        loc.parentId === null
          ? blocks
          : blocks.find((b) => b.id === loc.parentId)?.children || [];

      const targetIndex = loc.index + 1;
      if (targetIndex >= siblings.length) return prev;

      const { removed, next } = removeAtLocation(blocks, loc);

      const updated = insertAtLocation(
        next,
        {
          parentId: loc.parentId,
          index: targetIndex,
        },
        removed,
      );

      return { ...prev, content_blocks: updated };
    });
  };

  const moveChildUp = (containerIndex, childId) => {
    setLanding((prev) => {
      const blocks = [...prev.content_blocks];
      const container = blocks[containerIndex];
      if (!container?.children) return prev;

      const idx = container.children.findIndex((c) => c.id === childId);
      if (idx <= 0) return prev; // already at top

      const children = [...container.children];
      const [item] = children.splice(idx, 1);
      children.splice(idx - 1, 0, item);

      blocks[containerIndex] = {
        ...container,
        children,
      };

      return { ...prev, content_blocks: blocks };
    });
  };
  const moveChildDown = (containerIndex, childId) => {
    setLanding((prev) => {
      const blocks = [...prev.content_blocks];
      const container = blocks[containerIndex];
      if (!container?.children) return prev;

      const idx = container.children.findIndex((c) => c.id === childId);
      if (idx === -1 || idx >= container.children.length - 1) return prev;

      const children = [...container.children];
      const [item] = children.splice(idx, 1);
      children.splice(idx + 1, 0, item);

      blocks[containerIndex] = {
        ...container,
        children,
      };

      return { ...prev, content_blocks: blocks };
    });
  };

  const removeFromContainer = (containerIndex, childId) => {
    setLanding((prev) => {
      const blocks = [...prev.content_blocks];
      const container = blocks[containerIndex];

      if (!container || !Array.isArray(container.children)) return prev;

      const childIndex = container.children.findIndex((c) => c.id === childId);
      if (childIndex === -1) return prev;

      const child = container.children[childIndex];

      // remove from container
      const newChildren = container.children.filter((_, i) => i !== childIndex);

      blocks[containerIndex] = {
        ...container,
        children: newChildren,
      };

      // insert after container in root
      blocks.splice(containerIndex + 1, 0, child);

      return {
        ...prev,
        content_blocks: blocks,
      };
    });
  };
  // const moveRootIntoContainer = (rootIndex, containerIndex) => {
  //   setLanding((prev) => {
  //     const blocks = [...prev.content_blocks];
  //     const block = blocks[rootIndex];
  //     const container = blocks[containerIndex];

  //     if (!block || !container || container.type !== "container") {
  //       return prev;
  //     }

  //     // remove root block
  //     blocks.splice(rootIndex, 1);

  //     // add to container
  //     const children = [...(container.children || []), block];

  //     blocks[containerIndex] = {
  //       ...container,
  //       children,
  //     };

  //     return {
  //       ...prev,
  //       content_blocks: blocks,
  //     };
  //   });
  // };
  const moveRootIntoContainer = (rootIndex, containerIndex) => {
    setLanding((prev) => {
      const blocks = [...prev.content_blocks];
      const block = blocks[rootIndex];

      if (!block) return prev;

      // Remove the block first
      blocks.splice(rootIndex, 1);

      // 🔑 Adjust container index if it was after the removed block
      const adjustedContainerIndex =
        rootIndex < containerIndex ? containerIndex - 1 : containerIndex;

      const container = blocks[adjustedContainerIndex];

      if (!container || container.type !== "container") {
        return prev;
      }

      blocks[adjustedContainerIndex] = {
        ...container,
        children: [...(container.children || []), block],
      };

      return {
        ...prev,
        content_blocks: blocks,
      };
    });
  };

  const findLocationById = (blocks, id) => {
    const rootIndex = blocks.findIndex((b) => b.id === id);
    if (rootIndex !== -1) {
      return { parentId: null, index: rootIndex, block: blocks[rootIndex] };
    }

    for (const container of blocks) {
      if (container.type !== "container") continue;
      const childIndex = (container.children || []).findIndex(
        (c) => c.id === id,
      );
      if (childIndex !== -1) {
        return {
          parentId: container.id,
          index: childIndex,
          block: container.children[childIndex],
        };
      }
    }

    return null;
  };

  const removeAtLocation = (blocks, loc) => {
    let removed;

    if (loc.parentId === null) {
      removed = blocks[loc.index];
      return {
        removed,
        next: blocks.filter((_, i) => i !== loc.index),
      };
    }

    return {
      removed: blocks.find((b) => b.id === loc.parentId).children[loc.index],
      next: blocks.map((b) =>
        b.id !== loc.parentId
          ? b
          : {
              ...b,
              children: b.children.filter((_, i) => i !== loc.index),
            },
      ),
    };
  };

  const insertAtLocation = (blocks, loc, item) => {
    if (loc.parentId === null) {
      const next = [...blocks];
      next.splice(loc.index, 0, item);
      return next;
    }

    return blocks.map((b) =>
      b.id !== loc.parentId
        ? b
        : {
            ...b,
            children: [
              ...(b.children || []).slice(0, loc.index),
              item,
              ...(b.children || []).slice(loc.index),
            ],
          },
    );
  };

  const isPro =
    user?.plan === "business_builder_pack" && user?.pro_status === "active";

  const countBlocksByType = React.useCallback((blocks) => {
    const counts = {};

    const walk = (list) => {
      for (const block of list) {
        counts[block.type] = (counts[block.type] || 0) + 1;

        if (block.type === "container" && block.children?.length) {
          walk(block.children);
        }
      }
    };

    walk(blocks || []);
    return counts;
  }, []);

  const canAddBlock = React.useCallback(
    (type) => {
      const limit = BLOCK_LIMITS[type];
      if (!limit) return true;

      const counts = countBlocksByType(landing?.content_blocks || []);
      return (counts[type] || 0) < limit;
    },
    [landing?.content_blocks, countBlocksByType],
  );

  const updateBlock = React.useCallback((index, key, value) => {
    setLanding((prev) => {
      const updatedBlocks = prev.content_blocks.map((b, i) => {
        if (i !== index) return b;

        const resolvedValue =
          typeof value === "function" ? value(b[key]) : value;

        return {
          ...b,
          [key]: resolvedValue,
        };
      });

      return { ...prev, content_blocks: updatedBlocks };
    });
  }, []);

  const addBlock = (type) => {
    if (!type) return; // prevent invalid type

    // 🚫 Pro-only block gate
    if (!isPro && PRO_ONLY_BLOCKS.includes(type)) {
      toast.error(
        "This block is a Pro feature. Upgrade to Pro to unlock Audio, Calendly, and Reviews.",
      );
      return;
    }

    if (!canAddBlock(type)) {
      toast.error(
        `You can only add ${BLOCK_LIMITS[type]} ${
          BLOCK_LABELS[type] || type
        } block`,
      );
      return;
    }

    let newBlock = {
      id: crypto.randomUUID(),
      type,
      enabled: true,
      padding: 20,
      alignment: "left",
      bulleted: false,
      collapsed: true,
      motion: {
        disabled: false, // animate by default
        preset: null, // will inherit global preset
      },
    };

    if (type === "container") {
      newBlock = {
        id: crypto.randomUUID(),
        type: "container",
        title: "New Section",
        collapsed: false,
        enabled: true,
        children: [],
      };
    }

    // 🧩 Custom defaults for specific block types
    if (
      [
        "heading",
        "subheading",
        "subsubheading",
        "paragraph",
        "list_heading",
      ].includes(type)
    ) {
      newBlock.text = "";
    }

    if (type === "video") {
      newBlock.url = "";
      newBlock.caption = "";
      newBlock.autoplay = false;
      newBlock.loop = false;
      newBlock.muted = false;
    }

    if (type === "divider" || type === "spacer") {
      newBlock.height = 40; // default space in pixels
      newBlock.style = "line"; // can be "line" or "space"
      newBlock.color = "rgba(255,255,255,0.2)";
      newBlock.width = "60%";
    }

    if (type === "offer_banner") {
      newBlock.text = "🔥 Limited Time Offer!";
      newBlock.text_color = "#000000";
      newBlock.alignment = "center";
      newBlock.padding = 20;

      // 🎨 Background
      newBlock.use_gradient = true;
      newBlock.gradient_start = "#F285C3";
      newBlock.gradient_end = "#7bed9f";
      newBlock.gradient_direction = "90deg";
      newBlock.bg_color = "#F285C3";

      // 🧩 New logic for button control
      newBlock.offer_type = "free"; // "free" or "paid"
      newBlock.button_text = "Claim Offer"; // Default text for the button
    }

    if (type === "calendly") {
      newBlock.calendly_url = "";
      newBlock.height = 650; // default iframe height
    }

    if (type === "social_links") {
      newBlock.alignment = "center";
      newBlock.icon_style = "color";
      newBlock.show_borders = false;
      newBlock.links = {
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
        facebook: "",
        tiktok: "",
      };
    }

    if (type === "countdown") {
      newBlock.text = "Offer Ends In:";
      newBlock.text_color = "#FFFFFF";
      newBlock.target_date = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      newBlock.alignment = "center";
      newBlock.style_variant = "minimal"; // default style
    }

    if (type === "stripe_checkout") {
      newBlock.price = 10; // default price in USD
      newBlock.button_text = "Buy & Download PDF";
      newBlock.button_color = "#7bed9f";
      newBlock.alignment = "center";
      newBlock.collapsed = false;
      newBlock.product_source = "internal";
      newBlock.pdf_url = "";
      newBlock.external_file_url = "";
      newBlock.external_file_name = "";
    }

    if (type === "referral_button") {
      newBlock.text = "Join The Messy Attic";
      newBlock.button_color = "#7bed9f";
      newBlock.text_color = "#000000";
      newBlock.alignment = "center";
      newBlock.collapsed = false;
    }

    // ⭐ Verified Reviews Block
    if (type === "verified_reviews") {
      newBlock.enabled = true;
      newBlock.collapsed = false;
      newBlock.reviews_text_color;
    }

    if (type === "faq") {
      newBlock.title = "Frequently Asked Questions";
      newBlock.items = [
        { q: "What is included?", a: "Everything you need to get started." },
      ];
      newBlock.text_color = "#FFFFFF";
      newBlock.bg_color = "rgba(0,0,0,0.3)";
      newBlock.alignment = "left";
    }

    if (type === "image") {
      newBlock.image_url = "";
      newBlock.caption = "";
      newBlock.padding = 0;
      newBlock.full_width = false;
      newBlock.alignment = "center";

      newBlock.radius = 0;
      newBlock.width = 100;

      // ✅ Shadow controls
      newBlock.shadow = false;
      newBlock.shadow_color = "rgba(0,0,0,0.5)";
      newBlock.shadow_depth = 25; // blur radius / softness
      newBlock.shadow_offset = 10; // distance from image
      newBlock.shadow_angle = 135; // degrees — allows rotation

      // ✅ Background & gradient controls (already supported in builder UI)
      newBlock.match_main_bg = false;
      newBlock.use_no_bg = false;
      newBlock.use_gradient = false;
      newBlock.gradient_start = "#F285C3";
      newBlock.gradient_end = "#7bed9f";
      newBlock.gradient_direction = "90deg";
      newBlock.bg_color = "#000000";
    }

    if (type === "single_offer") {
      // ✅ COMMERCE (same as stripe_checkout)
      newBlock.price = 10;
      newBlock.product_source = "internal";
      newBlock.pdf_url = "";
      newBlock.external_file_url = "";
      newBlock.external_file_name = "";

      // ✅ UI / PRESENTATION
      newBlock.image_url = "";
      newBlock.cover_url = "";
      newBlock.title = "Offer One";
      newBlock.text = "Short description of this offer.";
      newBlock.long_text = "";
      newBlock.use_long_description = false;
      newBlock.description_type = "text";
      newBlock.button_text = "Buy Now";
      newBlock.button_color = "#22c55e";
      newBlock.button_text_color = "#000000";
      newBlock.use_pdf_cover = false;

      // layout
      newBlock.bg_color = "rgba(0,0,0,0.4)";
      newBlock.use_gradient = false;
      newBlock.text_color = "#ffffff";
      newBlock.card_width = 360;
      newBlock.card_height = "auto";
    }

    if (type === "mini_offer") {
      // ✅ COMMERCE (same as stripe_checkout)
      newBlock.price = 10;
      newBlock.product_source = "internal";
      newBlock.product_name;
      newBlock.pdf_url = "";
      newBlock.page_count = null;
      newBlock.external_file_url = "";
      newBlock.external_file_name = "";

      // ✅ UI / PRESENTATION
      newBlock.image_url = "";
      newBlock.cover_url = "";
      newBlock.title = "Offer One";
      newBlock.text = "Short description of this offer.";
      newBlock.long_text = "";
      newBlock.use_long_description = false;
      newBlock.description_type = "text";
      newBlock.button_text = "Buy Now";
      newBlock.button_color = "#22c55e";
      newBlock.button_text_color = "#000000";
      newBlock.use_pdf_cover = false;

      // layout
      newBlock.bg_color = "rgba(0,0,0,0.4)";
      newBlock.use_gradient = false;
      newBlock.text_color = "#ffffff";
      newBlock.secondary_text_color = "#ffffff";
      newBlock.utility_text_color = "#ffffff";
      newBlock.card_width = 360;
      newBlock.card_height = "auto";
      newBlock.offer_page = {
        enabled: false,
        blocks: [
          {
            id: "uuid",
            type: "paragraph",
            text: "",
            image_url: "",
          },
        ],
        bullets: [],
        trust_items: [],
      };
    }

    if (type === "secure_checkout") {
      newBlock.title = "Secure Checkout";
      newBlock.subtext =
        "Your information is protected by industry leading encryption and secure payment processing.";

      newBlock.trust_items = [
        "Secure SSL Encryption",
        "Protected Checkout Page",
        "Safe Payment Processing",
      ];

      newBlock.guarantee = "30 day money back guarantee on all purchases";

      // optional image badge (left blank by default)
      newBlock.payment_badge = "";

      // NEW minimal style defaults
      newBlock.text_color = "#FFFFFF";
      newBlock.alignment = "center"; // ⭐ MUST BE CENTERED
      newBlock.padding = 0; // ⭐ no padding for minimal design
      newBlock.bg_color = "transparent"; // ⭐ remove old card background

      newBlock.collapsed = false;
    }

    if (type === "audio_player") {
      newBlock.audio_url = "";
      newBlock.cover_url = "";
      newBlock.title = "Untitled Track";

      newBlock.progress_color = "#22c55e";

      newBlock.playlist = [];
      newBlock.show_cover = true;
      newBlock.show_title = true;

      newBlock.alignment = "center";

      // NEW THEMING CONTROLS
      newBlock.match_main_bg = false;
      newBlock.use_gradient = false;
      newBlock.bg_color = "#0F172A"; // same as current dark block default
      newBlock.gradient_start = "#7bed9f";
      newBlock.gradient_end = "#22c55e";
      newBlock.gradient_direction = "90deg";

      newBlock.text_color = "#ffffff";

      newBlock.sell_singles = false;
      newBlock.sell_album = false;
      newBlock.album_price = "";
      newBlock.single_price = "";
      newBlock.album_button_text = "Buy Album";
      newBlock.single_button_text = "Buy Now";
      newBlock.preview_enabled = false;
      newBlock.preview_duration = 30; // seconds

      newBlock.collapsed = false;
    }

    if (type === "button_url") {
      newBlock.text = "Click Here";
      newBlock.url = "";
      newBlock.open_new_tab = true;

      newBlock.alignment = "center";

      // size
      newBlock.width = 220;
      newBlock.height = 48;
      newBlock.padding_x = 24;
      newBlock.padding_y = 12;

      // border
      newBlock.radius = 8;
      newBlock.stroke_width = 0;
      newBlock.stroke_color = "#000000";

      // background
      newBlock.use_gradient = false;
      newBlock.bg_color = "#22c55e";
      newBlock.gradient_start = "#22c55e";
      newBlock.gradient_end = "#3b82f6";
      newBlock.gradient_direction = "90deg";

      // text
      newBlock.text_color = "#000000";
      newBlock.font_size = 16;
      newBlock.font_weight = 600;

      // shadow
      newBlock.shadow_offset_x = 0;
      newBlock.shadow_offset_y = 8;
      newBlock.shadow_blur = 20;
      newBlock.shadow_opacity = 35; // percent
      newBlock.shadow_color = "#000000";
    }

    if (type === "profile_card") {
      newBlock.alignment = "center";

      // image
      newBlock.image_url = "";
      newBlock.image_alt = "";
      newBlock.image_size = 120;
      newBlock.image_radius = 999;
      newBlock.image_border_width = 1;
      newBlock.image_border_color = "#e5e7eb";

      // text content
      newBlock.tagline = "Welcome";
      newBlock.contact_type = "email"; // email | phone
      newBlock.contact_value = "";

      // styling
      newBlock.tagline_color = "#111827";
      newBlock.subtext_color = "#6b7280";

      // visibility
      newBlock.show_image = true;
      newBlock.show_tagline = true;
      newBlock.show_contact = true;
    }
    if (type === "scroll_arrow") {
      // layout
      newBlock.alignment = "center";
      // appearance
      newBlock.color = "#FFFFFF"; // safe default for dark backgrounds
      newBlock.size = 36; // visually clear without being loud
      // animation
      newBlock.animated = true; // future-proof flag
      newBlock.animation_type = "bounce"; // bounce | float | pulse
      newBlock.animation_speed = 1.2;
      newBlock.arrow_style = "single";
      newBlock.stagger = 0.15; // seconds
    }

    setLanding((prev) => ({
      ...prev,
      content_blocks: [...(prev.content_blocks || []), newBlock],
    }));

    setShowDropdown(false);
  };

  const removeBlock = (index) => {
    const updated = landing.content_blocks.filter((_, i) => i !== index);
    setLanding({ ...landing, content_blocks: updated });
  };

  async function loadVersions() {
    if (!landing?.id) return;
    const res = await loadTemplateVersions(landing.id);
    if (res.success) setVersions(res.templates);
  }

  const handleLoadVersion = async (e) => {
    const versionId = e.target.value;
    setSelectedVersion(versionId);
    if (!versionId) return;

    const res = await fetchTemplateSnapshot(versionId);

    if (!res.success) {
      toast.error("Could not load version");
      return;
    }

    // This injects the saved snapshot into the builder
    const snapshot = structuredClone(res.snapshot);

    // Ensure blocks exist
    let blocks = [];
    try {
      blocks = Array.isArray(snapshot.content_blocks)
        ? snapshot.content_blocks
        : JSON.parse(snapshot.content_blocks || "[]");
    } catch {
      blocks = [];
    }

    // Add missing runtime fields
    blocks = blocks.map((b) => ({
      collapsed: b.collapsed ?? true,
      ...b,
    }));

    snapshot.content_blocks = blocks;

    setLanding({
      ...snapshot,
      motion_settings: {
        ...landing.motion_settings,
        ...snapshot.motion_settings,
      },
    });

    toast.success("Version loaded! (not yet applied)");
  };

  const refreshLanding = async () => {
    try {
      const res = await axiosInstance.get(`/landing/builder/${user.id}`);

      const lp = res.data.landingPage;

      let blocks = [];
      try {
        blocks =
          typeof lp.content_blocks === "string"
            ? JSON.parse(lp.content_blocks)
            : lp.content_blocks || [];
      } catch {
        blocks = [];
      }

      blocks = blocks.map((b) => ({
        collapsed: b.collapsed ?? true,
        ...b,
      }));

      setLanding({
        ...lp,
        content_blocks: blocks,
        motion_settings: {
          ...landing.motion_settings,
          ...lp.motion_settings,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh landing");
    }
  };

  const handleApplyVersion = async () => {
    if (!selectedVersion) {
      toast.error("Select a version first.");
      return;
    }

    const snapshotRes = await fetchTemplateSnapshot(selectedVersion);
    if (!snapshotRes.success) {
      toast.error("Could not fetch snapshot.");
      return;
    }

    const applyRes = await restoreTemplate(landing.id, snapshotRes.snapshot);

    if (applyRes.success) {
      toast.success("Template restored successfully!");

      // Mark this version as the currently applied one
      setAppliedVersion(selectedVersion);

      // Reload the landing page so UI reflects changes
      refreshLanding();
    } else {
      toast.error("Failed to apply template");
    }
  };

  async function handleDeleteVersion() {
    toast.dismiss(); // clear any stacked toasts

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-3 text-center">
          <p className="text-sm font-medium text-gray-100">
            Delete this saved version?
          </p>

          <div className="flex justify-center gap-3 mt-2">
            {/* DELETE BUTTON */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await deleteTemplate(selectedVersion);

                  if (res.success) {
                    toast.success("Version deleted.", {
                      position: "bottom-right",
                      style: {
                        background: "#0B0F19",
                        color: "#E5E7EB",
                        border: "1px solid #1F2937",
                        borderRadius: "0.5rem",
                      },
                    });

                    setSelectedVersion("");
                    loadVersions();
                  } else {
                    toast.error("Failed to delete version.", {
                      position: "bottom-right",
                      style: {
                        background: "#0B0F19",
                        color: "#E5E7EB",
                        border: "1px solid #1F2937",
                        borderRadius: "0.5rem",
                      },
                    });
                  }
                } catch (err) {
                  console.error("Delete error:", err);
                  toast.error("Error deleting version.", {
                    position: "bottom-right",
                    style: {
                      background: "#0B0F19",
                      color: "#E5E7EB",
                      border: "1px solid #1F2937",
                      borderRadius: "0.5rem",
                    },
                  });
                } finally {
                  closeToast();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition"
            >
              Delete
            </button>

            {/* CANCEL BUTTON */}
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-xs font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
        style: {
          background: "#0B0F19",
          border: "1px solid #1F2937",
          color: "#E5E7EB",
          borderRadius: "0.75rem",
          padding: "14px 18px",
          width: "340px",
          textAlign: "center",
          marginTop: "80px",
        },
      },
    );
  }

  useEffect(() => {
    loadVersions();
  }, [landing?.id]);

  useEffect(() => {
    // Always restore scroll when this page mounts
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";
    return () => {
      // Clean up on unmount
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        const [landingRes, pdfRes] = await Promise.all([
          axiosInstance.get(`/landing/builder/${user.id}`),
          axiosInstance.get("/lead-magnets"),
        ]);

        const lp = landingRes.data.landingPage;

        const magnets = pdfRes.data.magnets || [];

        // parse blocks
        let blocks = [];
        try {
          blocks =
            typeof lp.content_blocks === "string"
              ? JSON.parse(lp.content_blocks)
              : lp.content_blocks || [];
        } catch {
          blocks = [];
        }

        blocks = blocks.map((b) => ({
          ...b, // keep existing properties first
          collapsed: b.collapsed ?? true,
          motion: b.motion ?? { disabled: false, preset: null },
        }));

        const normalizedMotionSettings = {
          enabled: lp.motion_settings?.enabled ?? false,
          preset: lp.motion_settings?.preset ?? "fade-up",
          duration: lp.motion_settings?.duration ?? 0.5,
          delay: lp.motion_settings?.delay ?? 0,
          stagger: lp.motion_settings?.stagger ?? 0.12,
          easing: lp.motion_settings?.easing ?? "ease-out",
          viewport_once: lp.motion_settings?.viewport_once ?? true,
          panel_open: lp.motion_settings?.panel_open ?? false,
        };

        setLanding({
          ...lp,
          motion_settings: normalizedMotionSettings,
          content_blocks: blocks,
        });
        setPdfList(magnets);
        setFontName(lp.font || "Montserrat");
        setFontFile(lp.font_file || "");

        if (typeof lp.show_download_button === "boolean") {
          setShowDownloadButton(lp.show_download_button);
        }

        // ✅ restore cover and theme
        if (lp.cover_image_url) setCoverPreview(lp.cover_image_url);
        setBgTheme(
          lp.bg_theme || "linear-gradient(to bottom, #ffffff, #F285C3)",
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load landing data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".add-section-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  if (loading)
    return (
      <div
        className="
      flex flex-col items-center justify-center min-h-screen 
      bg-dashboard-bg-light dark:bg-dashboard-bg-dark
      text-dashboard-text-light dark:text-dashboard-text-dark
    "
      >
        <div className="relative">
          {/* Subtle pulse ring */}
          <div
            className="
          absolute inset-0 rounded-full
          bg-dashboard-muted-light/20 dark:bg-dashboard-muted-dark/20
          blur-2xl animate-ping
        "
          ></div>

          {/* Spinner */}
          <div
            className="
          w-16 h-16
          border-4
          border-dashboard-border-light dark:border-dashboard-border-dark
          border-t-green
          rounded-full
          animate-spin
        "
          ></div>
        </div>

        <p
          className="
        mt-6 text-lg font-semibold tracking-wide animate-pulse
        text-dashboard-text-light dark:text-dashboard-text-dark
      "
        >
          Building your page...
        </p>

        <p
          className="
        text-sm mt-2
        text-dashboard-muted-light dark:text-dashboard-muted-dark
      "
        >
          The Messy Attic is fetching your latest content blocks.
        </p>
      </div>
    );

  if (!loading && user?.pro_status !== "active") {
    return (
      <div className="text-center mt-20 text-gray-400">
        <h2 className="text-2xl font-bold">Upgrade Required</h2>
        <p className="mt-2">
          This feature is available only for PRO members.
          <a
            href="/plans"
            className="text-[#F285C3] underline ml-1 hover:text-[#e070ad]"
          >
            Upgrade now
          </a>
        </p>
      </div>
    );
  }

  if (!landing) {
    return (
      <div className="text-center mt-20 text-gray-400">
        <h2 className="text-2xl font-bold">No Landing Page Found</h2>
        <p className="mt-2">We couldn’t load your landing page data.</p>
      </div>
    );
  }

  // 🔍 Validate YouTube or Vimeo URLs (normal + embed)
  const isValidVideoUrl = (url) => {
    if (!url) return true; // allow empty

    const ytPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}($|[?&])/;
    const vimeoPattern =
      /^(https?:\/\/)?(www\.)?(vimeo\.com\/(\d{6,12}|video\/\d{6,12}))($|[?&])/;

    return ytPattern.test(url) || vimeoPattern.test(url);
  };

  const handleSave = async (e) => {
    const submitter = e?.nativeEvent?.submitter;

    // 🚫 Block ALL submits except Save
    if (!submitter || submitter.name !== "save-landing") {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    try {
      // 🧩 Normalize content_blocks to always be an array
      let blocks = landing.content_blocks;
      if (typeof blocks === "string") {
        try {
          blocks = JSON.parse(blocks);
        } catch {
          console.warn("Invalid content_blocks string, resetting to []");
          blocks = [];
        }
      }

      // 🧠 Validate all video URLs before saving
      const invalidVideos = blocks
        .filter((b) => b.type === "video" && b.url && !isValidVideoUrl(b.url))
        .map((b, i) => `Video Block ${i + 1}`);

      if (invalidVideos.length > 0) {
        toast.error(
          `Invalid video URLs in: ${invalidVideos.join(", ")}. Please use YouTube or Vimeo links.`,
        );
        return;
      }
      blocks = blocks.map((b) =>
        b.type === "video" ? { ...b, url: normalizeVideoUrl(b.url) } : b,
      );

      await axiosInstance.put(
        `https://themessyattic.com/api/landing/update/${landing.id}`,
        {
          ...landing,
          font: fontName, // ✅ override stale landing.font
          font_file: fontFile,
          content_blocks: blocks,
          pdf_url: landing.pdf_url,
          cover_image_url: landing.cover_image_url,
          logo_url: landing.logo_url,
          show_download_button: showDownloadButton,
          motion_settings: landing.motion_settings,
        },
      );

      toast.success("Landing page saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving landing page");
    }
  };

  const handleSaveTemplate = () => {
    // If a version is selected, preload its real name
    if (selectedVersion) {
      const existing = versions.find((v) => v.id === selectedVersion);

      if (existing) {
        setTemplateName(existing.name); // preload real version name
      }
    } else {
      // No version selected — user is working on an unsaved version
      setTemplateName(`Version ${versions.length + 1}`);
    }

    setShowSaveModal(true);
  };

  const confirmSaveTemplate = async () => {
    const trimmed = templateName.trim();
    if (!trimmed) {
      toast.error("Please enter a name");
      return;
    }

    const MAX_VERSIONS = isPro ? 30 : 10;

    if (!selectedVersion && versions.length >= MAX_VERSIONS) {
      toast.error(
        isPro
          ? "You’ve reached the maximum of 30 saved versions."
          : "Free accounts can save up to 10 versions. Upgrade to Pro to save more.",
      );
      return;
    }

    // See if this name already exists
    const existing = versions.find((v) => v.name === trimmed);

    let res;

    if (existing) {
      // UPDATE EXISTING VERSION
      res = await saveTemplate(
        landing.id,
        trimmed,
        landing,
        existing.id, // <-- version ID for update
      );
    } else {
      // CREATE NEW VERSION
      res = await saveTemplate(landing.id, trimmed, landing);
    }

    if (res.success) {
      toast.success(existing ? "Version updated!" : "New version saved!", {
        position: "bottom-right",
      });
      loadVersions();
      setShowSaveModal(false);
      setTemplateName("");
    } else {
      toast.error("Could not save version.", {
        position: "bottom-right",
      });
    }
  };

  // 🎨 Determine the selected background theme
  const selectedTheme =
    bgTheme?.includes("gradient") || bgTheme?.startsWith("#")
      ? bgTheme
      : [...colorThemes, ...gradientThemes].find((t) => t.name === bgTheme)
          ?.preview || "linear-gradient(to bottom, #ffffff, #F285C3)";

  return (
    <div
      className="
    min-h-screen
    p-1 sm:p-6 md:p-10
    overflow-y-scroll
    bg-dashboard-bg-light dark:bg-dashboard-bg-dark
    text-dashboard-text-light dark:text-dashboard-text-dark
  "
    >
      <div
        className="
    max-w-4xl mx-auto
    rounded-2xl
    p-3 sm:p-8
    shadow-lg
    bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
    border border-dashboard-border-light dark:border-dashboard-border-dark
  "
      >
        <h1
          className="
    text-2xl font-extrabold text-center mb-8
    flex items-center justify-center gap-3
    text-dashboard-text-light dark:text-dashboard-text-dark
  "
        >
          <Wand2 className="w-6 h-6 text-dashboard-accent-light dark:text-dashboard-accent-dark" />
          Landing Page Builder
        </h1>
        {/* Version Controls */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Headline */}
          <div>
            <PageUrlUsernameField landing={landing} setLanding={setLanding} />

            <VersionControls
              versions={versions}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
              appliedVersion={appliedVersion}
              handleLoadVersion={handleLoadVersion}
              handleApplyVersion={handleApplyVersion}
              handleDeleteVersion={handleDeleteVersion}
            />

            <h1
              className="
              text-2xl font-extrabold text-center mb-8
              text-dashboard-text-light dark:text-dashboard-text-dark
              flex items-center justify-center gap-3
            "
            >
              Page Builder
            </h1>

            <div className="flex justify-end mb-6">
              <AddSectionButton addBlock={addBlock} canAddBlock={canAddBlock} />
            </div>

            {isPro ? (
              <AnimationSettingsPanel
                landing={landing}
                setLanding={setLanding}
              />
            ) : (
              <div
                className="
                relative mb-4 rounded-lg
                border border-dashboard-border-light dark:border-dashboard-border-dark
                bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                min-h-[160px]
              "
              >
                {/* Blurred preview */}
                <div className="pointer-events-none blur-sm opacity-60">
                  <AnimationSettingsPanel
                    landing={landing}
                    setLanding={setLanding}
                  />
                </div>

                {/* Lock overlay */}
                <div
                  className="
                    absolute inset-0
                    flex items-center justify-center
                    rounded-lg
                    bg-dashboard-bg-light/80 dark:bg-dashboard-bg-dark/80
                    py-8
                  "
                >
                  <div className="max-w-sm text-center px-6">
                    <div className="text-lg font-semibold mb-2 text-dashboard-text-light dark:text-dashboard-text-dark">
                      Animation Settings
                    </div>
                    <p className="text-sm text-gray-300 mb-4">
                      Animate blocks on scroll, control motion presets, delays,
                      stagger effects, and easing.
                    </p>

                    <button
                      onClick={() => navigate("/plans")}
                      className="px-5 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 font-semibold text-sm"
                    >
                      Unlock with Pro
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 🔽 Collapse / Expand All Blocks */}
            <div
              onClick={() => setBlocksHidden(!blocksHidden)}
              className="
              cursor-pointer
              px-4 py-3 mb-4
              rounded-lg
              flex justify-between items-center
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              text-dashboard-text-light dark:text-dashboard-text-dark
            "
            >
              <span className="font-semibold">
                {blocksHidden ? "Open All Blocks" : "Hide All Blocks"}
              </span>

              <span
                className={`transform transition-transform ${
                  blocksHidden ? "rotate-0" : "rotate-180"
                }`}
              >
                ▼
              </span>
            </div>

            {/* DndContext */}
            {!blocksHidden && (
              <div
                className="
                space-y-4 mb-12 w-full
                rounded-xl p-5 shadow-inner
                bg-dashboard-bg-light dark:bg-dashboard-bg-dark
                border border-dashboard-border-light dark:border-dashboard-border-dark
              "
              >
                {landing.content_blocks
                  .filter((b) => b && b.type)
                  .map((block, index) => (
                    <React.Fragment key={block.id}>
                      <MemoizedSortableBlock
                        id={block.id}
                        block={block}
                        index={index}
                        updateBlock={updateBlock}
                        removeBlock={removeBlock}
                        moveBlockUp={moveBlockUp}
                        moveBlockDown={moveBlockDown}
                        moveChildUp={moveChildUp}
                        moveChildDown={moveChildDown}
                        activeChild={activeChild}
                        setActiveChild={setActiveChild}
                        setActiveRoot={setActiveRoot} // ✅ ADD THIS
                        activeRoot={activeRoot}
                        removeFromContainer={removeFromContainer}
                        bgTheme={bgTheme}
                        pdfList={pdfList}
                        landing={landing}
                        openAIModal={openAIModal}
                        offerContext={landing?.offer_context}
                      />
                    </React.Fragment>
                  ))}
              </div>
            )}
          </div>

          {/* 🧾 PDF Attachment */}
          <div
            className="
            w-full rounded-xl p-5 mb-10 pb-12 shadow-inner
            bg-dashboard-bg-light dark:bg-dashboard-bg-dark
            border border-dashboard-border-light dark:border-dashboard-border-dark
          "
          >
            <PdfSelector
              pdfList={pdfList}
              landing={landing}
              setLanding={setLanding}
              showPdfSection={showPdfSection}
              setShowPdfSection={setShowPdfSection}
              coverPreview={coverPreview}
              setCoverPreview={setCoverPreview}
              coverLoading={coverLoading}
              setCoverLoading={setCoverLoading}
            />
            <ToggleDownloadButton
              showDownloadButton={showDownloadButton}
              setShowDownloadButton={setShowDownloadButton}
            />
          </div>

          {isPro ? (
            <LogoUploader
              landing={landing}
              setLanding={setLanding}
              showLogoSection={showLogoSection}
              setShowLogoSection={setShowLogoSection}
            />
          ) : (
            <div
              className="
              mt-6 p-4 rounded-xl text-center
              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
            "
            >
              <p className="text-sm font-medium text-dashboard-text-light dark:text-dashboard-text-dark">
                Custom branding is a{" "}
                <span className="text-green font-semibold">Pro</span> feature
              </p>
              <p className="text-xs mt-1 text-dashboard-muted-light dark:text-dashboard-muted-dark">
                Upgrade to Pro to upload and display your brand logo.
              </p>
              <a
                href="/plans"
                className="inline-block mt-3 text-sm px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Upgrade to Pro
              </a>
            </div>
          )}

          {/* Theme & Font Choosers */}
          <ThemeAndFontControls
            landing={landing}
            setLanding={setLanding}
            bgTheme={bgTheme}
            setBgTheme={setBgTheme}
            fontName={fontName}
            setFontName={setFontName}
            fontFile={fontFile}
            setFontFile={setFontFile}
            isPro={isPro}
          />

          {/* 🖋 Font Color Pickers */}
          <TextColorControls landing={landing} setLanding={setLanding} />

          {/* ✅ Live Preview */}

          <PreviewPanel
            showPreviewSection={showPreviewSection}
            setShowPreviewSection={setShowPreviewSection}
            landing={landing}
            selectedTheme={selectedTheme}
            fontName={fontName}
            bgTheme={bgTheme}
            user={user}
            updateBlock={updateBlock}
            adjustForLandingOverlay={adjustForLandingOverlay}
            blendColors={blendColors}
          />

          {/* Toggle Download Button */}

          {/* Save + View */}
          <BottomActionsBar
            landing={landing}
            user={user}
            handleSaveTemplate={handleSaveTemplate}
          />
        </form>
      </div>
      <SaveVersionModal
        isOpen={showSaveModal}
        name={templateName}
        setName={setTemplateName}
        onCancel={() => {
          setShowSaveModal(false);
          setTemplateName("");
        }}
        onConfirm={confirmSaveTemplate}
      />
      {aiContext && (
        <AICopyModal
          aiContext={aiContext}
          onApply={(newText) => {
            if (!newText?.trim()) return;

            const { blockType, blockIndex, containerIndex, updateChildBlock } =
              aiContext;

            // FAQ handling
            if (blockType === "faq") {
              const parsedItems = newText
                .split(/\n\s*\n/)
                .map((chunk) => {
                  const qMatch = chunk.match(/Q:\s*(.+)/i);
                  const aMatch = chunk.match(/A:\s*(.+)/i);
                  if (!qMatch || !aMatch) return null;

                  return {
                    q: qMatch[1].trim(),
                    a: aMatch[1].trim(),
                    open: false,
                  };
                })
                .filter(Boolean);

              if (containerIndex !== undefined) {
                updateChildBlock(blockIndex, "items", parsedItems);
              } else {
                updateBlock(blockIndex, "items", parsedItems);
              }

              // Offer long description
            } else if (blockType === "offer_long_description") {
              if (containerIndex !== undefined) {
                updateChildBlock(blockIndex, "long_text", newText);
                updateChildBlock(blockIndex, "use_long_description", true);
              } else {
                updateBlock(blockIndex, "long_text", newText);
                updateBlock(blockIndex, "use_long_description", true);
              }

              // DEFAULT TEXT BLOCKS (heading, paragraph, etc)
            } else {
              if (
                containerIndex !== undefined &&
                typeof updateChildBlock === "function"
              ) {
                updateChildBlock(blockIndex, "text", newText);
              } else {
                updateBlock(blockIndex, "text", newText);
              }
            }

            setAIContext(null);
          }}
          onClose={() => setAIContext(null)}
        />
      )}
      {activeChild && (
        <div
          className="
      fixed bottom-4 left-1/2 -translate-x-1/2 z-50
      flex gap-4 bg-green/90 px-4 py-3 rounded-full
      shadow-xl
    "
        >
          <button
            type="button"
            onClick={() =>
              moveChildUp(activeChild.containerIndex, activeChild.childId)
            }
            className="text-black text-xl px-3"
          >
            ↑
          </button>

          <button
            type="button"
            onClick={() =>
              moveChildDown(activeChild.containerIndex, activeChild.childId)
            }
            className="text-black text-xl px-3"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => {
              removeFromContainer(
                activeChild.containerIndex,
                activeChild.childId,
              );
              setActiveChild(null);
            }}
            className="text-black text-sm px-3"
          >
            Remove
          </button>
        </div>
      )}
      {validActiveRoot && (
        <div
          className="
      fixed bottom-4 left-1/2 -translate-x-1/2 z-50
      flex gap-3 bg-green/90 px-4 py-3 rounded-full
      shadow-xl
    "
        >
          <button
            type="button"
            onClick={() => setShowContainerPicker(true)}
            className="text-black text-sm px-3"
          >
            Move into section
          </button>

          <button
            type="button"
            onClick={() => setActiveRoot(null)}
            className="text-black text-sm px-3"
          >
            Cancel
          </button>
        </div>
      )}
      {showContainerPicker && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-[#0f1624] rounded-xl p-5 w-80">
            <h3 className="text-white font-semibold mb-3">Move into section</h3>

            {landing.content_blocks
              .filter((b) => b.type === "container")
              .map((container, i) => (
                <button
                  key={container.id}
                  onClick={() => {
                    setShowContainerPicker(false);
                    moveRootIntoContainer(activeRoot.blockIndex, i);
                    setActiveRoot(null);
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-white/10 text-white text-sm"
                >
                  {container.title || "Untitled Section"}
                </button>
              ))}

            <button
              onClick={() => setShowContainerPicker(false)}
              className="mt-3 text-sm text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

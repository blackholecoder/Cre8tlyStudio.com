import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../admin/AuthContext";
import { colorThemes, gradientThemes } from "../../constants";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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

export default function LandingPageBuilder() {
  const { user } = useAuth();
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

  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [appliedVersion, setAppliedVersion] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const [blocksHidden, setBlocksHidden] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const findLocationById = (blocks, id) => {
    const rootIndex = blocks.findIndex((b) => b.id === id);
    if (rootIndex !== -1) {
      return { parentId: null, index: rootIndex, block: blocks[rootIndex] };
    }

    for (const container of blocks) {
      if (container.type !== "container") continue;
      const childIndex = (container.children || []).findIndex(
        (c) => c.id === id
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
            }
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
          }
    );
  };

  // const handleDragEnd = ({ active, over }) => {
  //   if (!over || active.id === over.id) return;

  //   setLanding((prev) => {
  //     console.log(JSON.stringify(landing.content_blocks, null, 2));
  //     const blocks = prev.content_blocks;

  //     const activeLoc = findLocationById(blocks, active.id);
  //     if (!activeLoc) return prev;

  //     const overId = over.id;
  //     const overLoc = findLocationById(blocks, overId);

  //     // CASE 1: Dropped on container body
  //     if (
  //       typeof overId === "string" &&
  //       overId.startsWith("container-") &&
  //       !overLoc
  //     ) {
  //       const containerId = overId.replace("container-", "");
  //       const container = blocks.find((b) => b.id === containerId);
  //       if (!container) return prev;

  //       const { removed, next } = removeAtLocation(blocks, activeLoc);

  //       return {
  //         ...prev,
  //         content_blocks: insertAtLocation(
  //           next,
  //           {
  //             parentId: container.id,
  //             index: container.children?.length || 0,
  //           },
  //           removed
  //         ),
  //       };
  //     }

  //     if (!overLoc) return prev;

  //     const { removed, next } = removeAtLocation(blocks, activeLoc);

  //     let insertIndex = overLoc.index;
  //     let isAppend = false;

  //     // ✅ Detect append-to-end
  //     if (overLoc.parentId) {
  //       const parent = blocks.find((b) => b.id === overLoc.parentId);
  //       if (parent) {
  //         const isLast = overLoc.index === (parent.children?.length || 0) - 1;

  //         if (isLast) {
  //           insertIndex = parent.children.length;
  //           isAppend = true;
  //         }
  //       }
  //     }

  //     // ✅ ONLY adjust when NOT appending
  //     if (
  //       !isAppend &&
  //       activeLoc.parentId === overLoc.parentId &&
  //       activeLoc.index < overLoc.index
  //     ) {
  //       insertIndex -= 1;
  //     }

  //     return {
  //       ...prev,
  //       content_blocks: insertAtLocation(
  //         next,
  //         {
  //           parentId: overLoc.parentId,
  //           index: insertIndex,
  //         },
  //         removed
  //       ),
  //     };
  //   });
  // };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setLanding((prev) => {
      const blocks = prev.content_blocks;

      const activeLoc = findLocationById(blocks, active.id);
      if (!activeLoc) return prev;

      const overId = over.id;
      const overLoc = findLocationById(blocks, overId);

      // 🔒 Determine target BEFORE removing
      let targetParentId = null;
      let targetIndex = null;

      // ─────────────────────────────
      // CASE 1: Dropped on container body
      // ─────────────────────────────
      if (
        typeof overId === "string" &&
        overId.startsWith("container-") &&
        !overLoc
      ) {
        const containerId = overId.replace("container-", "");
        const container = blocks.find((b) => b.id === containerId);
        if (!container) return prev;

        targetParentId = container.id;
        targetIndex = container.children?.length || 0;
      }

      // ─────────────────────────────
      // CASE 2: Dropped on a block
      // ─────────────────────────────
      else if (overLoc) {
        targetParentId = overLoc.parentId;
        targetIndex = overLoc.index;

        if (activeLoc.block.type === "container" && overLoc.parentId) {
          targetParentId = null;
          targetIndex = blocks.length;
        } else {
          targetParentId = overLoc.parentId;
          targetIndex = overLoc.index;
        }

        // ✅ append-to-end fix
        if (overLoc.parentId) {
          const parent = blocks.find((b) => b.id === overLoc.parentId);
          if (parent && overLoc.index === (parent.children?.length || 0) - 1) {
            targetIndex = parent.children.length;
          }
        }

        // ✅ downward adjustment (only when needed)
        if (
          activeLoc.parentId === overLoc.parentId &&
          activeLoc.index < overLoc.index
        ) {
          targetIndex -= 1;
        }
      }

      // ❌ SAFETY: no valid target → do nothing
      if (targetIndex === null) return prev;

      // 🧩 NOW it is safe to remove
      const { removed, next } = removeAtLocation(blocks, activeLoc);

      return {
        ...prev,
        content_blocks: insertAtLocation(
          next,
          {
            parentId: targetParentId,
            index: targetIndex,
          },
          removed
        ),
      };
    });
  };

  const updateBlock = React.useCallback((index, key, value) => {
    setLanding((prev) => {
      const updatedBlocks = prev.content_blocks.map((b, i) =>
        i === index ? { ...b, [key]: value } : b
      );
      return { ...prev, content_blocks: updatedBlocks };
    });
  }, []);

  const addBlock = (type) => {
    if (!type) return; // prevent invalid type

    let newBlock = {
      id: crypto.randomUUID(),
      type,
      enabled: true,
      padding: 20,
      alignment: "left",
      bulleted: false,
      collapsed: true,
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
        Date.now() + 7 * 24 * 60 * 60 * 1000
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
    }

    if (type === "referral_button") {
      newBlock.text = "Join Cre8tly Studio";
      newBlock.button_color = "#7bed9f";
      newBlock.text_color = "#000000";
      newBlock.alignment = "center";
      newBlock.collapsed = false;
    }

    // ⭐ Verified Reviews Block
    if (type === "verified_reviews") {
      newBlock.title = "Verified Buyer Reviews";
      newBlock.text_color = "#FFFFFF";
      newBlock.bg_color = "rgba(0,0,0,0.3)";
      newBlock.alignment = "center";
      newBlock.collapsed = false;
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

    if (type === "feature_offers_3") {
      newBlock.items = [
        {
          image_url: "",
          cover_url: "",
          title: "Offer One",
          text: "Short description of this offer.",
          price: 10,
          button_text: "Buy Now",
          button_color: "#22c55e",
          pdf_url: "",
          use_pdf_cover: false,
        },
        {
          image_url: "",
          cover_url: "",
          title: "Offer Two",
          text: "Short description of this offer.",
          price: 20,
          button_text: "Buy Now",
          button_color: "#22c55e",
          pdf_url: "",
          use_pdf_cover: false,
        },
      ];

      // Grid background & gradient controls
      newBlock.bg_color = "rgba(0,0,0,0.4)";
      newBlock.use_gradient = false;
      newBlock.gradient_start = "#F285C3";
      newBlock.gradient_end = "#7bed9f";
      newBlock.gradient_direction = "90deg";
      newBlock.match_main_bg = false;
      newBlock.use_no_bg = false;

      // Shared button text color for all three buttons
      newBlock.button_text_color = "#000000";

      newBlock.alignment = "center";
      newBlock.padding = 20;
      newBlock.collapsed = false;
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

      newBlock.waveform_color = "#7bed9f";
      newBlock.progress_color = "#22c55e";

      newBlock.playlist = [];
      newBlock.show_waveform = true;
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

    setLanding(snapshot);

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

      setLanding({ ...lp, content_blocks: blocks });
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
              onClick={async () => {
                try {
                  const res = await deleteTemplate(selectedVersion);

                  if (res.success) {
                    toast.success("Version deleted.", {
                      position: "top-right",
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
                      position: "top-right",
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
                    position: "top-right",
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
        position: "top-right",
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
      }
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
          collapsed: b.collapsed ?? true,
          ...b,
        }));

        setLanding({ ...lp, content_blocks: blocks });
        setPdfList(magnets);
        setFontName(lp.font || "Montserrat");
        setFontFile(lp.font_file || "");

        if (typeof lp.show_download_button === "boolean") {
          setShowDownloadButton(lp.show_download_button);
        }

        // ✅ restore cover and theme
        if (lp.cover_image_url) setCoverPreview(lp.cover_image_url);
        setBgTheme(
          lp.bg_theme || "linear-gradient(to bottom, #ffffff, #F285C3)"
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="relative">
          {/* Glowing pulse ring */}
          <div className="absolute inset-0 rounded-full bg-blue/30 blur-2xl animate-ping"></div>

          {/* Center spinner */}
          <div className="w-16 h-16 border-4 border-t-transparent border-green rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <p className="mt-6 text-lg font-semibold tracking-wide text-silver animate-pulse">
          Building your page...
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Cre8tly Studio is fetching your latest content blocks.
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
          `Invalid video URLs in: ${invalidVideos.join(", ")}. Please use YouTube or Vimeo links.`
        );
        return; // ❌ stop saving
      }
      blocks = blocks.map((b) =>
        b.type === "video" ? { ...b, url: normalizeVideoUrl(b.url) } : b
      );

      await axiosInstance.put(
        `https://cre8tlystudio.com/api/landing/update/${landing.id}`,
        {
          ...landing,
          content_blocks: blocks,
          pdf_url: landing.pdf_url,
          cover_image_url: landing.cover_image_url,
          logo_url: landing.logo_url,
          show_download_button: showDownloadButton,
        }
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

    // See if this name already exists
    const existing = versions.find((v) => v.name === trimmed);

    let res;

    if (existing) {
      // UPDATE EXISTING VERSION
      res = await saveTemplate(
        landing.id,
        trimmed,
        landing,
        existing.id // <-- version ID for update
      );
    } else {
      // CREATE NEW VERSION
      res = await saveTemplate(landing.id, trimmed, landing);
    }

    if (res.success) {
      toast.success(existing ? "Version updated!" : "New version saved!");
      loadVersions();
      setShowSaveModal(false);
      setTemplateName("");
    } else {
      toast.error("Could not save version.");
    }
  };

  // 🎨 Determine the selected background theme
  const selectedTheme =
    bgTheme?.includes("gradient") || bgTheme?.startsWith("#")
      ? bgTheme
      : [...colorThemes, ...gradientThemes].find((t) => t.name === bgTheme)
          ?.preview || "linear-gradient(to bottom, #ffffff, #F285C3)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-900 p-3 sm:p-6 md:p-10 overflow-y-scroll">
      <div className="max-w-4xl mx-auto bg-black/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-center mb-8 text-silver flex items-center justify-center gap-3">
          <Wand2 className="w-6 h-6 text-green" />
          Landing Page Builder
        </h1>

        {/* Version Controls */}

        <VersionControls
          versions={versions}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
          appliedVersion={appliedVersion}
          handleLoadVersion={handleLoadVersion}
          handleApplyVersion={handleApplyVersion}
          handleDeleteVersion={handleDeleteVersion}
        />

        <form onSubmit={handleSave} className="space-y-4">
          {/* Headline */}
          <div>
            <div className="max-w-[40%]">
              <label className="block font-semibold mb-1 text-silver ">
                Page Url Username
              </label>
              <input
                type="text"
                value={landing.username || ""}
                onChange={(e) =>
                  setLanding({ ...landing, username: e.target.value })
                }
                onBlur={async () => {
                  if (landing.username?.trim()?.length >= 3) {
                    try {
                      const res = await axiosInstance.get(
                        `/landing/check-username/${landing.username.trim()}`
                      );
                      toast[res.data.available ? "success" : "error"](
                        res.data.message
                      );
                    } catch {
                      toast.error("Error checking username");
                    }
                  }
                }}
                placeholder="e.g. cre8tlydesigns"
                className="w-[40%] border border-gray-300 rounded-lg px-4 py-2"
              />
              <p className="text-xs text-gray-200 mt-1 mb-10">
                This will be used for your page URL:{" "}
                <span className="text-yellow">
                  {landing.username
                    ? `https://${landing.username}.cre8tlystudio.com`
                    : "https://yourname.cre8tlystudio.com"}
                </span>
              </p>
            </div>

            <h1 className="text-2xl font-extrabold text-center mb-8 text-silver flex items-center justify-center gap-3">
              Content
            </h1>
            <div className="flex justify-end mb-6">
              <AddSectionButton addBlock={addBlock} />
            </div>
            {/* 🔽 Collapse / Expand All Blocks */}
            <div
              className="cursor-pointer bg-black/80 text-white px-4 py-3 rounded-lg border border-gray-600 mb-4 flex justify-between items-center"
              onClick={() => setBlocksHidden(!blocksHidden)}
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
            <div className="space-y-4 mb-28">
              {!blocksHidden && (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={landing.content_blocks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {landing.content_blocks
                      .filter((b) => b && b.type) // ✅ ignore empty / invalid blocks
                      .map((block, index) => (
                        <MemoizedSortableBlock
                          key={block.id}
                          id={block.id}
                          block={block}
                          index={index}
                          updateBlock={updateBlock}
                          removeBlock={removeBlock}
                          bgTheme={bgTheme}
                          pdfList={pdfList}
                          landing={landing}
                        />
                      ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {/* 🧾 PDF Attachment */}
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

          <LogoUploader landing={landing} setLanding={setLanding} />

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
          <ToggleDownloadButton
            showDownloadButton={showDownloadButton}
            setShowDownloadButton={setShowDownloadButton}
          />

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
    </div>
  );
}

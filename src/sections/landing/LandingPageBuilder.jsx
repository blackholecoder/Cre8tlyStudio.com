import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import FontSelector from "../../components/prompt/FontSelector";
import ColorThemeChooser from "../../components/ColorThemeChooser";
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
import CountdownTimerPreview from "./Timer";
import {
  fetchTemplateSnapshot,
  restoreTemplate,
  saveTemplate,
  loadTemplateVersions,
  deleteTemplate,
} from "../../api/saveTemplates";
import SaveVersionModal from "../../components/landing/SaveVersionModal";

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
  const [showDownloadButton, setShowDownloadButton] = useState(true);

  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const pageBuilderThemes = [...colorThemes, ...gradientThemes];

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
      padding: 20,
      alignment: "left",
      bulleted: false,
      collapsed: true,
    };

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
      // refresh landing page
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
        setShowDownloadButton(lp.show_download_button !== false);

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

  const handleSaveTemplate = async () => {
    setShowSaveModal(true); // open modal instead of prompt
  };

  const confirmSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const res = await saveTemplate(landing.id, templateName.trim(), landing);

    if (res.success) {
      toast.success("Template version saved!");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-900 p-10 overflow-y-scroll">
      <div className="max-w-4xl mx-auto bg-black/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-center mb-8 text-silver flex items-center justify-center gap-3">
          <Wand2 className="w-6 h-6 text-green" />
          Landing Page Builder
        </h1>

        {/* Version Controls */}
        {/* Version Controls */}
        <div className="w-full bg-[#0f1624]/80 border border-gray-700 rounded-xl p-5 mb-10 shadow-inner">
          {/* Dropdown (Top) */}
          <div className="relative w-full mb-6">
            <select
              className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg border border-gray-600 
                 focus:ring-2 focus:ring-green appearance-none"
              value={selectedVersion}
              onChange={handleLoadVersion}
            >
              <option value="">Load saved version…</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({new Date(v.created_at).toLocaleString()})
                </option>
              ))}
            </select>

            {/* Chevron */}
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>

          {/* Buttons (Bottom Row) */}
          <div className="flex items-center justify-end gap-4">
            <button
              className="bg-green text-black font-semibold px-6 py-2 rounded-lg shadow hover:bg-green/90 transition text-sm"
              onClick={handleApplyVersion}
            >
              Apply
            </button>

            {selectedVersion && (
              <button
                onClick={handleDeleteVersion}
                className="px-6 py-2 rounded-lg bg-red-600/20 border border-red-500 text-red-300 
               hover:bg-red-600/30 hover:text-red-200 transition text-sm font-semibold"
              >
                Delete
              </button>
            )}
          </div>
        </div>

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
                        `https://cre8tlystudio.com/api/landing/check-username/${landing.username.trim()}`
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
            {/* DndContext */}
            <div className="space-y-4 mb-28">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (!over || active.id === over.id) return;
                  const oldIndex = landing.content_blocks.findIndex(
                    (b) => b.id === active.id
                  );
                  const newIndex = landing.content_blocks.findIndex(
                    (b) => b.id === over.id
                  );
                  const newBlocks = arrayMove(
                    landing.content_blocks,
                    oldIndex,
                    newIndex
                  );
                  setLanding((prev) => ({
                    ...prev,
                    content_blocks: newBlocks,
                  }));
                }}
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
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* 🧾 PDF Attachment */}
          <div className="mt-1 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 transition-all hover:border-silver/60">
            {/* Header toggle */}
            <div
              onClick={() => setShowPdfSection(!showPdfSection)}
              className="flex items-center justify-between px-6 py-5 cursor-pointer select-none"
            >
              <h3 className="text-lg font-semibold text-silver tracking-wide">
                Choose PDF to Offer
              </h3>
              <span
                className={`text-gray-400 text-sm transform transition-transform duration-300 ${
                  showPdfSection ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>

            {/* Animated content */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showPdfSection
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6">
                <span className="text-xs text-gray-400 italic block mb-5">
                  Only completed PDFs are shown.
                  <br />
                  If you’ve enabled the Stripe Button Block, this image will be
                  used as the cover for every sellable PDF.
                </span>

                {/* PDF Dropdown */}
                <div className="relative">
                  <select
                    value={landing.pdf_url || ""}
                    onChange={async (e) => {
                      const selectedUrl = e.target.value;
                      setLanding((prev) => ({ ...prev, pdf_url: selectedUrl }));
                      setCoverPreview("");
                      setCoverLoading(true);

                      if (!selectedUrl) {
                        setCoverLoading(false);
                        return;
                      }

                      try {
                        const res = await axiosInstance.get(
                          `https://cre8tlystudio.com/api/landing/lead-magnets/cover?pdfUrl=${encodeURIComponent(selectedUrl)}`
                        );

                        if (res.data.success && res.data.cover_image) {
                          setCoverPreview(res.data.cover_image);
                          setLanding((prev) => ({
                            ...prev,
                            cover_image_url: res.data.cover_image,
                          }));
                        }
                      } catch (err) {
                        console.error("Error loading cover image:", err);
                      } finally {
                        setCoverLoading(false);
                      }
                    }}
                    className="w-full border border-gray-600 bg-[#0F172A] text-gray-200 rounded-lg px-4 py-3 appearance-none cursor-pointer focus:ring-2 focus:ring-silver focus:outline-none"
                  >
                    <option value="">-- Select a Completed PDF --</option>
                    {pdfList
                      .filter((lm) => lm.status === "completed" && lm.pdf_url)
                      .map((lm) => (
                        <option key={lm.id} value={lm.pdf_url}>
                          {lm.title || "Untitled PDF"} — (Ready)
                        </option>
                      ))}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8.25 9.75L12 13.5l3.75-3.75"
                    />
                  </svg>
                </div>

                {/* PDF Info */}
                {landing.pdf_url && (
                  <div className="mt-4 flex flex-col items-center text-center">
                    <p className="text-xs text-gray-400 mb-2">
                      Selected File:
                      <a
                        href={landing.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green font-medium ml-1 underline hover:text-green transition"
                      >
                        Preview PDF
                      </a>
                    </p>
                  </div>
                )}
                <div
                  className="mt-6 text-center bg-[#1f2937]/60 border border-gray-700 rounded-xl p-5 shadow-inner relative flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
                  style={{ height: "340px" }} // 👈 fixed height (adjust as needed)
                >
                  {coverLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]/70 backdrop-blur-sm transition-opacity duration-500">
                      {/* Spinner */}
                      <div className="w-12 h-12 border-4 border-gray-500 border-t-green rounded-full animate-spin"></div>
                      <p className="text-gray-400 text-sm mt-3">
                        Loading cover preview...
                      </p>
                    </div>
                  ) : coverPreview ? (
                    <div className="flex flex-col items-center justify-center w-full h-full transition-opacity duration-700 ease-in-out">
                      <p className="text-sm text-gray-300 mb-3 font-semibold tracking-wide">
                        PDF Cover Preview
                      </p>
                      <img
                        src={coverPreview}
                        alt="PDF Cover"
                        className="h-48 object-contain rounded-lg shadow-md border border-gray-600 mx-auto transition-transform duration-700 ease-in-out"
                        style={{
                          opacity: 1,
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-3">
                        This cover will appear on your landing page
                        automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <p className="text-gray-500 text-sm italic">
                        No PDF cover selected yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 📘 Cover Preview */}
          </div>

          <div className="mt-12 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 transition-all hover:border-silver/60">
            <div className="flex items-center justify-between mb-5">
              <label className="text-lg font-semibold text-silver tracking-wide">
                Brand Logo
              </label>
              <span className="text-xs text-gray-400 italic">
                Recommended: PNG or SVG · 200×200px+
              </span>
            </div>

            {/* Upload UI */}
            {!landing.logo_url ? (
              <label
                htmlFor="logoUpload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-green rounded-xl py-10 px-6 cursor-pointer transition-all duration-300 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-500 group-hover:text-green transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-6-9l-3-3m0 0l-3 3m3-3V15"
                  />
                </svg>
                <p className="mt-3 text-sm text-gray-400">
                  <span className="text-green font-medium">
                    Click to upload
                  </span>{" "}
                  or drag your logo
                </p>

                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const previewUrl = URL.createObjectURL(file);
                    setLanding({ ...landing, logo_url: previewUrl });

                    const formData = new FormData();
                    formData.append("logo", file);
                    formData.append("landingId", landing.id);

                    try {
                      const res = await axiosInstance.post(
                        "https://cre8tlystudio.com/api/landing/upload-logo",
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                      );

                      if (res.data.success) {
                        setLanding({ ...landing, logo_url: res.data.logo_url });
                        toast.success("Logo uploaded successfully!");
                        URL.revokeObjectURL(previewUrl);
                      } else {
                        toast.error(res.data.message || "Upload failed");
                        setLanding({ ...landing, logo_url: "" });
                      }
                    } catch (err) {
                      console.error("❌ Upload error:", err);
                      toast.error("Error uploading logo");
                      setLanding({ ...landing, logo_url: "" });
                    }
                  }}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-gray-400 mb-3">Current Logo:</p>
                <div className="relative bg-white rounded-lg shadow-md border border-gray-300 p-3 w-fit mx-auto">
                  <img
                    src={landing.logo_url}
                    alt="Uploaded Logo"
                    className="h-24 object-contain rounded-md mx-auto"
                  />
                </div>
                <button
                  type="button"
                  className="text-red-400 text-xs mt-4 hover:underline"
                  onClick={() => setLanding({ ...landing, logo_url: "" })}
                >
                  Remove Logo
                </button>
              </div>
            )}
          </div>

          {/* Theme & Font Choosers */}
          <ColorThemeChooser
            bgTheme={bgTheme}
            setBgTheme={(themeName) => {
              setBgTheme(themeName);

              // 🔍 find the selected theme object (either color or gradient)
              const selected = pageBuilderThemes.find(
                (t) => t.name === themeName
              );

              // 💾 store the actual CSS value (gradient or hex)
              const actualBg = selected?.preview || themeName;
              setBgTheme(actualBg);
              setLanding({
                ...landing,
                bg_theme: actualBg,
              });
            }}
            colorThemes={pageBuilderThemes}
            includeGradients={true}
          />
          <div className="relative z-[60]">
            <FontSelector
              fontName={fontName}
              setFontName={(name) => {
                setFontName(name);
                setLanding({ ...landing, font: name });
              }}
              fontFile={fontFile}
              setFontFile={(file) => {
                setFontFile(file);
                setLanding({ ...landing, font_file: file });
              }}
            />
          </div>

          {/* 🖋 Font Color Pickers */}
          <div className="relative z-[10] mt-10 bg-[#111827] rounded-xl p-6 shadow-inner border border-gray-700">
            <h3 className="text-silver text-lg font-semibold mb-4">
              Text Colors
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { key: "font_color_h1", label: "Heading 1" },
                { key: "font_color_h2", label: "Heading 2" },
                { key: "font_color_h3", label: "Heading 3" },
                { key: "font_color_p", label: "Paragraph" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center bg-[#1f2937] rounded-lg p-4 border border-gray-600 hover:border-[#F285C3] transition-all duration-200"
                >
                  <label className="text-sm font-semibold text-white mb-2">
                    {label}
                  </label>
                  <input
                    type="color"
                    value={landing[key] || "#FFFFFF"}
                    onChange={(e) =>
                      setLanding({ ...landing, [key]: e.target.value })
                    }
                    className="w-14 h-14 p-0 rounded-lg cursor-pointer border border-gray-400 hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: landing[key],
                    }}
                  />
                  <span className="text-xs text-gray-300 mt-2 tracking-wider">
                    {landing[key] || "#FFFFFF"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Live Preview */}

          <div className="mt-12 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 transition-all hover:border-silver/60">
            {/* Header toggle */}
            <div
              onClick={() => setShowPreviewSection(!showPreviewSection)}
              className="flex items-center justify-between px-6 py-5 cursor-pointer select-none"
            >
              <h3 className="text-lg font-semibold text-silver tracking-wide">
                Landing Page Preview
              </h3>
              <span
                className={`text-gray-400 text-sm transform transition-transform duration-300 ${
                  showPreviewSection ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>

            {/* Animated Content */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showPreviewSection
                  ? "max-h-[4000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div
                className="mt-8 p-10 rounded-xl text-center shadow-lg transition-all duration-500"
                style={{
                  background: adjustForLandingOverlay(selectedTheme),
                  fontFamily: fontName,
                }}
              >
                {landing.content_blocks
                  ?.filter((b) => b.type === "offer_banner")
                  .map((block, index) => {
                    const isGradient =
                      selectedTheme?.includes("linear-gradient");
                    const mainOverlayColor = isGradient
                      ? selectedTheme // keep gradient as-is
                      : blendColors(
                          selectedTheme || "#1e0033",
                          "rgba(255,255,255,0.04)"
                        );
                    const bannerBg = block.match_main_bg
                      ? mainOverlayColor
                      : block.use_gradient
                        ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                            block.gradient_start || "#F285C3"
                          }, ${block.gradient_end || "#7bed9f"})`
                        : block.bg_color || "#F285C3";

                    return (
                      <div
                        key={index}
                        className="relative shadow-lg"
                        style={{
                          background: bannerBg,
                          color: block.text_color || "#fff",
                          textAlign: "center",
                          padding: `${block.padding || 40}px 20px`,
                          fontWeight: 600,
                          fontSize: "1.2rem",
                          lineHeight: "1.5",
                          position: "relative",
                          top: "-40px",
                          margin: "0 -30px 20px",
                          borderRadius: "24px 24px 0 0",
                          overflow: "hidden",

                          // ✅ Match main background layer
                          backdropFilter: "blur(6px)",
                          backgroundBlendMode: "overlay",
                          border: "1px solid rgba(255,255,255,0.06)",
                          boxShadow: "0 4px 25px rgba(0,0,0,0.15)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            margin: "0 0 22px",
                            textAlign: "center",
                          }}
                        >
                          {block.text ||
                            "🔥 Limited Time Offer! Get your free eBook today!"}
                        </p>

                        {block.link_text && block.link_url && (
                          <a
                            href={block.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-block",
                              background: bannerBg,
                              color: "#fff",
                              padding: "14px 32px",
                              borderRadius: "10px",
                              fontWeight: 700,
                              fontSize: "1rem",
                              textDecoration: "none",
                              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                              transition: "transform 0.25s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "scale(1.05)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          >
                            {block.link_text}
                          </a>
                        )}
                      </div>
                    );
                  })}

                {landing.cover_image_url && (
                  <img
                    src={landing.cover_image_url}
                    alt="PDF Cover"
                    className="mx-auto mb-8 rounded-xl shadow-lg"
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      height: "auto", // <-- Add
                      aspectRatio: "unset",
                      objectFit: "cover",
                      border: "2px solid rgba(255, 255, 255, 0.06)",
                      background: "#000",
                      boxShadow:
                        "0 15px 35px rgba(0, 0, 0, 0.25), 0 6px 20px rgba(0, 0, 0, 0.15)",
                      borderRadius: "12px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  />
                )}

                {landing.content_blocks?.length ? (
                  landing.content_blocks.map((block, index) => {
                    const baseStyle = {
                      margin: "0 auto 24px",
                      maxWidth: "700px",
                      textAlign: "center",
                    };

                    switch (block.type) {
                      case "heading":
                        return (
                          <h1
                            key={index}
                            className="text-4xl font-bold leading-snug"
                            style={{
                              ...baseStyle,
                              color: landing.font_color_h1 || "#FFFFFF",
                            }}
                          >
                            {block.text || "Heading Example"}
                          </h1>
                        );

                      case "subheading":
                        return (
                          <h2
                            key={index}
                            className="text-2xl font-semibold leading-snug"
                            style={{
                              ...baseStyle,
                              color: landing.font_color_h2 || "#E5E5E5",
                            }}
                          >
                            {block.text || "Subheading Example"}
                          </h2>
                        );

                      case "subsubheading":
                        return (
                          <h3
                            key={index}
                            className="text-xl font-medium leading-snug"
                            style={{
                              ...baseStyle,
                              color: landing.font_color_h3 || "#CCCCCC",
                            }}
                          >
                            {block.text || "Supporting Header"}
                          </h3>
                        );

                      case "list_heading":
                        return (
                          <p
                            key={index}
                            style={{
                              margin: "0 auto 10px",
                              maxWidth: "700px",
                              fontWeight: 700,
                              fontSize: "1.15rem",
                              textAlign: block.alignment || "left",
                              color: landing.font_color_p || "#FFFFFF",
                            }}
                          >
                            {block.text || "💎 List Heading Example"}
                          </p>
                        );

                      case "paragraph":
                        if (block.bulleted) {
                          const lines = (block.text || "")
                            .split(/\n/)
                            .filter(Boolean);
                          return (
                            <ul
                              key={index}
                              style={{
                                margin: "0 auto 24px",
                                maxWidth: "700px",
                                color: landing.font_color_p || "#DDDDDD",
                                textAlign: block.alignment || "left",
                                lineHeight: "1.8",
                                listStyle: "disc",
                                paddingLeft: "1.5rem",
                              }}
                            >
                              {lines.map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          );
                        }

                        return (
                          <p
                            key={index}
                            className="text-lg leading-relaxed"
                            style={{
                              margin: "0 auto 24px",
                              maxWidth: "700px",
                              color: landing.font_color_p || "#DDDDDD",
                              textAlign: block.alignment || "left",
                            }}
                          >
                            {block.text || "Your paragraph will appear here."}
                          </p>
                        );

                      case "video":
                        if (!block.url) return null;

                        let embedUrl = block.url.trim();

                        if (embedUrl.includes("watch?v=")) {
                          embedUrl = embedUrl.replace("watch?v=", "embed/");
                        } else if (embedUrl.includes("youtu.be/")) {
                          const id = embedUrl
                            .split("youtu.be/")[1]
                            .split(/[?&]/)[0];
                          embedUrl = `https://www.youtube.com/embed/${id}`;
                        }

                        if (
                          embedUrl.includes("vimeo.com") &&
                          !embedUrl.includes("player.vimeo.com")
                        ) {
                          const id = embedUrl
                            .split("vimeo.com/")[1]
                            .split(/[?&]/)[0];
                          embedUrl = `https://player.vimeo.com/video/${id}`;
                        }

                        return (
                          <div
                            key={index}
                            style={{
                              margin: "40px auto",
                              maxWidth: "800px",
                              textAlign: "center",
                            }}
                          >
                            <iframe
                              src={embedUrl}
                              title="Embedded Video"
                              style={{
                                width: "100%",
                                aspectRatio: "16 / 9",
                                border: "none",
                                borderRadius: "12px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                              }}
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            ></iframe>

                            {block.caption && (
                              <p
                                style={{
                                  marginTop: "12px",
                                  fontSize: "0.95rem",
                                  color: landing.font_color_p || "#DDD",
                                  fontStyle: "italic",
                                }}
                              >
                                {block.caption}
                              </p>
                            )}
                          </div>
                        );

                      case "spacer":
                        if (block.style === "space") {
                          return (
                            <div
                              key={index}
                              style={{
                                height: `${block.height || 40}px`,
                              }}
                            ></div>
                          );
                        }
                        return (
                          <hr
                            key={index}
                            style={{
                              border: "none",
                              borderTop: `1px solid ${block.color || "rgba(255,255,255,0.2)"}`,
                              width: block.width || "60%",
                              margin: `${(block.height || 40) / 2}px auto`,
                              opacity: 0.7,
                            }}
                          />
                        );

                      case "calendly":
                        if (!block.calendly_url) return null;

                        return (
                          <div
                            key={index}
                            style={{
                              margin: "40px auto",
                              maxWidth: "900px",
                              textAlign: "center",
                            }}
                          >
                            <iframe
                              src={block.calendly_url}
                              style={{
                                width: "100%",
                                height: `${block.height || 650}px`,
                                border: "none",
                                borderRadius: "12px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                              }}
                              title="Calendly Scheduler"
                            ></iframe>
                          </div>
                        );

                      case "social_links":
                        const align = block.alignment || "center";
                        const iconColor = block.icon_color || "#ffffff";
                        const links = block.links || {};

                        const iconSet = {
                          instagram:
                            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
                          threads:
                            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/threads.svg",
                          twitter:
                            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg",
                          youtube:
                            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg",
                          linkedin:
                            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
                          facebook:
                            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
                          tiktok:
                            "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg",
                        };

                        return (
                          <div
                            key={index}
                            style={{
                              textAlign: align,
                              margin: "40px 0",
                              display: "flex",
                              justifyContent:
                                align === "center"
                                  ? "center"
                                  : align === "right"
                                    ? "flex-end"
                                    : "flex-start",
                              gap: "20px",
                              flexWrap: "wrap",
                            }}
                          >
                            {Object.entries(links)
                              .filter(
                                ([platform, url]) => url && iconSet[platform]
                              )
                              .map(([platform, url]) => (
                                <a
                                  key={platform}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    width: "38px",
                                    height: "38px",
                                    display: "inline-block",
                                    transition:
                                      "transform 0.25s ease, opacity 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1.1)";
                                    e.currentTarget.style.opacity = "0.9";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1)";
                                    e.currentTarget.style.opacity = "1";
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      WebkitMask: `url(${iconSet[platform]}) no-repeat center / contain`,
                                      mask: `url(${iconSet[platform]}) no-repeat center / contain`,
                                      backgroundColor: iconColor, // ✅ exact chosen color
                                      transition: "background-color 0.3s ease",
                                    }}
                                  />
                                </a>
                              ))}
                          </div>
                        );

                      case "countdown":
                        return (
                          <div
                            key={index}
                            style={{
                              margin: "40px auto",
                              textAlign: block.alignment || "center",
                              color: block.text_color || "#FFFFFF",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                marginBottom: "10px",
                              }}
                            >
                              {block.text || "Offer Ends In:"}
                            </p>
                            <CountdownTimerPreview
                              targetDate={block.target_date}
                              variant={block.style_variant}
                              bgTheme={bgTheme}
                            />
                          </div>
                        );

                      case "stripe_checkout":
                        return (
                          <div
                            key={index}
                            style={{
                              textAlign: block.alignment || "center",
                              margin: "40px auto",
                            }}
                          >
                            <button
                              onClick={async () => {
                                if (!block.pdf_url) {
                                  toast.warn(
                                    "Please select a PDF to sell first."
                                  );
                                  return;
                                }

                                try {
                                  const res = await axiosInstance.post(
                                    "https://cre8tlystudio.com/api/seller-checkout/create-checkout-session",
                                    {
                                      landingPageId: landing.id,
                                      sellerId: user?.id,
                                      pdfUrl: block.pdf_url,
                                      price_in_cents: Math.round(
                                        (block.price || 10) * 100
                                      ),
                                    }
                                  );

                                  if (res.data?.url)
                                    window.location.href = res.data.url;
                                  else
                                    toast.error(
                                      "Unable to start checkout. Please try again."
                                    );
                                } catch (err) {
                                  console.error("Stripe Checkout Error:", err);
                                  toast.error(
                                    "Error connecting to Stripe. Try again later."
                                  );
                                }
                              }}
                              className="transition-transform hover:scale-105"
                              style={{
                                background: block.button_color || "#7bed9f",
                                color: block.text_color || "#000", // ✅ new text color
                                padding: "14px 36px",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                              }}
                            >
                              {block.button_text || "Buy & Download PDF"}
                            </button>

                            <p style={{ marginTop: "8px", color: "#aaa" }}>
                              ${block.price?.toFixed(2) || "10.00"} USD
                            </p>

                            {block.pdf_url && (
                              <p className="text-xs text-gray-400 mt-2">
                                Selling:
                                <a
                                  href={block.pdf_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green font-medium ml-1 underline hover:text-green transition"
                                >
                                  Preview PDF
                                </a>
                              </p>
                            )}
                          </div>
                        );

                      case "referral_button":
                        // only allow employees to have active referral links
                        if (user?.is_admin_employee !== 1) {
                          return (
                            <p
                              key={index}
                              style={{
                                color: "#999",
                                fontSize: "0.9rem",
                                textAlign: "center",
                                marginTop: "20px",
                              }}
                            >
                              (Referral buttons are available to admin employees
                              only)
                            </p>
                          );
                        }

                        const referralUrl = `https://cre8tlystudio.com/signup?ref_employee=${user?.id}`;

                        return (
                          <div
                            key={index}
                            style={{
                              textAlign: block.alignment || "center",
                              margin: "40px auto",
                            }}
                          >
                            <a
                              href={referralUrl}
                              style={{
                                display: "inline-block",
                                background: block.button_color || "#7bed9f",
                                color: block.text_color || "#000000",
                                padding: "14px 36px",
                                borderRadius: "10px",
                                fontWeight: 700,
                                textDecoration: "none",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                                transition: "transform 0.25s ease",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.05)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            >
                              {block.text || "Sign Up with My Referral"}
                            </a>

                            <p
                              style={{
                                color: "#aaa",
                                fontSize: "0.8rem",
                                marginTop: "10px",
                              }}
                            >
                              {`Referral link: ${referralUrl}`}
                            </p>
                          </div>
                        );

                      case "verified_reviews":
                        return (
                          <div
                            key={index}
                            style={{
                              background: block.bg_color || "rgba(0,0,0,0.3)",
                              color: block.text_color || "#FFFFFF",
                              textAlign: block.alignment || "center",
                              padding: "40px",
                              borderRadius: "20px",
                              marginTop: "40px",
                            }}
                          >
                            <h2
                              style={{
                                fontSize: "1.8rem",
                                fontWeight: 700,
                                marginBottom: "10px",
                              }}
                            >
                              {block.title || "Verified Buyer Reviews"}
                            </h2>
                            <p style={{ color: "#AAA", fontSize: "0.95rem" }}>
                              (Buyers who purchased will be able to leave
                              reviews here)
                            </p>
                            <div
                              style={{
                                marginTop: "20px",
                                background: "rgba(255,255,255,0.08)",
                                padding: "20px",
                                borderRadius: "10px",
                                color: "#CCC",
                                fontStyle: "italic",
                              }}
                            >
                              ★★★★★ “Love this product!”
                              <br />
                              <span
                                style={{ fontSize: "0.8rem", color: "#999" }}
                              >
                                — Verified Buyer, sample preview
                              </span>
                            </div>
                          </div>
                        );

                      case "faq":
                        return (
                          <div
                            key={index}
                            style={{
                              background: block.use_no_bg
                                ? "transparent"
                                : block.use_gradient
                                  ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                                      block.gradient_start || "#F285C3"
                                    }, ${block.gradient_end || "#7bed9f"})`
                                  : block.match_main_bg
                                    ? adjustForLandingOverlay(bgTheme)
                                    : block.bg_color ||
                                      bgTheme ||
                                      "rgba(0,0,0,0.3)",
                              color: block.text_color || "#FFFFFF",
                              padding: "40px",
                              borderRadius: block.use_no_bg ? "0px" : "20px",
                              marginTop: "40px",
                              textAlign: block.alignment || "left",
                              maxWidth: "700px",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            <h2
                              style={{
                                fontSize: "1.8rem",
                                fontWeight: 700,
                                marginBottom: "20px",
                              }}
                            >
                              {block.title || "Frequently Asked Questions"}
                            </h2>

                            {block.items.map((item, i) => (
                              <div
                                key={i}
                                style={{
                                  marginBottom: "20px",
                                  borderBottom: block.use_no_bg
                                    ? "1px solid rgba(255,255,255,0.2)"
                                    : "1px solid rgba(255,255,255,0.15)",
                                  paddingBottom: "16px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  const updated = [...block.items];
                                  const el = document.getElementById(
                                    `faq-prev-${index}-${i}`
                                  );
                                  if (el)
                                    updated[i]._height = el.scrollHeight + "px";
                                  updated[i].open = !updated[i].open;
                                  updateBlock(index, "items", updated);
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  <span>{item.q}</span>
                                  <span>{item.open ? "−" : "+"}</span>
                                </div>

                                <div
                                  id={`faq-prev-${index}-${i}`}
                                  style={{
                                    height: item.open
                                      ? item._height || "auto"
                                      : "0px",
                                    overflow: "hidden",
                                    transition: "height 0.35s ease",
                                  }}
                                >
                                  <p
                                    style={{
                                      color: block.text_color
                                        ? block.text_color + "CC"
                                        : "#CCCCCC",
                                      fontSize: "0.95rem",
                                      marginTop: "12px",
                                    }}
                                  >
                                    {item.a}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        );

                      default:
                        return null;
                    }
                  })
                ) : (
                  <p className="text-gray-400 italic">
                    Start adding sections to preview your landing page...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Toggle Download Button */}
          <div className="mt-10 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 hover:border-silver/60 transition-all">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-silver tracking-wide">
                Show “Download Now” Button
              </label>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDownloadButton}
                  onChange={(e) => setShowDownloadButton(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`block w-11 h-6 rounded-full transition-all duration-300 ${
                    showDownloadButton ? "bg-green" : "bg-gray-600"
                  }`}
                ></span>
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    showDownloadButton ? "translate-x-5" : ""
                  }`}
                ></span>
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Turn this off if you want to hide the email download form on your
              public page.
            </p>
          </div>

          {/* Save + View */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-16 pt-8 border-t border-gray-700">
            {/* Left: Save buttons grouped together */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
              <button
                type="submit"
                className="bg-green text-black px-6 py-3 rounded-lg shadow hover:bg-green transition"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleSaveTemplate}
                className="bg-blue text-white px-6 py-3 rounded-lg shadow hover:bg-green transition"
              >
                Save Version
              </button>
            </div>

            {/* Right: View Live Page */}
            <div className="flex flex-col items-center sm:items-end mt-6 sm:mt-0">
              <a
                href={
                  landing.username
                    ? `https://${landing.username}.cre8tlystudio.com?owner_preview=${encodeURIComponent(
                        user?.id || ""
                      )}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  landing.username
                    ? "text-green font-semibold underline hover:text-white"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {landing.username
                  ? "View Live Page"
                  : "Set Username to View Page"}
              </a>

              <p className="text-xs text-gray-500 mt-1">
                Live URL:{" "}
                <span className="text-silver font-medium">
                  {landing.username
                    ? `https://${landing.username}.cre8tlystudio.com`
                    : "Not set"}
                </span>
              </p>
            </div>
          </div>
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

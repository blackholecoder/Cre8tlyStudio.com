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

    if (type === "button") {
      newBlock.text = "";
      newBlock.url = "";
      newBlock.new_tab = false;
    }

    if (type === "video") {
      newBlock.url = "";
      newBlock.caption = "";
      newBlock.autoplay = false;
      newBlock.loop = false;
      newBlock.muted = false;
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

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        const [landingRes, pdfRes] = await Promise.all([
          axiosInstance.get(
            `https://cre8tlystudio.com/api/landing/builder/${user.id}`
          ),
          axiosInstance.get("https://cre8tlystudio.com/api/lead-magnets"),
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

        setLanding({ ...lp, content_blocks: blocks });
        setPdfList(magnets);
        setFontName(lp.font || "Montserrat");
        setFontFile(lp.font_file || "");

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
          <div className="w-16 h-16 border-4 border-t-transparent border-blue rounded-full animate-spin"></div>
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
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}($|[?&])/;

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
        }
      );

      toast.success("Landing page saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving landing page");
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
                  Only completed PDFs will appear
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
          {/* 🧪 Landing Page Preview (Collapsible) */}
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
                  background: selectedTheme,
                  fontFamily: fontName,
                }}
              >
                {landing.cover_image_url && (
                  <img
                    src={landing.cover_image_url}
                    alt="PDF Cover"
                    className="mx-auto mb-8 rounded-xl shadow-lg"
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      aspectRatio: "3 / 4",
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

                      case "button":
                        return (
                          <div
                            key={index}
                            style={{ textAlign: "center", marginTop: "12px" }}
                          >
                            <a
                              href={block.url || "#"}
                              target={block.new_tab ? "_blank" : "_self"}
                              rel={
                                block.new_tab
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="inline-block bg-green text-black px-6 py-3 rounded-lg shadow hover:bg-green hover:text-black transition"
                            >
                              {block.text || "Click Here"}
                            </a>
                          </div>
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

          {/* Save + View */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left mt-16 pt-8 border-t border-gray-700">
            <button
              type="submit"
              className="bg-green text-black px-6 py-3 rounded-lg shadow hover:bg-green transition mx-auto sm:mx-0"
            >
              Save Changes
            </button>

            <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
              <a
                href={
                  landing.username
                    ? `https://${landing.username}.cre8tlystudio.com`
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
    </div>
  );
}

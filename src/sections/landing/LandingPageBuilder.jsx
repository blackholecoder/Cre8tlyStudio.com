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

export default function LandingPageBuilder() {
  const { user } = useAuth();
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontName, setFontName] = useState("");
  const [fontFile, setFontFile] = useState("");
  const [bgTheme, setBgTheme] = useState("default");
  const [pdfList, setPdfList] = useState([]);

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
    const newBlock = { id: crypto.randomUUID(), type, text: "", padding: 20 };
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

    const fetchLanding = async () => {
      try {
        const res = await axiosInstance.get(
          `https://cre8tlystudio.com/api/landing/builder/${user.id}`
        );
        if (res.data.success) {
          let blocks = [];
          try {
            blocks =
              typeof lp.content_blocks === "string"
                ? JSON.parse(lp.content_blocks)
                : lp.content_blocks || [];
          } catch {
            blocks = [];
          }

          const lp = res.data.landingPage;
          setLanding(lp);
          setFontName(lp.font || "Montserrat");
          setFontFile(lp.font_file || "");
          setBgTheme(lp.bg_theme || "default");
        } else toast.error(res.data.message);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load landing page");
      } finally {
        setLoading(false);
      }
    };

    const fetchPDFs = async () => {
  try {
    const res = await axiosInstance.get("https://cre8tlystudio.com/api/lead-magnets");

    console.log("🧩 Full response:", res);
    console.log("✅ res.data:", res.data);
    // No need for user.id in URL — the token handles it
    setPdfList(res.data.magnets || []); 
  } catch (err) {
    console.error("Error loading PDFs:", err.response?.data || err.message);
  }
};

    fetchLanding();
    fetchPDFs();

    
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
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;

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

      await axiosInstance.put(
        `https://cre8tlystudio.com/api/landing/update/${landing.id}`,
        {
          ...landing,
          content_blocks: blocks,
          pdf_url: landing.pdf_url, 
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
    [...colorThemes, ...gradientThemes].find((t) => t.name === bgTheme)
      ?.preview || "linear-gradient(to bottom, #ffffff, #F285C3)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-900 p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-black/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-silver">
          Landing Page Builder
        </h1>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Headline */}
          <div>
            <div>
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
                        `/check-username/${landing.username.trim()}`
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <p className="text-xs text-gray-200 mt-1">
                This will be used for your page URL:{" "}
                <span className="text-blue">
                  {landing.username
                    ? `https://${landing.username}.cre8tlystudio.com`
                    : "https://yourname.cre8tlystudio.com"}
                </span>
              </p>
            </div>
            {/* DndContext */}
            <div className="space-y-4">
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

            <div className="relative inline-block add-section-dropdown mt-10 mb-10">
              <button
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
                className="bg-blue text-white py-2 px-4 rounded-lg shadow transition relative"
              >
                + Add Section
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {[
                    { label: "Heading (H1)", value: "heading" },
                    { label: "Subheading (H2)", value: "subheading" },
                    { label: "Sub-Subheading (H3)", value: "subsubheading" },
                    { label: "Paragraph", value: "paragraph" },
                    { label: "Button", value: "button" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => addBlock(opt.value)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue/10 hover:text-black transition"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 🧾 PDF Attachment */}
<div className="mt-8">
  <label className="block font-semibold mb-2 text-silver">
    Choose PDF to Offer
  </label>

  <select
    value={landing.pdf_url || ""}
    onChange={(e) =>
      setLanding({
        ...landing,
        pdf_url: e.target.value,
      })
    }
    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
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

  {landing.pdf_url && (
    <p className="text-xs text-gray-400 mt-2">
      Selected file:{" "}
      <a
        href={landing.pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue underline"
      >
        Preview PDF
      </a>
    </p>
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
              setLanding({
                ...landing,
                bg_theme: selected?.preview || themeName,
              });
            }}
            colorThemes={pageBuilderThemes}
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
          <h1 className="text-3xl font-extrabold text-center mb-8 text-silver">
            Landing Page Preview
          </h1>
          <div
            className="mt-16 p-10 rounded-xl text-center shadow-lg transition-all duration-500"
            style={{
              background: selectedTheme,
              fontFamily: fontName,
            }}
          >
            {landing.content_blocks?.length ? (
              landing.content_blocks.map((block, index) => {
                const paddingStyle = {
                  marginBottom: `${block.padding || 20}px`,
                };

                switch (block.type) {
                  case "heading":
                    return (
                      <h1
                        key={index}
                        className="text-4xl font-bold"
                        style={{
                          ...paddingStyle,
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
                        className="text-2xl font-semibold"
                        style={{
                          ...paddingStyle,
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
                        className="text-xl font-medium"
                        style={{
                          ...paddingStyle,
                          color: landing.font_color_h3 || "#CCCCCC",
                        }}
                      >
                        {block.text || "Supporting Header"}
                      </h3>
                    );

                  case "paragraph":
                    return (
                      <p
                        key={index}
                        className="text-lg max-w-2xl mx-auto"
                        style={{
                          ...paddingStyle,
                          color: landing.font_color_p || "#DDDDDD",
                        }}
                      >
                        {block.text || "Your paragraph will appear here."}
                      </p>
                    );

                  case "button":
                    return (
                      <div key={index} style={paddingStyle}>
                        <a
                          href={block.url || "#"}
                          className="inline-block bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-[#F285C3] transition"
                        >
                          {block.text || "Click Here"}
                        </a>
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

          {/* Save + View */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left mt-8">
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
                    ? "text-white font-semibold underline hover:text-blue"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {landing.username
                  ? "View Live Page"
                  : "Set Username to View Page"}
              </a>
              <p className="text-xs text-gray-500 mt-1">
                Live URL:{" "}
                <span className="text-blue font-medium">
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

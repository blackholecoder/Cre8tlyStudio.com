// import { useState, useEffect, useRef } from "react";
// import { Dialog, DialogPanel } from "@headlessui/react";
// import { startLeadMagnetEdit, commitLeadMagnetEdit } from "../../api/leadMagnets";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import { colorThemes, fontThemes } from "../../constants";


// export default function EditorModal({ leadMagnetId, open, onClose, onCommitted }) {
//   const [token, setToken] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [meta, setMeta] = useState(null);
//   const [editableHtml, setEditableHtml] = useState("");
//   const [rawHtml, setRawHtml] = useState(null);


//   // 🧠 TipTap setup
//   const editor = useEditor({
//     extensions: [StarterKit, Image],
//     content: "",
//     editable: true,
//     editorProps: {
//       attributes: {
//         class: "tiptap-editor bg-transparent text-inherit w-full h-full",
//       },
//     },
//     onUpdate({ editor }) {
//       setEditableHtml(editor.getHTML());
//     },
//   });

//   useEffect(() => {
//   const fixAlignment = () => {
//     const root = document.querySelector(".tiptap-editor .ProseMirror");
//     if (root) {
//       root.style.textAlign = "center";
//       root.style.display = "flex";
//       root.style.flexDirection = "column";
//       root.style.alignItems = "center";
//       root.style.justifyContent = "flex-start";

//       // Also fix page-inner layout
//       const inner = root.querySelector(".page-inner");
//       if (inner) {
//         inner.style.maxWidth = "700px";
//         inner.style.margin = "0 auto";
//         inner.style.textAlign = "left";
//       }
//       console.log("💡 TipTap alignment fixed at runtime");
//     } else {
//       console.warn("⚠️ ProseMirror not found yet, retrying...");
//       setTimeout(fixAlignment, 200);
//     }
//   };
//   fixAlignment();
// }, [open, editor]);

//   // 🧩 Load editable HTML from backend
// useEffect(() => {
//   if (!open || !leadMagnetId) return;
//   (async () => {
//     const data = await startLeadMagnetEdit(leadMagnetId);
//     console.log("🧩 startLeadMagnetEdit() returned:", data);

//     setToken(data.token);
//     setMeta(data.meta);
//     setEditableHtml(data.editableHtml || "");
//     setRawHtml(data.editableHtml || "");

//     // ✅ Do NOT rewrap it — use backend HTML directly
//     editor?.commands.setContent(data.editableHtml || "");

//     if (data.editableHtml?.includes("<style")) console.log("✅ Found <style> tag inside backend HTML");
//     else console.warn("⚠️ No <style> tag found in editableHtml");
//   })().catch(onClose);
// }, [open, leadMagnetId, editor]);


//   async function handleCommit() {
//     setSaving(true);
//     try {
//       const updatedHtml = editor?.getHTML() || editableHtml;
//       const data = await commitLeadMagnetEdit(leadMagnetId, token, updatedHtml);
//       onCommitted(data.pdf_url);
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   }


// useEffect(() => {
//   if (!rawHtml) {
//     console.warn("⚠️ No rawHtml yet — skipping backend CSS injection");
//     return;
//   }

//   console.log("🧩 Starting backend CSS injection for theme:", meta?.theme);

//   const parser = new DOMParser();
//   const doc = parser.parseFromString(rawHtml, "text/html");
//   const styleTag = doc.querySelector("style");

//   if (!styleTag) {
//     console.warn("⚠️ No <style> tag found inside backend HTML, nothing to inject");
//     return;
//   }

//   let css = styleTag.innerHTML;
//   console.log("📄 Raw backend CSS length:", css.length);
//   console.log("🪶 Backend CSS sample:", css.slice(0, 200));

//   // ✅ Scope all top-level selectors into TipTap without breaking structure
//   css = css.replace(/(^|\n)([^\{\}@][^\{]*)\{/g, (match, p1, selector) => {
//     if (selector.includes("@") || selector.includes("font-face") || selector.includes("media")) return match;
//     const scoped = selector
//       .split(",")
//       .map((s) => `.tiptap-editor ${s.trim()}`)
//       .join(", ");
//     return `${p1}${scoped} {`;
//   });

//   // ✅ Force TipTap container and alignment rules
//   css += `
//   /* --- FORCE PDF FRONTEND ALIGNMENT TO MATCH BACKEND --- */
//   .tiptap-editor .ProseMirror,
//   .tiptap-editor .page,
//   .tiptap-editor .page-inner {
//     text-align: center !important;
//     background: inherit !important;
//     font-family: 'Montserrat', sans-serif !important;
//     color: inherit !important;
//   }

//   /* paragraphs stay left */
//   .tiptap-editor .ProseMirror {
//   text-align: center !important;
//   display: flex !important;
//   flex-direction: column !important;
//   align-items: center !important;
// }
// .tiptap-editor .page-inner {
//   max-width: 700px !important;
//   text-align: left !important;
// }

//   /* center all headers */
//   .tiptap-editor h1,
//   .tiptap-editor h2,
//   .tiptap-editor h3 {
//     text-align: center !important;
//   }

//   /* fix CTA link styles */
//   .tiptap-editor .footer-link .link-button {
//     display: inline-block !important;
//     background: linear-gradient(90deg, #00E07A 0%, #670fe7 100%) !important;
//     color: white !important;
//     padding: 12px 26px !important;
//     font-weight: 600 !important;
//     font-size: 16px !important;
//     border: 1px solid white !important;
//     border-radius: 30px !important;
//     text-decoration: none !important;
//     box-shadow: 0 0 6px rgba(0, 0, 0, 0.25) !important;
//     transition: transform 0.2s ease, box-shadow 0.2s ease !important;
//   }

//   .tiptap-editor .footer-link .link-button:hover {
//     transform: scale(1.05);
//     box-shadow: 0 0 10px rgba(0,0,0,0.3);
//   }
// `;


// // ✅ Inject backend CSS directly into TipTap’s ProseMirror content root
// const style = document.createElement("style");
// style.id = "tiptap-backend-style";
// style.innerHTML = css;

// // Wait for TipTap to mount before appending
// setTimeout(() => {
//   const editorRoot = document.querySelector(".tiptap-editor .ProseMirror");
//   if (editorRoot) {
//     editorRoot.prepend(style.cloneNode(true)); // inject inside editor DOM
//     console.log("🎨 Injected backend CSS directly into ProseMirror root");
//   } else {
//     console.warn("⚠️ Could not find .ProseMirror root for style injection");
//     document.head.appendChild(style);
//   }
// }, 500);

//   // ✅ Log computed styles for verification
//   setTimeout(() => {
//     const el = document.querySelector(".tiptap-editor");
//     if (el) {
//       const cs = getComputedStyle(el);
//       console.log("🎯 Editor computed style snapshot:", {
//         background: cs.backgroundColor,
//         color: cs.color,
//         fontFamily: cs.fontFamily,
//         textAlign: cs.textAlign,
//       });
//     }
//   }, 1000);

//   return () => document.getElementById("tiptap-backend-style")?.remove();
// }, [rawHtml, meta?.theme]);




//   const isDarkHex = (hex) => {
//     const n = parseInt(hex.replace("#", ""), 16);
//     const r = (n >> 16) & 255,
//       g = (n >> 8) & 255,
//       b = n & 255;
//     const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
//     return L < 128;
//   };

//   useEffect(() => {
//     document.getElementById("tiptap-theme-style")?.remove();
//     if (!meta?.bgTheme) return;

//     const theme = colorThemes.find((t) => t.name === meta.bgTheme);
//     console.log("🎨 Using bgTheme:", meta.bgTheme, "=>", theme);

//     const bg = theme?.preview || "#ffffff";
//     const color = isDarkHex(bg) ? "#fff" : "#000";

//     const style = document.createElement("style");
//     style.id = "tiptap-theme-style";
//     style.innerHTML = `
//       .tiptap-editor, .page {
//         background: ${bg} !important;
//         color: ${color} !important;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => style.remove();
//   }, [meta?.bgTheme]);

//   // 🧱 Structural fallback (no alignment/override)
//   useEffect(() => {
//     if (!editor || !meta?.theme) return;
//     const css = `
//       .tiptap-editor img {
//         max-width: 667px;
//         height: auto;
//         object-fit: contain;
//         display: block;
//         margin: 0 auto;
//       }
//       .page, .page-inner {
//         max-width: 667px;
//         margin: 0 auto;
//         padding: 0 20px;
//       }
//       .footer-link {
//         margin-top: 40px;
//         text-align: center;
//       }
//     `;
//     const style = document.createElement("style");
//     style.id = "tiptap-pdf-style";
//     style.innerHTML = css;
//     document.head.appendChild(style);
//     console.log("🎨 Applied structural PDF CSS only (alignment via backend)");
//     return () => document.getElementById("tiptap-pdf-style")?.remove();
//   }, [meta?.theme, meta?.bgTheme, editor]);

//   // 🧬 Font injection
//   useEffect(() => {
//     if (!meta?.theme) return;
//     const selectedFont = fontThemes[meta.theme?.toLowerCase()];
//     if (!selectedFont) return;

//     (async () => {
//       try {
//         const res = await fetch(`http://localhost:3001${selectedFont.file}`);
//         const buf = await res.arrayBuffer();
//         const base64Font = btoa(
//           new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), "")
//         );

//         const style = document.createElement("style");
//         style.id = "tiptap-font-style";
//         style.innerHTML = `
//           @font-face {
//             font-family: '${selectedFont.name}';
//             src: url(data:font/ttf;base64,${base64Font}) format('truetype');
//           }
//           .tiptap-editor, .tiptap-editor * {
//             font-family: '${selectedFont.name}', sans-serif !important;
//           }
//         `;
//         document.head.appendChild(style);
//         console.log("🧠 Font applied in editor:", selectedFont.name);
//       } catch (err) {
//         console.error("⚠️ Font load failed:", err);
//       }
//     })();
//     return () => document.getElementById("tiptap-font-style")?.remove();
//   }, [meta?.theme]);
  

//   // 🖥️ Modal UI
//   return (
//     <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
//       <div className="fixed inset-0 bg-black/60" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <DialogPanel className="w-full max-w-[1650px] bg-[#0f0f10] rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
//           <div className="grid grid-cols-1 gap-4">
//             <div className="w-full h-[70vh] bg-transparent text-inherit rounded-xl overflow-y-auto p-4">
//               <EditorContent editor={editor} />
//             </div>
//           </div>

//           <div className="mt-4 flex justify-end gap-2">
//             <button className="px-4 py-2 bg-gray-700 rounded-lg" onClick={onClose}>
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-green rounded-lg disabled:opacity-50 text-black"
//               disabled={saving}
//               onClick={handleCommit}
//             >
//               {saving ? "Reprinting..." : "Commit Edit"}
//             </button>
//           </div>
//         </DialogPanel>
//       </div>
//     </Dialog>
//   );
// }




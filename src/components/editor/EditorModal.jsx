
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { startLeadMagnetEdit, commitLeadMagnetEdit } from "../../api/leadMagnets";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { colorThemes } from "../../constants";

export default function EditorModal({ leadMagnetId, open, onClose, onCommitted }) {
  const [token, setToken] = useState(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");

   const iframeRef = useRef(null);

  const iframe = iframeRef.current;

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
    editable: true,
  });

  

  useEffect(() => {
    if (!open || !leadMagnetId) return;
    (async () => {
      const data = await startLeadMagnetEdit(leadMagnetId);
      setToken(data.token);
      setMeta(data.meta);
      setEditableHtml(data.editableHtml || "");
      editor?.commands.setContent(data.editableHtml || "");
    })().catch(onClose);
  }, [open, leadMagnetId, editor]);

  async function handleCommit() {
    setSaving(true);
    try {
      const updatedHtml = editor?.getHTML() || editableHtml;
      const data = await commitLeadMagnetEdit(leadMagnetId, token, updatedHtml);
      onCommitted(data.pdf_url);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
  if (editableHtml) {
    const blob = new Blob([editableHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);
    return () => URL.revokeObjectURL(url);
  }
}, [editableHtml]);


useEffect(() => {
  if (!editor || !iframeRef.current) return;



  const attachUpdateHandler = () => {
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return;

    // updatePreview replaces only inner content, keeping style intact
    const updatePreview = () => {
      iframeDoc.body.innerHTML = editor.getHTML();
    };

    // Attach update listener to editor
    editor.on("update", updatePreview);

    // Clean up when modal closes
    return () => {
      editor.off("update", updatePreview);
    };
  };

  // Wait for iframe to load its blob before attaching
  iframe.addEventListener("load", attachUpdateHandler);

  return () => {
    iframe.removeEventListener("load", attachUpdateHandler);
  };
}, [editor, iframeUrl]);


useEffect(() => {
  if (!iframeRef.current) return;

  setTimeout(() => {
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;
  }, 1000);
}, [editableHtml]);



  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-[1650px] bg-[#0f0f10] rounded-2xl p-6 shadow-2xl flex flex-col gap-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ✏️ Left: Editor */}
            <div className="w-full h-[70vh] bg-white text-black rounded-xl overflow-y-auto p-4">
              <EditorContent editor={editor} />
            </div>

<iframe
  ref={iframeRef}
  title="preview"
  src={iframeUrl}
  className="w-full h-[70vh] border border-gray-800 rounded-xl overflow-hidden"
  sandbox="allow-same-origin allow-popups allow-forms allow-scripts"
  style={{
    width: "100%",
    height: "70vh",
    borderRadius: "0.75rem",
    background: colorThemes[meta?.bgTheme]?.background || "#fff",
  }}
/>

          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button className="px-4 py-2 bg-gray-700 rounded-lg" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green rounded-lg disabled:opacity-50 text-black"
              disabled={saving}
              onClick={handleCommit}
            >
              {saving ? "Reprinting..." : "Commit Edit"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}


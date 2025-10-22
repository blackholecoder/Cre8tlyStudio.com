import React, { useEffect, useRef } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import "highlight.js/styles/github-dark.css";

export default function BookEditor({ content, setContent }) {
  const editorRef = useRef(null);

  
  const editor = useEditor({
    extensions: [
  ListItem, // must come first
  BulletList.configure({ keepMarks: true, keepAttributes: true }),
  OrderedList.configure({ keepMarks: true, keepAttributes: true }),
  Blockquote,
  StarterKit.configure({
    history: true,
    bulletList: false,   // disable StarterKit’s built-in ones
    orderedList: false,
    blockquote: false,   // disable built-in blockquote too
  }),
  Underline,
  Highlight,
  Link.configure({ openOnClick: false }),
  TextAlign.configure({
    types: ["heading", "paragraph", "listItem", "blockquote"],
  }),
  Placeholder.configure({ placeholder: "Start writing your book..." }),
],
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose prose-invert prose-lg max-w-none text-white leading-relaxed",
      },
    },
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  if (editor) window.__EDITOR = editor;

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  if (!editor) return null;

  return (
    <>

      {/* --- Toolbar --- */}
      <div className="sticky top-0 z-10 bg-[#111] px-6 py-3 flex flex-wrap items-center gap-6 border-b border-gray-800 shadow-md">
        {/* === Text Styles === */}
        <div className="flex gap-3 items-center">
          <button
          type="button" 
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`font-semibold text-lg ${
              editor.isActive("bold") ? "text-green-400" : "text-gray-300"
            } hover:text-white`}
          >
            B
          </button>
          <button
          type="button" 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`italic text-lg ${
              editor.isActive("italic") ? "text-green-400" : "text-gray-300"
            } hover:text-white`}
          >
            I
          </button>
          <button
          type="button" 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`underline text-lg ${
              editor.isActive("underline") ? "text-green-400" : "text-gray-300"
            } hover:text-white`}
          >
            U
          </button>
          <button
          type="button" 
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive("highlight")
                ? "bg-yellow-400 text-black"
                : "text-gray-300"
            } hover:text-white`}
          >
            HL
          </button>
        </div>

        {/* === Lists / Quotes */}
        <div className="flex gap-4 items-center pl-6 border-l border-gray-700">
            <button
            type="button" 
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-md ${
                editor.isActive("bulletList")
                  ? "bg-headerGreen text-black"
                  : "text-gray-300 hover:bg-gray-700/60"
              }`}
              title="Bullet List"
            >
              <List size={18} />
            </button>

            <button
            type="button" 
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-md ${
                editor.isActive("orderedList")
                  ? "bg-headerGreen text-black"
                  : "text-gray-300 hover:bg-gray-700/60"
              }`}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </button>
         
          <button
          type="button" 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${
              editor.isActive("blockquote") ? "text-green-400" : "text-gray-300"
            } hover:text-white`}
          >
            ❝ Quote
          </button>
        </div>

        <div className="flex gap-2 items-center pl-6 border-l border-gray-700">
          <button
          type="button" 
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded-md ${
              editor.isActive({ textAlign: "left" })
                ? "bg-green-500/20 text-green-400"
                : "text-gray-300 hover:bg-gray-700/60"
            }`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>

          <button
          type="button" 
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded-md ${
              editor.isActive({ textAlign: "center" })
                ? "bg-green-500/20 text-green-400"
                : "text-gray-300 hover:bg-gray-700/60"
            }`}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>

          <button
          type="button" 
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded-md ${
              editor.isActive({ textAlign: "right" })
                ? "bg-green-500/20 text-green-400"
                : "text-gray-300 hover:bg-gray-700/60"
            }`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
        </div>

        {/* === Undo / Redo === */}
        <div className="flex gap-4 items-center pl-6 ml-auto border-l border-gray-700">
          <button
          type="button" 
            onClick={() => editor.chain().focus().undo().run()}
            className="text-gray-300 hover:text-white"
          >
            ⟲ Undo
          </button>
          <button
          type="button" 
            onClick={() => editor.chain().focus().redo().run()}
            className="text-gray-300 hover:text-white"
          >
            ⟳ Redo
          </button>
        </div>
      </div>

      

    <EditorContent
  editor={editor}
  className="prose prose-invert max-w-none 
             bg-[#0f0f0f] text-white type-text 
             min-h-[70vh] max-h-[90vh]
             resize-y overflow-auto
             border border-gray-700 rounded-lg 
             p-8 focus:outline-none focus:ring-2 focus:ring-green-500/50"
/>
    </>
  );
}

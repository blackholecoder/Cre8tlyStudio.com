import React, { useEffect, useRef, useState } from "react";
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
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import "highlight.js/styles/github-dark.css";
import { Tooltip } from "../tools/toolTip";

export default function BookEditor({ content, setContent }) {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState("dark"); // "dark" | "light"

  const isDark = theme === "dark";

  const toolbarClasses = isDark
    ? "bg-[#111] border-gray-800"
    : "bg-gray-100 border-gray-300";

  const toolbarIconClass = isDark
    ? "text-gray-300 hover:text-white"
    : "text-gray-800 hover:text-black";

  const toolbarBtn =
    "h-9 flex items-center gap-2 px-3 rounded-md text-sm leading-none";

  const editor = useEditor({
    autofocus: "end",
    extensions: [
      TextStyle,
      Color,
      ListItem, // must come first
      BulletList.configure({ keepMarks: true, keepAttributes: true }),
      OrderedList.configure({ keepMarks: true, keepAttributes: true }),
      Blockquote,
      StarterKit.configure({
        history: true,
        bulletList: false, // disable StarterKit’s built-in ones
        orderedList: false,
        blockquote: false, // disable built-in blockquote too
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
        class: "focus:outline-none prose prose-lg max-w-none leading-relaxed",
      },
    },
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  if (editor) window.__EDITOR = editor;

  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [content, editor]);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={`rounded-xl border overflow-hidden
    ${isDark ? "border-gray-800 bg-[#0b0b0b]" : "border-gray-300 bg-white"}
  `}
    >
      <div
        className={`flex justify-between items-center px-4 py-3 border-b
    ${isDark ? "bg-[#0b0b0b] border-gray-800" : "bg-gray-100 border-gray-300"}
  `}
      >
        {/* 🔒 Save Text indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="uppercase tracking-wide">Save Text</span>
          <Tooltip text='Text wrapped in quotes "like this" or brackets [like this] will be preserved and never rewritten by AI.' />
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`
      h-8 px-3 rounded-md text-xs font-medium border transition
      ${
        isDark
          ? "border-gray-600 text-white hover:bg-white/10"
          : "border-gray-400 text-gray-900 hover:bg-black/5"
      }
    `}
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      {/* --- Toolbar --- */}
      <div
        className={`sticky top-0 z-10 ${toolbarClasses}
  px-4 py-3
  border-b
  flex flex-wrap items-center gap-x-6 gap-y-3`}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
          {/* === Text Styles === */}
          <div className="flex gap-3 items-center whitespace-nowrap">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded-md font-semibold text-lg transition-colors ${
                editor.isActive("bold")
                  ? "text-green/90 bg-green/10"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded-md font-semibold text-lg transition-colors ${
                editor.isActive("italic")
                  ? "text-green/90 bg-green/10"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`
              }`}
            >
              I
            </button>
            <button
              type="button"
              className={`px-2 py-1 rounded-md font-semibold text-lg transition-colors ${
                editor.isActive("underline")
                  ? "text-green/90 bg-green/10"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`
              }`}
            >
              U
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                editor.isActive("highlight")
                  ? "bg-yellow/80 text-black"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`
              }`}
            >
              HL
            </button>
          </div>

          {/* === Lists / Quotes */}
          <div
            className={`flex gap-4 items-center pl-6 border-l ${isDark ? "border-gray-700" : "border-gray-300"}`}
          >
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-md ${
                editor.isActive("bulletList")
                  ? "bg-downloadGreen text-black"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`
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
                  ? "bg-downloadGreen text-black"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`
              }`}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                editor.isActive("blockquote")
                  ? "text-green/90 bg-green/10"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`
              }`}
            >
              ❝ Quote
            </button>
          </div>
          {editor.state.selection.from !== editor.state.selection.to && (
            <div
              className={`flex items-center gap-3 pl-6 border-l ${isDark ? "border-gray-700" : "border-gray-300"}`}
            >
              <input
                type="color"
                onChange={(e) =>
                  editor.chain().focus().setColor(e.target.value).run()
                }
                value={editor.getAttributes("textStyle").color || "#ffffff"}
                className="w-8 h-8 cursor-pointer bg-transparent"
                title="Text color"
              />
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}

          <div
            className={`flex gap-2 items-center pl-6 border-l ${isDark ? "border-gray-700" : "border-gray-300"}`}
          >
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-2 rounded-md ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-green-500/20 text-green-400"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`
              }`}
              title="Align Left"
            >
              <AlignLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`p-2 rounded-md ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-green-500/20 text-green-400"
                  : `${toolbarIconClass} ${isDark ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`
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
                  : `${toolbarIconClass} ${isDark ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`
              }`}
              title="Align Right"
            >
              <AlignRight size={18} />
            </button>
          </div>

          {/* === Undo / Redo === */}
          <div
            className={`
            flex gap-4 items-center
            w-full sm:w-auto
            sm:ml-auto
            pt-3 sm:pt-0
            mt-3 sm:mt-0
            border-t sm:border-t-0
            ${isDark ? "border-gray-700" : "border-gray-300"}
          `}
          >
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className={`${toolbarBtn} ${toolbarIconClass}`}
            >
              <span className="text-base">⟲</span>
              <span>Undo</span>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className={`${toolbarBtn} ${toolbarIconClass}`}
            >
              <span className="text-base">⟳</span>
              <span>Redo</span>
            </button>
          </div>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className={`prose max-w-none
    ${isDark ? "prose-invert bg-[#0f0f0f] text-white" : "bg-white text-gray-900"}
    type-text
    min-h-[70vh] max-h-[90vh]
    resize-y overflow-auto
    p-8
    focus:outline-none focus:ring-2 focus:ring-green-500/50`}
      />
    </div>
  );
}

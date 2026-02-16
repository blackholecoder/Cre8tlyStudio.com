import React, { useEffect, useRef, useState, useMemo } from "react";
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
import axiosInstance from "../../api/axios";

function debounce(fn, delay) {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

export default function BookEditor({ bookId, content, setContent }) {
  const DRAFT_KEY = bookId ? `book-editor-draft-${bookId}` : null;

  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [theme, setTheme] = useState("dark");
  const hasInitialized = useRef(false);
  const [spellIssues, setSpellIssues] = useState([]);
  const [showIssues, setShowIssues] = useState(false);

  const isDark = theme === "dark";

  const toolbarClasses = isDark
    ? "bg-[#111] border-gray-800"
    : "bg-gray-100 border-gray-300";

  const toolbarIconClass = isDark
    ? "text-gray-300 hover:text-white"
    : "text-gray-800 hover:text-black";

  const toolbarBtn =
    "h-9 flex items-center gap-2 px-3 rounded-md text-sm leading-none";

  const debouncedUpdate = useMemo(
    () =>
      debounce(({ editor }) => {
        const html = editor.getHTML();

        setIsSaving(true);
        setContent(html);
        if (DRAFT_KEY) {
          localStorage.setItem(DRAFT_KEY, html);
        }

        setTimeout(() => setIsSaving(false), 400);
      }, 300),
    [bookId],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const editor = useEditor({
    extensions: [
      TextStyle,
      Color,
      Blockquote,
      ListItem, // must come first
      BulletList.configure({ keepMarks: true, keepAttributes: true }),
      OrderedList.configure({ keepMarks: true, keepAttributes: true }),

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
        types: ["heading", "paragraph", "listItem"],
      }),
      Placeholder.configure({ placeholder: "Start writing your book..." }),
    ],
    editorProps: {
      attributes: {
        spellcheck: "true",
        autocorrect: "on",
        autocomplete: "on",
        class: "focus:outline-none prose prose-lg max-w-none leading-relaxed",
      },
    },
    onUpdate: debouncedUpdate,
  });

  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();

    if (content !== currentHTML) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  const addToDictionary = async (word) => {
    await axiosInstance.post("/dictionary/add", { word });

    setSpellIssues((prev) => {
      const next = prev.filter((i) => i.word !== word);

      if (next.length === 0) {
        setShowIssues(false);
      }

      return next;
    });
  };

  useEffect(() => {
    if (!editor || spellIssues.length === 0) return;

    const text = editor.getText().toLowerCase();

    setSpellIssues((prev) => {
      const next = prev.filter((issue) =>
        text.includes(issue.word.toLowerCase()),
      );

      if (next.length === 0) {
        setShowIssues(false);
      }

      return next;
    });
  }, [editor?.getText()]);

  if (editor) window.__EDITOR = editor;

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
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Draft
          </span>

          <button
            type="button"
            onClick={async () => {
              if (!editor) return;

              const html = editor.getHTML();
              const plainText = editor.getText();

              setIsSaving(true);
              setContent(html);
              localStorage.setItem(DRAFT_KEY, html);

              // optional backend save
              await axiosInstance.post("/books/draft", {
                bookId,
                draftText: html,
              });

              // 🔍 spellcheck AFTER save
              try {
                const spellcheckRes = await axiosInstance.post(
                  "/books/spellcheck",
                  {
                    text: plainText,
                  },
                );

                const issues = spellcheckRes.data.issues;

                if (issues.length > 0) {
                  setSpellIssues(issues);
                } else {
                  setSpellIssues([]);
                }
              } catch (err) {
                console.warn("Spellcheck failed, save still succeeded", err);
              }

              setIsSaving(false);
              setSavedAt(Date.now());
            }}
            className="px-3 py-1 text-xs rounded bg-green text-black"
          >
            Save
          </button>

          {savedAt && (
            <span className="text-xs text-gray-400">Saved just now</span>
          )}

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

      {spellIssues.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-800 bg-[#0b0b0b]">
          <button
            type="button"
            onClick={() => setShowIssues((v) => !v)}
            className="flex items-center gap-1 text-xs text-yellow-400 hover:underline"
          >
            ⚠ {spellIssues.length} issue{spellIssues.length > 1 ? "s" : ""}
          </button>

          {showIssues && (
            <div className="mt-2 w-full rounded-none border border-gray-700 bg-[#111] px-4 py-3 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase text-gray-400">
                  Spelling issues
                </span>
                <button
                  type="button"
                  onClick={() => setShowIssues(false)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <ul className="space-y-2">
                {spellIssues.map((issue, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-white">{issue.word}</span>

                    <button
                      type="button"
                      onClick={() => addToDictionary(issue.word)}
                      className="text-xs text-green hover:underline"
                    >
                      Add to dictionary
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
        className={`
    prose max-w-none
    ${isDark ? "prose-invert bg-[#0f0f0f] [&_*]:text-white" : "bg-white text-gray-900"}
    type-text
    min-h-[70vh] max-h-[90vh]
    resize-y overflow-auto
    p-8
    focus:outline-none focus:ring-2 focus:ring-green-500/50
  `}
      />
    </div>
  );
}

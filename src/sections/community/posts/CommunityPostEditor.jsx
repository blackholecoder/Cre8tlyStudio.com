import { useEditor, EditorContent } from "@tiptap/react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  Link2,
  Unlink,
  ImageIcon,
  SquarePlay,
  X,
  Code,
  ChevronDown,
  Bold,
  Minus,
} from "lucide-react";
import { LinkModal } from "./LinkModal";
import { VideoModal } from "./VideoModal";
import axiosInstance from "../../../api/axios";

const CommunityPostEditor = forwardRef(({ value, onChange }, ref) => {
  const hydrated = useRef(false);
  const formatRef = useRef(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);

  const editor = useEditor({
    autofocus: "end",
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
        codeBlock: true,
      }),
      Underline,
      HorizontalRule,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        modestBranding: true,
      }),
      Placeholder.configure({
        placeholder: "Write your post...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none text-dashboard-text-light dark:text-dashboard-text-dark",
      },
    },

    onUpdate({ editor }) {
      const html = editor.getHTML();

      // 🚫 ignore empty editor emissions
      if (!html || html.trim() === "<p></p>") return;

      // 🚫 ignore duplicate updates
      if (html === value) return;

      onChange(html);
    },
  });

  const setHeading = (level) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const setParagraph = () => {
    if (!editor) return;
    editor.chain().focus().setParagraph().run();
  };

  // expose commands to parent
  useImperativeHandle(ref, () => ({
    insertImage: (src) => {
      if (!editor) return;

      editor.chain().focus().createParagraphNear().setImage({ src }).run();
    },
  }));

  useEffect(() => {
    if (!formatOpen) return;

    const handleClickOutside = (e) => {
      if (!formatRef.current) return;
      if (!formatRef.current.contains(e.target)) {
        setFormatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formatOpen]);
  // hydrate ONCE
  useEffect(() => {
    if (!editor || hydrated.current) return;

    if (value && value.trim()) {
      editor.commands.setContent(value, false);
      hydrated.current = true;
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className="rounded-xl border border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-dashboard-border-light dark:border-dashboard-border-dark">
          {/* NEW: text style dropdown */}
          <div ref={formatRef} className="relative">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setFormatOpen((v) => !v)}
              className="
              flex items-center justify-between
              min-w-[140px]
              px-3 py-2
              rounded-md
              text-sm font-medium
              bg-dashboard-bg-light dark:bg-dashboard-bg-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              text-dashboard-text-light dark:text-dashboard-text-dark
              hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
            "
            >
              <span>Body</span>
              <ChevronDown size={14} className="opacity-70" />
            </button>

            {/* Dropdown */}
            {formatOpen && (
              <div
                className="
                absolute left-0 mt-1 z-20
                w-44
                rounded-md
                bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light dark:border-dashboard-border-dark
                shadow-lg
                overflow-hidden
              "
              >
                <button
                  onClick={setParagraph}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                >
                  Body
                </button>

                <div className="border-t border-dashboard-border-light dark:border-dashboard-border-dark" />

                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setHeading(level)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                  >
                    Heading H{level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* existing buttons */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`
            p-2 rounded
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
            ${editor.isActive("bold") ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark" : ""}
          `}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
          >
            <Minus size={16} />
          </button>

          <button
            onClick={() => setLinkOpen(true)}
            className="p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
          >
            <Link2 size={16} />
          </button>

          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
          >
            <Unlink size={16} />
          </button>

          <button
            onClick={() => setVideoOpen(true)}
            className="p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
          >
            <SquarePlay size={16} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
          >
            <Code size={16} />
          </button>

          <label className="p-2 rounded cursor-pointer hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark">
            <ImageIcon size={16} />
            <input type="file" hidden />
          </label>
        </div>

        <EditorContent
          editor={editor}
          className="
          p-4
          min-h-[240px]
          max-h-[45vh]
          overflow-y-auto
          post-body
          prose prose-lg max-w-none

          prose-strong:text-inherit
          prose-strong:font-semibold

          prose-a:underline
          prose-a:underline-offset-2
          prose-a:font-medium
          prose-a:text-blue
          prose-a:decoration-blue

          dark:prose-invert
          dark:prose-strong:text-inherit
          dark:prose-a:text-sky-400
          dark:prose-a:decoration-sky-400
        "
        />
      </div>

      <LinkModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        onSubmit={({ url, text }) => {
          if (!url) return;

          const { empty } = editor.state.selection;

          if (empty) {
            editor
              .chain()
              .focus()
              .insertText(text || "click here")
              .setLink({
                href: url,
                target: "_blank",
                rel: "noopener noreferrer",
              })
              .run();
          } else {
            editor
              .chain()
              .focus()
              .setLink({
                href: url,
                target: "_blank",
                rel: "noopener noreferrer",
              })
              .run();
          }
        }}
      />

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        onInsert={(url) => {
          editor
            .chain()
            .focus()
            .setYoutubeVideo({ src: url, width: 640, height: 360 })
            .run();
        }}
      />
    </>
  );
});

export default CommunityPostEditor;

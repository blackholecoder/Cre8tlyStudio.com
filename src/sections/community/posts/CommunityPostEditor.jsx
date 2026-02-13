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
import Blockquote from "@tiptap/extension-blockquote";
import {
  Link2,
  Unlink,
  ImageIcon,
  SquarePlay,
  Code,
  ChevronDown,
  Bold,
  Minus,
  Italic,
  Lock,
} from "lucide-react";
import { LinkModal } from "./LinkModal";
import { VideoModal } from "./VideoModal";
import axiosInstance from "../../../api/axios";
import { MentionMark } from "./MentionMark";
import { SubscriberDivider } from "./SubscriberDivider";

const CommunityPostEditor = forwardRef(
  ({ value, onChange, onMention }, ref) => {
    const formatRef = useRef(null);
    const [linkOpen, setLinkOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    const [formatOpen, setFormatOpen] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const editor = useEditor({
      autofocus: false,
      extensions: [
        StarterKit.configure({
          link: false,
          underline: false,
          blockquote: false,
          heading: {
            levels: [1, 2, 3, 4, 5],
          },
          codeBlock: true,
        }),
        Blockquote,
        Underline,
        HorizontalRule,
        SubscriberDivider,
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
        MentionMark,
      ],
      editorProps: {
        attributes: {
          class:
            "prose prose-lg max-w-none focus:outline-none text-dashboard-text-light dark:text-dashboard-text-dark",
        },
      },

      onUpdate({ editor }) {
        const html = editor.getHTML();

        // text only, no markup
        const text = editor.state.doc.textBetween(
          0,
          editor.state.doc.content.size,
          " ",
        );

        const charCount = text.length;
        setWordCount(charCount);

        // 🚫 ignore empty editor emissions
        if (!html || html.trim() === "<p></p>") return;

        // 🚫 ignore duplicate updates
        if (html === value) return;

        const { from } = editor.state.selection;
        const beforeCursor = editor.state.doc.textBetween(
          Math.max(0, from - 50),
          from,
          " ",
        );

        const match = beforeCursor.match(/@([a-zA-Z0-9_]*)$/);

        if (match && match[1].length > 0) {
          // notify parent
          onMention?.(match[1]);
        } else {
          onMention?.(null);
        }

        onChange(html);
      },
    });

    const setHeading = (level) => {
      if (!editor) return;

      const { from, to, empty } = editor.state.selection;
      if (empty) return;

      const text = editor.state.doc.textBetween(from, to, " ");

      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent({
          type: "heading",
          attrs: { level },
          content: [{ type: "text", text }],
        })
        .run();
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
      insertMention: (username) => {
        if (!editor) return;

        const { state } = editor;
        const { from } = state.selection;

        // Look backwards from cursor to find @mention
        const textBefore = state.doc.textBetween(
          Math.max(0, from - 50),
          from,
          " ",
        );

        const match = textBefore.match(/@([a-zA-Z0-9_]*)$/);
        if (!match) return;

        const mentionStart = from - match[0].length;

        editor
          .chain()
          .focus()
          .deleteRange({
            from: mentionStart,
            to: from,
          })
          .insertContent({
            type: "text",
            text: `@${username}`,
            marks: [
              {
                type: "mention",
                attrs: { username },
              },
            ],
          })
          .insertContent(" ")
          .run();
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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [formatOpen]);

    useEffect(() => {
      if (!editor) return;
      if (!value || !value.trim()) return;

      const current = editor.getHTML();

      if (current === value) return;

      editor.commands.setContent(value, false);
    }, [editor, value]);

    if (!editor) return null;

    return (
      <>
        <div className="rounded-xl border border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
          {/* Toolbar */}
          <div
            className="
          flex items-center gap-2
          px-3 py-2
          border-b border-dashboard-border-light dark:border-dashboard-border-dark

          overflow-x-auto  
          overflow-y-visible
          whitespace-nowrap

          md:overflow-visible
          md:whitespace-normal
          no-scrollbar
        "
          >
            {/* NEW: text style dropdown DESKTOP ONLY */}
            <div ref={formatRef} className="shrink-0 relative hidden md:block">
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setFormatOpen((v) => !v)}
                className="
              shrink-0
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

            {/* Mobile heading buttons */}
            <div className="flex gap-1 shrink-0 md:hidden">
              <button
                onClick={setParagraph}
                className="
      px-3 py-2 text-sm rounded
      border border-dashboard-border-light dark:border-dashboard-border-dark
      bg-dashboard-bg-light dark:bg-dashboard-bg-dark
      text-dashboard-text-light dark:text-dashboard-text-dark
      hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
    "
              >
                Body
              </button>

              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  onClick={() => setHeading(level)}
                  className="
        px-3 py-2 text-sm rounded shrink-0
        border border-dashboard-border-light dark:border-dashboard-border-dark
        bg-dashboard-bg-light dark:bg-dashboard-bg-dark
        text-dashboard-text-light dark:text-dashboard-text-dark
        hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
      "
                >
                  H{level}
                </button>
              ))}
            </div>

            {/* existing buttons */}
            <button
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: "subscriberDivider",
                  })
                  .run();
              }}
              className="shrink-0 p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
              title="Subscriber Only Divider"
            >
              <Lock size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`
              shrink-0
            p-2 rounded
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark 
            ${editor.isActive("bold") ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark" : ""}
          `}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`
            shrink-0
            p-2 rounded
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
            ${editor.isActive("italic") ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark" : ""}
          `}
            >
              <Italic size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`
            shrink-0
            p-2 rounded
            hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
            ${editor.isActive("blockquote") ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark" : ""}
          `}
              title="Quote"
            >
              ❝
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="shrink-0 p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            >
              <Minus size={16} />
            </button>

            <button
              onClick={() => setLinkOpen(true)}
              className="shrink-0 p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            >
              <Link2 size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="shrink-0 p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            >
              <Unlink size={16} />
            </button>

            <button
              onClick={() => setVideoOpen(true)}
              className="shrink-0 p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            >
              <SquarePlay size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="shrink-0 p-2 rounded hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            >
              <Code size={16} />
            </button>

            <label className="shrink-0 p-2 rounded cursor-pointer hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark">
              <ImageIcon size={16} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const formData = new FormData();
                    formData.append("image", file); // 👈 MUST be "image"

                    const res = await axiosInstance.post(
                      "/community/upload-image",
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      },
                    );

                    const imageUrl = res.data?.image_url;
                    if (!imageUrl) return;

                    editor
                      .chain()
                      .focus()
                      .createParagraphNear()
                      .setImage({ src: imageUrl })
                      .run();
                  } catch (err) {
                    console.error("Image upload failed:", err);
                  } finally {
                    // allow re-selecting the same file
                    e.target.value = "";
                  }
                }}
              />
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

          prose-headings:mt-6 prose-headings:mb-2
          prose-p:my-3

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
          <div
            className="
    flex justify-end
    px-4 py-2
    text-xs

    bg-dashboard-hover-light
    dark:bg-dashboard-hover-dark

    text-dashboard-muted-light
    dark:text-dashboard-muted-dark

    border-t
    border-dashboard-border-light
    dark:border-dashboard-border-dark

    rounded-b-xl
  "
          >
            {wordCount} words
          </div>
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
  },
);

export default CommunityPostEditor;

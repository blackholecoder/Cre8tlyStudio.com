import { Mark, mergeAttributes } from "@tiptap/core";

export const MentionMark = Mark.create({
  name: "mention",

  inclusive: false,

  addAttributes() {
    return {
      username: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-mention]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-mention": "",
        class: "mention-inline",
      }),
      0,
    ];
  },
});

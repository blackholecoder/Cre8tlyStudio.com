import { Node } from "@tiptap/core";

export const SubscriberDivider = Node.create({
  name: "subscriberDivider",

  group: "block",

  atom: true,
  selectable: true,
  isolating: true, // 🔥 IMPORTANT
  defining: true, // 🔥 IMPORTANT

  parseHTML() {
    return [
      {
        tag: 'div[data-subscriber-divider="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        ...HTMLAttributes,
        "data-subscriber-divider": "true",
        contenteditable: "false",
        class: "subscriber-divider-wrapper",
      },
      [
        "div",
        { class: "subscriber-divider-inner" },
        ["div", { class: "subscriber-divider-top" }, "⬆ Free Content Above"],
        ["hr", { class: "subscriber-divider-line" }],
        [
          "div",
          { class: "subscriber-divider-bottom" },
          "⬇ Paid Content Below",
        ],
      ],
    ];
  },
});

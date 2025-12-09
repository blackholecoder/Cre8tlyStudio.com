import React from "react";
import {
  BookOpen,
  FileText,
  Layers,
  Move,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function CanvasEditorDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "adding-elements", label: "Adding Elements" },
    { id: "editing", label: "Editing Elements" },
    { id: "styling", label: "Colors, Gradients, and Shadows" },
    { id: "alignment", label: "Alignment and Smart Guides" },
    { id: "tips", label: "Best Practices" },
    { id: "errors", label: "Troubleshooting" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 text-white relative">
      {/* FIXED SIDEBAR */}
      <aside className="hidden lg:block w-64 fixed left-[180px] top-[120px] z-20">
        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Canvas Editor Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Learn how to design, customize, and build your entire Lead Magnet or
            Pro Document visually.
          </p>

          <ul className="space-y-1 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white transition text-gray-300 text-xs"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto bg-black/70 rounded-2xl shadow-lg p-8">
        <main className="pb-16">
          {/* Header */}
          <header className="mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  Canvas Editor
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  A visual editor for designing every page with full control
                  over layout, style, and branding.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated Time, varies by project
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <Layers className="w-3 h-3 text-green" />
                Best For, creators who want full design freedom
              </span>
            </div>
          </header>

          {/* 1. Intro */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              The Canvas Editor is where your ideas become real pages. You can
              add shapes, text, images, arrows, and design elements, place them
              anywhere, style them however you want, and create a fully branded
              layout without needing any external design tools.
            </p>

            <p className="text-sm text-gray-300">
              Everything you add stays fully editable — you can move it, resize
              it, style it, adjust shadows, swap colors, rotate it, and more at
              any time.
            </p>
          </section>

          {/* 2. Adding Elements */}
          <section id="adding-elements" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. Adding Elements
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              You can add the following elements directly onto the canvas:
            </p>

            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2 mb-3">
              <li>
                <strong>Shapes</strong>
                Rectangles, rounded boxes, circles, backgrounds, callouts.
              </li>
              <li>
                <strong>Text</strong>
                Titles, descriptions, callouts, labels, and more.
              </li>
              <li>
                <strong>Images</strong>
                Upload your own assets or choose from millions of Unsplash
                images.
              </li>
              <li>
                <strong>Arrows</strong>
                Great for tutorials, explainer pages, or pointing to items.
              </li>
            </ol>

            <p className="text-sm text-gray-300">
              Every element can be dragged, resized, rotated, duplicated, and
              deleted easily.
            </p>
          </section>

          {/* 3. Editing Elements */}
          <section id="editing" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. Editing Elements
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              When you select an element, its properties appear in the
              right-side panel. You can adjust:
            </p>

            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Width and height</li>
              <li>Rotation angle</li>
              <li>Opacity</li>
              <li>Corner radius (for shapes)</li>
              <li>Resizable text box width (for text)</li>
              <li>Font family and size</li>
            </ol>

            <p className="text-sm text-gray-300">
              The editor is made to feel natural — if you’ve ever dragged
              something on your desktop, you already know how to use it.
            </p>
          </section>

          {/* 4. Styling */}
          <section id="styling" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. Colors, Gradients, and Shadows
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Every visual element has full styling controls:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Solid fill color</li>
              <li>Linear gradient (from, to, angle)</li>
              <li>Border color and thickness</li>
              <li>Shadow color, radius, opacity, and angle</li>
              <li>Blend modes (multiply, overlay, soft light, etc.)</li>
            </ul>

            <p className="text-sm text-gray-300">
              You can create modern, high-end designs easily — neon glows, soft
              drop shadows, Apple-style gradients, dark-mode blocks, and more.
            </p>
          </section>

          {/* 5. Alignment */}
          <section id="alignment" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              5. Alignment & Smart Guides
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              While dragging shapes or text, the editor automatically displays
              blue alignment guides:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Center guides</li>
              <li>Edge alignment guides</li>
              <li>Spacing guides</li>
              <li>Snap-to-grid behavior</li>
            </ul>

            <p className="text-sm text-gray-300">
              These guides help you build clean, balanced layouts without
              eyeballing spacing.
            </p>
          </section>

          {/* 6. Tips */}
          <section id="tips" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              6. Best Practices
              <Sparkles className="w-4 h-4 text-gray-400" />
            </h2>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Use gradients sparingly to highlight important sections</li>
              <li>Keep text sizes consistent across pages</li>
              <li>Use alignment guides for clean spacing</li>
              <li>Group similar colors to maintain visual consistency</li>
              <li>Use duplicated elements for uniform layouts</li>
            </ul>
          </section>

          {/* 7. Troubleshooting */}
          <section id="errors" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              7. Troubleshooting
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Items Not Selecting
                </h3>
                <p className="text-sm text-gray-300">
                  Make sure you're not clicking behind the object. If layers
                  overlap, you may need to temporarily move items aside.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Shadow Looks Too Strong
                </h3>
                <p className="text-sm text-gray-300">
                  Lower the opacity, reduce radius, or switch to "multiply" mode
                  for a softer effect.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Text Not Wrapping
                </h3>
                <p className="text-sm text-gray-300">
                  Switch to “Box Mode” to enable word wrapping inside a bounding
                  area.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

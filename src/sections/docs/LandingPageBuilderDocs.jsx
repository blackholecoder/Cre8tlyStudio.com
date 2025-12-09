import React from "react";
import {
  BookOpen,
  CreditCard,
  Settings,
  HelpCircle,
  PanelsTopLeft,
} from "lucide-react";

export default function LandingBuilderDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "overview", label: "What the Landing Page Builder Does" },
    { id: "layout", label: "Layout and Interface" },
    { id: "blocks", label: "Block Basics" },
    { id: "hero-block", label: "Hero Sections" },
    { id: "feature-blocks", label: "Feature and Benefit Blocks" },
    { id: "testimonial-blocks", label: "Testimonials and Social Proof" },
    { id: "offer-pricing", label: "Offer and Pricing Blocks" },
    { id: "media-blocks", label: "Images and Video Blocks" },
    { id: "cta-buttons", label: "Buttons and Calls-to-Action" },
    { id: "branding", label: "Branding, Colors, and Backgrounds" },
    { id: "stripe", label: "Stripe Checkout Block" },
    { id: "seo", label: "SEO, URL, and Meta Settings" },
    { id: "mobile", label: "Mobile Layout and Responsiveness" },
    { id: "saving", label: "Saving, Previewing, and Publishing" },
    { id: "analytics", label: "Analytics and Tracking" },
    { id: "best-practices", label: "Best Practices" },
    { id: "troubleshooting", label: "Troubleshooting" },
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
              Landing Builder Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Learn how to design, brand, and publish high-converting landing
            pages with Cre8tly Studio.
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
              <PanelsTopLeft className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  Landing Page Builder
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  A block-based builder for creating branded, Stripe-ready
                  landing pages that sell your digital products.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated Time, 5 to 15 minutes per page
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                Best For, lead magnets, sales pages, and digital product offers
              </span>
            </div>
          </header>

          {/* 1. Introduction */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              The Landing Page Builder is where you turn your lead magnets,
              books, and digital products into a live, shareable experience. It
              lets you stack pre-designed blocks, connect Stripe checkout, and
              ship a clean, on-brand page without touching raw HTML or CSS.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              Every landing page you create in Cre8tly Studio is built from
              reusable blocks. You can reorder them, change backgrounds, swap
              images, and customize copy while keeping the layout consistent and
              conversion-focused.
            </p>
            <p className="text-sm text-gray-300">
              The goal, move from “I have a product” to “I have a page that can
              take payments and capture attention” in a single working session.
            </p>
          </section>

          {/* 2. What the Landing Page Builder Does */}
          <section id="overview" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. What the Landing Page Builder Does
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              The builder acts as a visual layer on top of your content and
              product data. It:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Lets you assemble pages using pre-built sections (blocks)</li>
              <li>
                Connects directly to Stripe so visitors can purchase without
                extra tools
              </li>
              <li>
                Applies your brand colors, gradients, and fonts from Settings
              </li>
              <li>Generates a public URL for each published landing page</li>
              <li>Works with templates so you can reuse proven layouts</li>
            </ul>
            <p className="text-sm text-gray-300">
              Think of it as your “front door” for each offer, controlled fully
              inside Cre8tly Studio.
            </p>
          </section>

          {/* 3. Layout and Interface */}

          <section id="layout" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. Layout and Interface
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              The Landing Page Builder uses an expandable block system. Every
              block contains its own settings. All editing is done directly
              inside the block itself.
            </p>

            <p className="text-sm text-gray-300 mb-3">
              The interface is made up of three main parts:
            </p>

            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>
                <span className="font-semibold">Live Page Preview</span> — the
                page is rendered exactly how visitors will see it while you
                build.
              </li>
              <li>
                <span className="font-semibold">Expandable Blocks</span> — each
                block (Image, h1, FAQs, Testimonials, Pricing, Stripe Checkout,
                etc.) contains its own controls. Click a block to expand it and
                reveal all editable fields for that section.
              </li>
              <li>
                <span className="font-semibold">Block Actions</span> — every
                block includes built-in tools such as:
                <ul className="list-disc list-inside ml-5 mt-1 text-gray-400 space-y-1">
                  <li>Move Up / Move Down</li>
                  <li>Delete Block</li>
                  <li>Collapse / Expand</li>
                </ul>
              </li>
            </ol>

            <p className="text-sm text-gray-300">
              Instead of separating design controls into a right sidebar, the
              Cre8tly Builder keeps everything together inside the block you're
              working on. This keeps editing fast, simple, and intuitive without
              navigating between panels.
            </p>
          </section>

          {/* 4. Block Basics */}
          <section id="blocks" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. Block Basics
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Everything on your page is a block. Blocks keep your design
              consistent while giving you room to customize copy and visuals.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Add new blocks from the “Add Block” or “+” controls</li>
              <li>Reorder blocks using drag handles or move up / move down</li>
              <li>Delete/Remove blocks you no longer need</li>
            </ul>
            <p className="text-sm text-gray-300">
              Different block types come with different fields, but they all
              follow the same principle, structured inputs that output a
              polished section.
            </p>
          </section>

          {/* 5. Hero Sections */}
          <section id="hero-block" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              5. Hero Sections
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              The hero block is usually the first section on your landing page.
              It sets the tone, explains what the visitor is looking at, and
              gives them a clear next step.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Headline and subheadline</li>
              <li>Support text or bullet list</li>
              <li>Primary call-to-action button (e.g. “Get Instant Access”)</li>
              <li>Optional supporting image, mockup, or cover</li>
            </ul>
            <p className="text-sm text-gray-300">
              Use your hero to answer, “What is this, who is it for, and why
              should I care right now?”
            </p>
          </section>

          {/* 6. Feature and Benefit Blocks */}
          <section id="feature-blocks" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              6. Feature and Benefit Sections
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Feature sections help you break down what is inside your product
              or offer. These often appear under the hero section.
            </p>
            <p className="text-sm text-gray-300 mb-3">
              Typical fields include:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Section title (e.g. “What You Will Get”)</li>
              <li>Subtitle or one-line promise</li>
              <li>3 to 6 feature items with titles and descriptions</li>
              <li>Optional icons or checkmarks</li>
            </ul>
            <p className="text-sm text-gray-300">
              Focus each feature on outcomes, not just components. Instead of
              “12 videos,” write “12 short lessons that you can finish in a
              weekend.”
            </p>
          </section>

          {/* 7. Testimonials and Social Proof */}
          <section id="testimonial-blocks" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              7. Testimonials and Social Proof
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Testimonial blocks are designed to showcase real results, trust,
              and proof. They are especially useful before or after your pricing
              section.
            </p>
            <p className="text-sm text-gray-300 mb-3">
              You can usually configure:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Quote text or result summary</li>
              <li>Customer name and role</li>
              <li>Optional avatar or image</li>
              <li>Optional rating stars or badges</li>
            </ul>
            <p className="text-sm text-gray-300">
              Use testimonials that speak to the same pains and goals your
              hero’s headline introduces.
            </p>
          </section>

          {/* 8. Offer and Pricing Blocks */}
          <section id="offer-pricing" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              8. Offer and Pricing Blocks
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Offer blocks are where you clearly state the price, what is
              included, and what buyers receive when they pay.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Plan title (e.g. “Business Builder Annual”)</li>
              <li>Price and billing frequency</li>
              <li>Feature checklist or inclusions list</li>
              <li>Primary button that connects to Stripe Checkout</li>
              <li>Guarantee or reassurance text under the button</li>
            </ul>
            <p className="text-sm text-gray-300">
              Keep this section simple and direct. The only job of this block is
              to make the decision feel safe and obvious.
            </p>
          </section>

          {/* 9. Images and Video Blocks */}
          <section id="media-blocks" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              9. Images and Video Blocks
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Media blocks are used to show screenshots, mockups, previews, or
              short embedded videos of your product in action.
            </p>
            <p className="text-sm text-gray-300 mb-3">Common uses,</p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Showing the inside of a lead magnet</li>
              <li>Previewing the dashboard or builder</li>
              <li>Demonstrating a process visually</li>
            </ul>
            <p className="text-sm text-gray-300">
              Use clean, high-contrast visuals and avoid overloading this block
              with text. Let the image or video do the heavy lifting.
            </p>
          </section>

          {/* 10. Buttons and Calls-to-Action */}
          <section id="cta-buttons" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              10. Buttons and Calls-to-Action
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              CTA buttons are the bridge between reading and taking action.
              Throughout your page, you will see buttons that either scroll to
              the Stripe section, open checkout, or jump to key content.
            </p>
            <p className="text-sm text-gray-300 mb-3">
              Best practices for CTAs in the builder:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>
                Use action phrases, “Get Instant Access” or “Start the Trial”
              </li>
              <li>Match button color to your brand’s primary accent</li>
              <li>Repeat CTAs after major sections (story → proof → CTA)</li>
            </ul>
            <p className="text-sm text-gray-300">
              In many blocks, the button can be linked to the Stripe Checkout
              Block.
            </p>
          </section>

          {/* 11. Branding, Colors, and Backgrounds */}
          <section id="branding" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              11. Branding, Colors, and Backgrounds
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Every block in the Landing Page Builder controls its own colors,
              backgrounds, and visual styling. There is also global text color
              settings. Each block includes its own collapsible styling panel
              where you can customize exactly how that section looks.
            </p>

            <p className="text-sm text-gray-300 mb-3">
              Most blocks include a background and color panel with options
              like:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>
                <span className="font-semibold">Use No Background</span>
                Leaves the block completely transparent so it blends with the
                page.
              </li>

              <li>
                <span className="font-semibold">Solid Color</span>
                Pick a color with the built-in color picker or type a HEX code
                for an exact match.
              </li>

              <li>
                <span className="font-semibold">Gradient Background</span>
                Enable gradient mode and choose:
                <ul className="list-disc list-inside ml-5 mt-1 text-gray-400 space-y-1">
                  <li>Start color (picker or HEX input)</li>
                  <li>End color (picker or HEX input)</li>
                  <li>Gradient angle or direction</li>
                </ul>
              </li>

              <li>
                <span className="font-semibold">Match Main Background</span>
                Uses the same color that the top hero or main theme block is
                using, giving you a consistent banded layout.
              </li>
            </ul>

            <p className="text-sm text-gray-300">
              Because each block controls its own styling independently, you can
              mix transparent sections, solid bands, and gradients on the same
              page while keeping full control over how every part of your
              landing page looks.
            </p>
          </section>

          {/* 12. Stripe Checkout Block */}
          <section id="stripe" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              12. Stripe Checkout Block
              <CreditCard className="w-4 h-4 text-gray-400" />
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              The Stripe Checkout Block is what turns your landing page into a
              sales engine. Each block connects a single published PDF inside
              your Cre8tly Studio account to your Stripe Express account so you
              can sell digital products securely and instantly.
            </p>

            <p className="text-sm text-gray-300 mb-3">
              Cre8tly Studio does not allow outside links, external files, or
              downloads. You can only sell PDFs you have created and published
              inside your Cre8tly account. This ensures clean delivery, proper
              analytics tracking, and secure fulfillment for buyers.
            </p>

            <p className="text-sm text-gray-300 mb-3">
              When you add a Stripe Checkout Block, you choose one of your
              published PDFs as the product. Cre8tly automatically links it to
              your Stripe Express account and configures the checkout
              experience.
            </p>

            <p className="text-sm text-gray-300 mb-3">The setup includes:</p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Selecting which published PDF to sell</li>
              <li>Connecting the PDF to your Stripe Express account</li>
              <li>Choosing the payment type, one-time or subscription</li>
              <li>Customizing the checkout button label</li>
              <li>Setting success and cancellation redirects</li>
            </ul>

            <p className="text-sm text-gray-300 mb-3">
              You are not limited to one offer. You can add multiple Stripe
              Checkout Blocks to the same landing page to sell:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Different PDFs</li>
              <li>Different price points</li>
              <li>Different subscription tiers</li>
              <li>Bundles, upgrades, or add-ons</li>
            </ul>

            <p className="text-sm text-gray-300 mb-3">
              Each Stripe block operates independently, so visitors can choose
              whichever offer they want. This gives you complete flexibility
              when designing funnels, upsells, cross-sells, or multi-product
              pages.
            </p>

            <p className="text-sm text-gray-300">
              After purchasing, customers complete payment through Stripe’s
              secure checkout and are automatically redirected to a dedicated
              Thank You page. Their purchased PDF is instantly available for
              download, and the revenue is deposited directly into your
              connected Stripe Express account.
            </p>
          </section>

          {/* 14. SEO, URL, and Meta Settings */}
          <section id="seo" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              13. URL and Public Link
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Each landing page in Cre8tly Studio is published on its own custom
              subdomain. Instead of managing slugs or manual meta tags, you
              choose a subdomain name and Cre8tly Studio handles the rest.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>
                <span className="font-semibold">Custom Subdomain,</span> pick a
                unique name for your page, for example{" "}
                <span className="font-mono text-gray-400">thedigitalstore</span>
                .
              </li>
              <li>
                <span className="font-semibold">Public URL,</span> your page is
                published at{" "}
                <span className="font-mono text-gray-400">
                  https://theblueprint.cre8tlystudio.com
                </span>{" "}
                (using whatever subdomain you chose).
              </li>
              <li>
                <span className="font-semibold">Automatic Meta Handling,</span>{" "}
                Cre8tly Studio manages the basic metadata and structure behind
                the scenes so you can focus on your offer and design instead of
                SEO setup.
              </li>
            </ul>

            <p className="text-sm text-gray-300">
              Choose a clear, memorable subdomain that matches your offer or
              brand name, so when you share the link, people instantly recognize
              what the page is about.
            </p>
          </section>

          {/* 15. Mobile Layout and Responsiveness */}
          <section id="mobile" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              15. Mobile Layout and Responsiveness
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Most visitors will see your landing page on a phone. The builder
              is designed so blocks stack cleanly on smaller screens, with text
              sizes and spacing adjusted for readability.
            </p>
            <p className="text-sm text-gray-300 mb-3">
              Inside the editor, you may have options to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Preview how blocks collapse into a single column</li>
              <li>Check how long headlines look on narrow screens</li>
              <li>Ensure buttons stay large enough to tap easily</li>
            </ul>
            <p className="text-sm text-gray-300">
              Always review your page on mobile before publishing. A great
              desktop design still needs a frictionless mobile experience.
            </p>
          </section>

          {/* 16. Saving, Previewing, and Publishing */}
          <section id="saving" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              16. Saving, Previewing, and Version Management
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Cre8tly Studio gives you full control over how your landing page
              evolves. You can update the live version instantly, or create
              separate versions to test new layouts, colors, or offers without
              affecting what your visitors see.
            </p>

            {/* Live Saving */}
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Live Saving
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Clicking <span className="font-semibold">Save Changes</span>{" "}
              instantly updates the live landing page. Any edits you make—text,
              layout changes, block settings, colors, or Stripe buttons—become
              visible to the public immediately after saving.
            </p>

            {/* Versions */}
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Creating Page Versions
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Versions let you experiment freely without touching your live
              design. This is ideal for A/B layouts, new designs, seasonal
              updates, or major revisions.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>
                <span className="font-semibold">
                  First Time Saving a Version:
                </span>{" "}
                you are prompted to name it manually (for example:
                <span className="font-mono text-gray-400">Summer Redesign</span>
                ).
              </li>

              <li>
                <span className="font-semibold">Each version after that</span>{" "}
                is automatically numbered, such as
                <span className="font-mono text-gray-400">Version 2</span>,
                <span className="font-mono text-gray-400">Version 3</span>, etc.
              </li>

              <li>
                Versions do <span className="font-semibold">not</span> affect
                the live site until you apply them.
              </li>
            </ul>

            {/* Applying Versions */}
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Applying and Managing Versions
            </h3>

            <p className="text-sm text-gray-300 mb-3">
              The Versions Panel allows you to preview, apply, or delete any
              saved version.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>
                <span className="font-semibold">Preview</span> a version without
                changing the live site.
              </li>

              <li>
                <span className="font-semibold">Apply</span> a version to load
                it into the editor so you can continue editing or make it live.
              </li>

              <li>
                <span className="font-semibold">Delete</span> a version if you
                no longer need it.
              </li>
            </ul>

            <p className="text-sm text-amber-400 font-semibold mb-4">
              ⚠️ Important, after applying a version you must click{" "}
              <span className="underline">Save Changes</span> for it to become
              the new live public site.
            </p>

            {/* Preview */}
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Preview Mode
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Preview mode opens your landing page in a clean, visitor-ready
              display without the editor UI. This is ideal for testing spacing,
              mobile layout, scrolling behavior, and the full customer flow.
            </p>

            {/* Publishing */}
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Publishing / Live Site Behavior
            </h3>
            <p className="text-sm text-gray-300">
              Cre8tly Studio does not require a separate publishing step. The
              live site is updated the moment you click{" "}
              <span className="font-semibold">Save Changes</span>. Applying a
              version does not go live until you save.
            </p>
          </section>

          {/* 17. Analytics and Tracking */}
          <section id="analytics" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              17. Analytics and Tracking
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Landing pages feed directly into your Seller Dashboard analytics.
              Over time, you will see:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Total views and unique visitors</li>
              <li>Clicks on key buttons and Stripe checkout</li>
              <li>Conversion insights connected to your products</li>
            </ul>
            <p className="text-sm text-gray-300">
              Use this data to test different headlines, offers, and layouts by
              duplicating pages and comparing performance.
            </p>
          </section>

          {/* 18. Best Practices */}
          <section id="best-practices" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              18. Best Practices
              <Settings className="w-4 h-4 text-gray-400" />
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Keep one main goal per page, download, buy, or book.</li>
              <li>Use one clear CTA repeated multiple times.</li>
              <li>
                Start with a template, then tweak copy to match your voice.
              </li>
              <li>
                Use Testimonials and Proof near your pricing or Stripe section.
              </li>
              <li>
                Ensure your hero, offer, and Stripe block all tell the same
                story.
              </li>
            </ul>
          </section>

          {/* 19. Troubleshooting */}
          <section id="troubleshooting" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              19. Troubleshooting
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My page is not loading the latest changes
                </h3>
                <p>
                  Make sure you saved and re-published the landing page. Then
                  refresh the public URL or open it in a private browser tab to
                  avoid cached content.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Stripe button is not working
                </h3>
                <p>
                  Confirm your Stripe account is connected in Settings and that
                  a valid price or product ID is configured inside the Stripe
                  Checkout Block.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Page looks broken on mobile
                </h3>
                <p>
                  Check for extremely long words, unbroken URLs, or oversized
                  images in your hero or feature blocks. Shorten text and
                  re-upload optimized images if needed.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My page is not showing in analytics yet
                </h3>
                <p>
                  Analytics update over time. If the page is brand new, visit it
                  from another device or browser to generate initial data, then
                  revisit the Seller Dashboard.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

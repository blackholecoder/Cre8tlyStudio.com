import React from "react";
import {
  BookOpen,
  FileText,
  Sparkles,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function ProDocuments() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "start", label: "Starting a New Pro Document" },
    { id: "structure", label: "Document Structure and Length" },
    { id: "content", label: "Writing High Quality Content" },
    { id: "branding", label: "Branding and Design" },
    { id: "formats", label: "Export Formats" },
    { id: "submit", label: "Generating Your Pro Document" },
    { id: "tips", label: "Professional Tips" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 text-white relative">
      {/* FLOATING SIDEBAR */}
      <aside className="hidden lg:block w-64 fixed left-[180px] top-[120px] z-20">
        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Pro Documents
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            A full guide for creating professional ebooks, guides, and digital
            documents inside Cre8tly Studio Pro.
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

          <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-700">
            <p className="text-xs text-gray-300 mb-1 font-medium">Tip</p>
            <p className="text-xs text-gray-400">
              Keep this page open as you build. Each section aligns with the
              exact fields inside Pro Document Creator.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto bg-black/70 rounded-2xl shadow-lg p-8">
        <main className="pb-16">
          {/* HEADER */}
          <header className="mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  How To Create Pro Documents in Cre8tly Studio
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  A complete walkthrough for building professional ebooks,
                  long-form guides, and high quality digital documents.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated time, 10 to 15 minutes
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-green" />
                Best for, ebooks, guides, training manuals
              </span>
            </div>
          </header>

          {/* INTRO */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              Pro Documents allow you to create high quality, professionally
              designed books, guides, and long-form content using the Cre8tly
              Studio Pro system. These documents are ideal for ebooks,
              Kindle-ready content, lead generation assets, educational
              materials, and training manuals.
            </p>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              Unlike Lead Magnets, Pro Documents support complex structure,
              longer content, multiple chapters, branded layouts, and deeper
              customization options. This guide explains each step so you can
              create polished, publication-ready documents with ease.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              You will learn how to control page count, structure chapters,
              format long content, apply branding, and generate your book or
              guide in a clean, reader-ready design.
            </p>
          </section>

          {/* START */}
          <section id="start" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. Starting A New Pro Document
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300 mb-3">
              <li>Open your Cre8tly Studio dashboard.</li>
              <li>Navigate to the Pro Documents section.</li>
              <li>Select Create New Pro Document.</li>
              <li>You will see the expanded Pro Document Creator fields.</li>
            </ol>
            <p className="text-xs text-gray-400">
              Pro Documents are available to Pro Subscription users only.
            </p>
          </section>

          {/* STRUCTURE */}
          <section id="structure" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. Document Structure and Length
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              3.1 Page Count and Chapters
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Pro Documents support significantly longer content than lead
              magnets. You can define your total desired length, and the system
              will structure chapters and sections accordingly.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>Minimum recommended length, 8 to 12 pages</li>
              <li>Average ebook length, 15 to 25 pages</li>
              <li>Advanced guides, 25+ pages depending on topic</li>
            </ul>

            <p className="text-xs text-gray-400">
              Longer documents may take slightly more time to generate depending
              on your structure and selected formatting.
            </p>
          </section>

          {/* CONTENT */}
          <section id="content" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. Writing High Quality Content
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              4.1 Using the Pro Content Editor
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              The Pro Editor allows you to write long-form content, including
              detailed chapters, structured lessons, lists, stories, and
              educational frameworks. This is where you describe exactly what
              you want your ebook or guide to include.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>Maximum content size, 100,000 characters</li>
              <li>Supports multi-chapter prompts</li>
              <li>
                Supports formatting instructions like “Chapter 1,” “Section
                Breakdown,” “Include examples,” etc.
              </li>
            </ul>

            <p className="text-xs text-gray-400">
              The more detailed your content prompt is, the more precise your
              final ebook will be.
            </p>
          </section>

          {/* BRANDING */}
          <section id="branding" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              5. Branding And Design
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              5.1 Cover Design
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              You can upload your own cover image if you want full creative
              control, or choose from over 5 million royalty-free images from
              Unsplash to use as your cover.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              5.2 Logo and Brand Identity
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Pro Documents fully support logo placement, brand colors, and
              typography that matches your business identity.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              5.3 Typography and Themes
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Choose from premium typefaces and page themes designed for
              readability in longer books.
            </p>
          </section>
          <section id="cta" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              6. Closing Message And Call To Action
            </h2>

            <p className="text-sm text-gray-300 mb-2">
              The closing Call To Action appears at the end of your lead magnet.
              This is where you invite the reader to take the next step with
              you, such as following, subscribing, booking a call, or joining
              your program.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              6.1 CTA Dropdown
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Above the CTA text area, there is a small dropdown with options.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>
                Use My Saved CTA, loads the default CTA from your user profile
              </li>
              <li>
                Write New CTA, clears the field so you can type a fresh closing
                message for this document
              </li>
            </ul>
            <p className="text-xs text-gray-400 mb-3">
              If you already saved a CTA in your account, choosing the saved
              option is the fastest way to stay consistent across lead magnets.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              6.2 Writing A Strong CTA
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Use this space to clearly tell the reader what to do next.
            </p>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 mb-2">
              <li>Invite them to join your newsletter for more tips</li>
              <li>Direct them to a low ticket offer or main product</li>
              <li>
                Ask them to reply, book a call, or fill out an application
              </li>
            </ul>
            <p className="text-xs text-gray-400">
              The CTA is included at the end of your generated PDF and can be
              changed any time before you regenerate.
            </p>
          </section>

          {/* FORMATS */}
          <section id="formats" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              7. Export Formats
            </h2>
            <p className="text-sm text-gray-300 mb-2">
              Pro Documents can be exported in multiple formats depending on
              your publishing goals.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>High-resolution PDF for downloads</li>
              <li>Print-ready PDF with bleed margins</li>
              <li>EPUB (Kindle & ebook compatible)</li>
              <li>Web-optimized PDF for viewing online</li>
            </ul>
            <p className="text-xs text-gray-400">
              Export options may vary depending on your selected template and
              structure.
            </p>
          </section>

          {/* SUBMIT */}
          <section id="submit" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              8. Generating Your Pro Document
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              8.1 Before You Submit
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>Review your chapter structure</li>
              <li>Confirm your branding settings</li>
              <li>Double-check your title and subtitle</li>
              <li>Ensure your content prompt is complete</li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              8.2 What Happens When You Generate
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Once you submit, Cre8tly Studio formats your content, applies your
              theme, builds a table of contents, designs the cover, and
              assembles your book into a professional-grade document.
            </p>
            <p className="text-xs text-gray-400">
              Larger ebooks may take slightly longer to generate due to chapter
              size and structure.
            </p>
          </section>

          <section id="link" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              9. Optional Link Button
            </h2>
            <p className="text-sm text-gray-300 mb-2">
              The Optional Link or Call To Action field lets you add a single
              URL that will appear at the bottom of your PDF as a button.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>Use it for your website, checkout page, or calendar</li>
              <li>
                Make sure the link starts with https, for example https colon
                slash slash yoursite dot com
              </li>
            </ul>
            <p className="text-xs text-gray-400">
              The button is styled to match your overall document theme, so it
              feels natural inside the design.
            </p>
          </section>

          {/* Section 8 */}
          <section id="submit" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              10. Submitting And Generating Your Lead Magnet
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              10.1 Submit Button States
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              At the bottom of the form you will see the main button labeled
              Submit Prompt.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>
                If your prompt is empty or only contains a blank line, the
                button is disabled until you add text
              </li>
              <li>
                If your prompt is too long, the button is disabled until you
                shorten it
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              10.2 What Happens When You Submit
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              When the form passes validation and you click Submit Prompt, your
              content, theme, logo, cover, CTA, link, and settings are sent to
              the server. The system then generates a PDF based on your
              selections.
            </p>
            <p className="text-xs text-gray-400">
              You can then view, edit, design, download, or manage this lead
              magnet from your dashboard.
            </p>
          </section>

          {/* TIPS */}
          <section id="tips" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              11. Professional Tips
              <Settings className="w-4 h-4 text-gray-400" />
            </h2>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>Use clear chapter headings to guide structure</li>
              <li>Include stories, examples, and action steps</li>
              <li>Keep paragraphs short for readability</li>
              <li>Choose a theme that fits your niche and tone</li>
              <li>Use your CTA wisely at the end of the ebook</li>
            </ul>

            <p className="text-xs text-gray-400">
              Return to this guide anytime. Every section matches the exact
              options inside Pro Document Creator.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

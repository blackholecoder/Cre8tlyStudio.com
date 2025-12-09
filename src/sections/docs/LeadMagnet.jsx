import React from "react";
import {
  BookOpen,
  FileText,
  Sparkles,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function LeadMagnetPage() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "start", label: "Starting a New Lead Magnet" },
    { id: "setup", label: "Setting Up Your Document" },
    { id: "prompt", label: "Writing Your Prompt" },
    { id: "branding", label: "Branding and Design" },
    { id: "cta", label: "Closing Message and CTA" },
    { id: "link", label: "Optional Link Button" },
    { id: "submit", label: "Submitting and Generating" },
    { id: "troubleshooting", label: "Troubleshooting" },
    { id: "tips", label: "Best Practices and Tips" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 text-white relative">
      {/* FLOATING SIDEBAR - fixed on left */}
      <aside className="hidden lg:block w-64 fixed left-[180px] top-[120px] z-20">
        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Lead Magnet Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Use this guide while building your lead magnet inside Cre8tly
            Studio.
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
              Keep this page open in a tab while you build, and follow each
              section step by step.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN DOCS CARD */}
      <div className="max-w-3xl mx-auto bg-black/70 rounded-2xl shadow-lg p-8">
        <main className="pb-16">
          {/* Header */}
          <header className="mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  How To Create A Lead Magnet In Cre8tly Studio
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  A step by step guide that shows you exactly how to create your
                  lead magnet inside Cre8tly Studio.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated time, 5 to 7 minutes
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-green" />
                Best for, beginners and creators
              </span>
            </div>
          </header>

          {/* Section 1 */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              The Lead Magnet Creator in Cre8tly Studio is built to help you
              turn one detailed prompt into a fully designs lead magnet PDF. You
              do not have to worry about layout, spacing, fonts, or design, the
              platform handles the structure for you.
            </p>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              A lead magnet is a free resource you give away in exchange for an
              email address or a follow, for example a guide, checklist,
              workbook, starter kit, or cheatsheet. Inside Cre8tly Studio, you
              simply enter your idea, choose your styling, and the system
              creates the document for you.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              This page explains every field in the form, including pages,
              title, prompt, cover, logo, color theme, font, call to action, and
              optional link, so you know exactly what each step does and how it
              shows up in your final PDF.
            </p>
          </section>

          {/* Section 2 */}
          <section id="start" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. Starting A New Lead Magnet
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300 mb-3">
              <li>Open your Cre8tly Studio dashboard.</li>
              <li>Go to the Lead Magnets area in your navigation.</li>
              <li>Click the button to create a new lead magnet or project.</li>
              <li>
                You will be taken to the Lead Magnet Prompt form with fields
                that match this guide.
              </li>
            </ol>
            <p className="text-xs text-gray-400">
              If you do not see the creator, make sure you are logged in with a
              user account that has lead magnet access.
            </p>
          </section>

          {/* Section 3 */}
          <section id="setup" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. Setting Up Your Document
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              3.1 Number Of Pages
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              The field labeled Number of Pages controls how long your lead
              magnet will be. You can type a number or use the arrow buttons
              beside the input to increase or decrease the total.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 mb-2 space-y-1">
              <li>Minimum pages, 1</li>
              <li>Maximum pages on paid plans, 25</li>
              <li>
                Maximum pages on the free plan, 5, the system prevents going
                beyond this and may show an upgrade message
              </li>
            </ul>
            <p className="text-xs text-gray-400 mb-4">
              If you try to go over your plan limit, the generator keeps you at
              the maximum that your plan allows, and for free users it may show
              a friendly notice about upgrading.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              3.2 Document Title
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              The Document Title appears at the top of your generated lead
              magnet and is stored with your project. Use a clear, benefit
              driven title that tells the reader exactly what they are getting.
            </p>
            <p className="text-xs text-gray-400 mb-1">Example titles,</p>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 mb-2">
              <li>The Beginners Guide To Launching Digital Products</li>
              <li>Seven Day Content Plan For New Coaches</li>
              <li>Meal Planning Blueprint For Busy Parents</li>
            </ul>
            <p className="text-xs text-gray-400">
              You can change this title any time before you submit, and then
              regenerate a new version if you want a different name.
            </p>
          </section>

          {/* Section 4 */}
          <section id="prompt" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. Writing Your Prompt
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              4.1 What The Prompt Editor Does
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              The large white editor box is your prompt field. This is where you
              describe the content you want Cre8tly Studio to generate, for
              example who the audience is, what the topic is, what sections to
              include, tone, and any examples or bullets.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>Maximum length, 100,000 characters</li>
              <li>
                Live character counter in the bottom right of the prompt area
              </li>
              <li>Soft warning when you reach about 90 percent of the limit</li>
              <li>Hard stop and error if you go over the full limit</li>
            </ul>
            <p className="text-xs text-gray-400 mb-4">
              If you cross the limit, the form shows a warning message and a
              toast notification, and you will need to shorten the prompt before
              you can submit.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              4.2 Validation And Empty Prompt Errors
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              When you click Submit Prompt, the system cleans out any HTML tags
              from the editor and checks if there is any real text left. If the
              cleaned prompt is empty, it shows an inline error and a toast
              message that a prompt is required.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              You must enter at least some meaningful text for the generator to
              run.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              4.3 Free Plan Behavior
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              On the free plan, the prompt editor is locked. You can view sample
              content but you cannot type, edit, highlight, or copy from the
              editor. A transparent overlay sits on top of the editor to block
              interaction.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              To unlock full editing, upgrade to a paid plan and the overlay is
              removed so you can type directly in the editor.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              4.4 Using Pre Made Prompts, Paid Feature
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              If you are on a paid plan, you will see a Pre Made Prompts section
              above the editor. This lets you quickly load a ready made prompt
              for popular use cases, then tweak it instead of writing from
              scratch.
            </p>
            <p className="text-xs text-gray-400">
              If you are on the free plan, this area is replaced with an upgrade
              message and a button that links to the plans page.
            </p>
          </section>

          {/* Section 5 */}
          <section id="branding" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              5. Branding And Design
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              5.1 Cover Upload
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              The Cover section lets you upload an image that will be used as
              the front cover of your lead magnet. This is often the first
              impression a reader sees, so choose a clear, high quality design.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Recommended, use a vertical image with good resolution, text
              should be large enough to read on smaller screens.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              5.2 Logo Upload, Paid Feature
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              If you are on a paid plan, you can upload a logo that will be
              embedded into your lead magnet. The form shows a preview of your
              logo so you can confirm it looks right before generating.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Free plans show a locked logo section with an upgrade option,
              since logo uploads are reserved for paying users.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              5.3 Color Theme
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              The Color Theme chooser controls the overall background and accent
              style of your document. When you pick a theme, that choice is
              carried into the final PDF design.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Use a theme that matches your brand colors so your lead magnet
              feels consistent with your other content.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              5.4 Font Selector
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              The Font Selector lets you choose the main typeface for your
              document.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>Free plan, limited font choices</li>
              <li>Paid plans, more fonts and custom fonts</li>
            </ul>
            <p className="text-xs text-gray-400">
              Choose a font that is easy to read, especially for longer guides.
            </p>
          </section>

          {/* Section 6 */}
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

          {/* Section 7 */}
          <section id="link" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              7. Optional Link Button
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
              8. Submitting And Generating Your Lead Magnet
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              8.1 Submit Button States
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              At the bottom of the form you will see the main button labeled
              Submit Prompt, or a trial message if your account is limited.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>
                If your trial is expired, the button becomes disabled and
                reminds you to upgrade
              </li>
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
              8.2 What Happens When You Submit
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

          {/* Section 9 */}
          <section id="troubleshooting" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              9. Troubleshooting
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My prompt will not submit
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>
                    Check that the editor has real text, not just a blank line
                  </li>
                  <li>
                    Look at the character counter, make sure you are under
                    100,000
                  </li>
                  <li>
                    Make sure you are on a paid plan if you need to edit the
                    prompt, free plans are view only
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  The page count stops at five pages
                </h3>
                <p className="text-sm text-gray-300">
                  Free accounts are capped at five pages, upgrade to increase
                  your limit up to twenty five pages per lead magnet.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My logo or cover does not look right
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>
                    Confirm that you are on a plan that includes logo uploads
                  </li>
                  <li>
                    Use a clear image with enough resolution so it stays sharp
                    inside the PDF
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="tips" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              10. Best Practices And Tips
              <Settings className="w-4 h-4 text-gray-400" />
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2">
              <li>
                Write a prompt that clearly explains who the reader is and what
                they want
              </li>
              <li>
                Ask for sections, bullets, and examples so the document feels
                structured
              </li>
              <li>
                Use a page count that matches the promise, short and focused is
                usually better
              </li>
              <li>
                Choose a color theme and font that match your brand identity
              </li>
              <li>
                Use the CTA and optional link to point readers to your main
                offer or email list
              </li>
            </ul>
            <p className="text-xs text-gray-400">
              You can return to this page any time while you are building, use
              the table of contents on the left to jump to any step.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

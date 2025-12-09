import React from "react";
import {
  BookOpen,
  FileText,
  Sparkles,
  HelpCircle,
  Settings,
} from "lucide-react";

export default function SmartPromptDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "how-it-works", label: "How It Works" },
    { id: "fields", label: "Understanding Each Field" },
    { id: "generation", label: "How Prompts Are Generated" },
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
              Smart Prompt Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Learn how to use the Smart Prompt Builder to generate perfectly
            structured prompts.
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
                  Smart Prompt Builder
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  A simple guided flow that helps you create powerful prompts by
                  answering a few targeted questions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated Time, 1 to 2 minutes
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-green" />
                Best For, beginners, creators, and busy professionals
              </span>
            </div>
          </header>

          {/* Intro */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              The Smart Prompt Builder helps you generate a perfectly
              structured, professional prompt without having to write everything
              from scratch.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              Instead of guessing what to say, you answer a few key questions
              about your audience, their pain point, the result they want, and
              (optionally) your offer or next step.
            </p>
            <p className="text-sm text-gray-300">
              The system takes your answers and builds a complete prompt that
              connects the audience, pain, and transformation in a clear
              narrative.
            </p>
          </section>

          {/* How it Works */}
          <section id="how-it-works" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. How It Works
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              The AI Smart Prompt Builder uses your answers to craft a complete
              prompt that feels clean, professional, and tailored to your
              audience. No guessing, no blank-page moments, just a polished
              prompt ready to use.
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>You answer the four questions</li>
              <li>Your Brand Settings File is included, if uploaded</li>
              <li>The AI generates a customized prompt</li>
              <li>The final prompt appears instantly in your editor</li>
            </ol>
          </section>

          {/* Fields */}
          <section id="fields" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. Understanding Each Field
            </h2>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              3.1 Audience
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Describe who your content is for. This helps the system set tone,
              perspective, and context.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              3.2 Pain Point
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Explain the main struggle or frustration the audience is facing.
              The clearer this is, the stronger your final prompt becomes.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              3.3 Desired Result
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Describe the transformation they want. This is the emotional
              driver that shapes the entire prompt.
            </p>

            <h3 className="text-sm font-semibold text-gray-200 mb-1">
              3.4 Offer (Optional)
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              If your document is meant to lead into an offer, you can include
              it here. When used, the system will connect the result to your
              next step.
            </p>
          </section>

          {/* Generation */}
          <section id="generation" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. How Prompts Are Generated
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              When you click <span className="font-semibold">Generate</span>,
              the builder sends your fields to your prompt-generation API. The
              server blends your inputs with your saved tone, writing style, and
              user preferences, producing a clean, structured prompt that is
              ready for your Lead Magnet Creator or Pro Documents Creator.
            </p>
          </section>

          {/* Best Practices */}
          <section id="tips" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              5. Best Practices
              <Settings className="w-4 h-4 text-gray-400" />
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Be specific about your audience</li>
              <li>Describe a clear, real pain point</li>
              <li>Focus the desired result on transformation</li>
              <li>Add an offer if your document is part of a funnel</li>
              <li>Use the builder when you want fast, consistent prompts</li>
            </ul>
          </section>

          {/* Troubleshooting */}
          <section id="errors" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              6. Troubleshooting
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Missing Fields
                </h3>
                <p className="text-sm text-gray-300">
                  The Generate button will show an error if Audience, Pain, or
                  Result are empty.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Prompt Did Not Generate
                </h3>
                <p className="text-sm text-gray-300">
                  Check your internet connection or try again. If the issue
                  continues, confirm that your account is logged in properly.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

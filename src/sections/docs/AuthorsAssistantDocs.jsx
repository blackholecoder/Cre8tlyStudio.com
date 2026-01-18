import { FileEdit } from "lucide-react";

export default function AuthorsAssistantDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "what-it-is", label: "What Author’s Assistant Is" },
    { id: "what-it-is-not", label: "What It Is Not" },
    { id: "projects", label: "Books and Projects" },
    { id: "sections", label: "Section-Based Writing" },
    { id: "editing", label: "Editing and Revisions" },
    { id: "uploads", label: "Uploading Existing Material" },
    { id: "memory", label: "Long-Form Memory" },
    { id: "drafts", label: "Draft Saving and Safety" },
    { id: "covers", label: "Book Covers" },
    { id: "finalizing", label: "Finalizing a Book" },
    { id: "exporting", label: "Exporting and Publishing" },
    { id: "workflow", label: "Recommended Workflow" },
    { id: "best-practices", label: "Best Practices" },
    { id: "troubleshooting", label: "Troubleshooting" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 text-white relative">
      {/* SIDEBAR */}
      <aside className="hidden lg:block w-64 fixed left-[180px] top-[120px] z-20">
        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileEdit className="w-4 h-4 text-green" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Author’s Assistant Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-4">
            Learn how to write, revise, finalize, and publish full-length books
            using a structured workflow built for serious authors.
          </p>

          <ul className="space-y-1 text-xs">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollTo(section.id)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white transition text-gray-300"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto bg-black/70 rounded-2xl shadow-lg p-8">
        <main className="pb-16">
          {/* HEADER */}
          <header className="mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <FileEdit className="w-6 h-6 text-green" />
              <h1 className="text-2xl font-bold text-silver">
                Author’s Assistant
              </h1>
            </div>
            <p className="text-xs text-gray-400 ml-9">
              A structured writing and publishing system for completing real
              books without compromising your voice.
            </p>
          </header>

          {/* 1. Introduction */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Author’s Assistant is a long-form writing and publishing system
              designed to help you finish real books. It is built for authors
              who value structure, revision control, and intentional completion.
            </p>
            <p className="text-sm text-gray-300">
              Every book is treated as a project, every chapter as a deliberate
              section, and every revision as part of a clear process.
            </p>
          </section>

          {/* 2. What It Is */}
          <section id="what-it-is" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. What Author’s Assistant Is
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Section-based book writing</li>
              <li>Unlimited revisions per section</li>
              <li>Project-level long-form memory</li>
              <li>Draft preservation and safety</li>
              <li>Finalization and EPUB publishing</li>
            </ul>
            <p className="text-sm text-gray-300">
              It supports clear thinking, deliberate editing, and real
              completion.
            </p>
          </section>

          {/* 3. What It Is Not */}
          <section id="what-it-is-not" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. What It Is Not
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Author’s Assistant does not write books for you.
            </p>
            <p className="text-sm text-gray-300">
              It does not invent facts, overwrite intent, or replace your
              thinking. The AI exists to refine and support what you write, not
              to generate disposable content.
            </p>
          </section>

          {/* 4. Projects */}
          <section id="projects" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. Books and Projects
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Each book is its own project with isolated memory and structure.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Title and metadata</li>
              <li>Sections and chapters</li>
              <li>Uploaded reference material</li>
              <li>Finalization state</li>
            </ul>
          </section>

          {/* 5. Sections */}
          <section id="sections" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              5. Section-Based Writing
            </h2>
            <p className="text-sm text-gray-300">
              Writing is broken into sections so you can focus deeply without
              being overwhelmed by a single document.
            </p>
          </section>

          {/* 6. Editing */}
          <section id="editing" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              6. Editing and Revisions
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Each section can be rewritten, expanded, shortened, or refined
              independently.
            </p>
            <p className="text-sm text-gray-300">
              Revisions do not affect other sections, allowing safe, focused
              editing.
            </p>
          </section>

          {/* 7. Uploads */}
          <section id="uploads" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              7. Uploading Existing Material
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>PDF manuscripts</li>
              <li>Text documents</li>
              <li>Outlines and notes</li>
            </ul>
          </section>

          {/* 8. Memory */}
          <section id="memory" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              8. Long-Form Memory
            </h2>
            <p className="text-sm text-gray-300">
              Author’s Assistant maintains awareness of your entire book, not
              just isolated prompts.
            </p>
          </section>

          {/* 9. Drafts */}
          <section id="drafts" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              9. Draft Saving and Safety
            </h2>
            <p className="text-sm text-gray-300">
              All progress is saved automatically. You can leave and return at
              any time without losing work.
            </p>
          </section>

          {/* 10. Covers */}
          <section id="covers" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              10. Book Covers
            </h2>
            <p className="text-sm text-gray-300">
              Upload a custom cover to include it in your final EPUB export.
            </p>
          </section>

          {/* 11. Finalizing */}
          <section id="finalizing" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              11. Finalizing a Book
            </h2>
            <p className="text-sm text-gray-300">
              Finalizing locks all sections and creates a canonical version
              ready for publishing.
            </p>
          </section>

          {/* 12. Exporting */}
          <section id="exporting" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              12. Exporting and Publishing
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Export individual sections as PDFs during writing.
            </p>
            <p className="text-sm text-gray-300">
              Once finalized, export a complete EPUB compatible with Kindle and
              major ebook platforms.
            </p>
          </section>

          {/* 13. Workflow */}
          <section id="workflow" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              13. Recommended Workflow
            </h2>
            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
              <li>Create a book project</li>
              <li>Write sections</li>
              <li>Revise intentionally</li>
              <li>Upload a cover</li>
              <li>Finalize the book</li>
              <li>Export EPUB</li>
            </ol>
          </section>

          {/* 14. Best Practices */}
          <section id="best-practices" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              14. Best Practices
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Write one section at a time</li>
              <li>Finalize only when complete</li>
              <li>Use AI to refine, not replace</li>
            </ul>
          </section>

          {/* 15. Troubleshooting */}
          <section id="troubleshooting">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              15. Troubleshooting
            </h2>
            <p className="text-sm text-gray-300">
              If a section cannot be edited, check whether the book has been
              finalized. Finalized books are locked by design.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

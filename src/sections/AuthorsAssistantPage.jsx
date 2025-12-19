import { Sparkles, BookOpen, FileText, PenTool, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bookFeature } from "../assets/images";

export default function AuthorsAssistant() {
  const navigate = useNavigate();

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-6 py-28">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI Writing Assistant
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Write Entire Books Faster With Author’s Assistant
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Create, edit, and export full-length books using AI that remembers
              your story, your tone, and your progress. Cre8tly does not write
              books for you. It refines and elevates your own writing, enhancing
              clarity and cinematic flow while preserving your voice. For
              nonfiction, it stays grounded in your material and does not invent
              characters, places, or events. Built for serious authors,
              creators, and entrepreneurs who want to publish faster without
              sacrificing quality.
            </p>
          </p>
        </div>

        <div className="mt-20 w-full rounded-3xl bg-gray-100 overflow-hidden shadow-xl relative">
          {/* Media container */}
          <div className="aspect-[16/9] w-full">
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium">
              <img
                src={bookFeature}
                alt="Cre8tly Studio platform preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-24">
          <Feature
            icon={BookOpen}
            iconColor="text-white bg-blue"
            title="750 Pages of Writing Power"
            text="Generate up to 750 pages per project with long form memory that continues your story naturally."
          />

          <Feature
            icon={PenTool}
            iconColor="text-white bg-blue"
            title="Continues Your Story From Memory"
            text="Author’s Assistant remembers your plot, characters, and writing style across sessions."
          />

          <Feature
            icon={FileText}
            iconColor="text-white bg-blue"
            title="Upload Any Text or Document"
            text="Start from an existing manuscript, notes, or outline by uploading your own files."
          />

          <Feature
            icon={Sparkles}
            iconColor="text-white bg-blue"
            title="Generate Chapters Instantly"
            text="Create full chapters in seconds or refine individual sections on demand."
          />

          <Feature
            icon={PenTool}
            iconColor="text-white bg-blue"
            title="Rewrite, Expand, or Shorten"
            text="Fine tune any paragraph, chapter, or section with one click editing controls."
          />

          <Feature
            icon={BookOpen}
            iconColor="text-white bg-blue"
            title="Live Book Preview & Editing"
            text="See your book take shape in real time with live previews and inline editing."
          />

          <Feature
            icon={Sparkles}
            iconColor="text-white bg-blue"
            title="Pro Level Book Covers"
            text="Design professional covers with premium styling built directly into the workflow."
          />

          <Feature
            icon={FileText}
            iconColor="text-white bg-blue"
            title="Premium Font Selection"
            text="Choose from high quality fonts for a polished, publication ready look."
          />

          <Feature
            icon={Download}
            iconColor="text-white bg-blue"
            title="One Click Export"
            text="Export your finished book instantly as PDF or DOCX when you are ready to publish."
          />
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-extrabold text-gray-900">
            Turn Your Ideas Into Published Work
          </h3>

          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Author’s Assistant gives you the power of a full writing studio,
            without the complexity. Start writing, refining, and publishing
            today.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigateWithReferral("/plans")}
              className="px-8 py-4 rounded-xl bg-blue text-white font-semibold hover:opacity-90 transition"
            >
              Try Author’s Assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, text, iconColor }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div
        className={`flex items-center justify-center h-12 w-12 rounded-xl mb-4 ${iconColor}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>

      <p className="text-gray-600">{text}</p>
    </div>
  );
}

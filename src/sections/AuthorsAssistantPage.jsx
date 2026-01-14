import {
  Sparkles,
  BookOpen,
  FileText,
  PenTool,
  Download,
  Upload,
} from "lucide-react";
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
          <span className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium mb-6 tracking-wide">
            <Sparkles className="h-4 w-4" />
            AI Writing Assistant
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold text-gray-900 leading-[1.1] tracking-tight">
            Write, Edit, and Finish Books With Author’s Assistant
          </h1>

          <p className="mt-6 text-[17px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Create, organize, and finish full length books with an AI system
            built for serious authors. Author’s Assistant structures your work
            into sections, saves every draft, supports unlimited revisions, and
            allows you to import your own material. It does not write books for
            you. It strengthens your thinking, sharpens your writing, and helps
            you complete meaningful work without compromising your voice.
          </p>
        </div>

        <div className="mt-20 w-full rounded-2xl bg-white overflow-hidden border border-gray-200">
          {/* Media container */}
          <div className="aspect-[16/9] w-full">
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium">
              <img
                src={bookFeature}
                alt="Cre8tly Studio platform preview"
                className="w-full h-full object-cover shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 pt-24">
          <Feature
            icon={BookOpen}
            iconColor="text-blue bg-blue/10"
            title="Section Based Book Writing"
            text="Write your book in structured sections instead of one long document, making complex ideas easier to manage."
          />

          <Feature
            icon={PenTool}
            iconColor="text-blue bg-blue/10"
            title="Endless Editing and Revisions"
            text="Rewrite, expand, shorten, or refine any section as many times as you want without starting over."
          />

          <Feature
            icon={FileText}
            iconColor="text-blue bg-blue/10"
            title="Save Drafts Automatically"
            text="Your progress is always saved. Come back anytime and continue writing exactly where you left off."
          />

          <Feature
            icon={Upload}
            iconColor="text-blue bg-blue/10"
            title="Upload PDFs and Documents"
            text="Import existing manuscripts, notes, outlines, or research from PDFs or text documents."
          />

          <Feature
            icon={Sparkles}
            iconColor="text-blue bg-blue/10"
            title="AI Assisted Section Refinement"
            text="Improve clarity, flow, and structure while keeping your original meaning and voice intact."
          />

          <Feature
            icon={BookOpen}
            iconColor="text-blue bg-blue/10"
            title="Long Form Memory Per Project"
            text="Author’s Assistant understands your book as a whole, not just isolated prompts."
          />

          <Feature
            icon={FileText}
            iconColor="text-blue bg-blue/10"
            title="Upload Your Own Book Cover"
            text="Bring your own professionally designed cover and attach it to your book before export."
          />

          <Feature
            icon={PenTool}
            iconColor="text-blue bg-blue/10"
            title="Built for Nonfiction and Fiction"
            text="Works with real world material or storytelling without inventing facts or altering intent."
          />

          <Feature
            icon={Download}
            iconColor="text-blue bg-blue/10"
            title="Export When You Are Ready"
            text="Download your finished book as PDF or DOCX when publishing or sharing."
          />
        </div>

        {/* CTA */}
        <div className="mt-28 text-center border-t border-gray-200 pt-16">
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
              className="px-8 py-4 rounded-lg bg-blue text-white font-medium hover:bg-blue/90 transition"
            >
              Try Author’s Assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-gray-300">
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition" />

      {/* Icon */}
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-blue/10 text-blue">
        <Icon className="h-5 w-5" />
      </div>

      {/* Title */}
      <h4 className="text-[15px] font-semibold text-gray-900 tracking-tight">
        {title}
      </h4>

      {/* Body */}
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}

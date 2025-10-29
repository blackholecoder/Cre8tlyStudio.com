import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, Timer, Eye, Plus, Layers, Rocket } from "lucide-react";
import PDFPreviewModal from "../../components/dashboard/PDFPreviewModal";
import BookPartsModal from "./BookPartsModal";
import OnboardingGuide from "../onboarding/OnboardingGuide";
import { useAuth } from "../../admin/AuthContext";
import api from "../../api/axios";

export default function BookGrid({ books = [], onAddPrompt, onGenerateNext }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [activeBookId, setActiveBookId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { accessToken, user, refreshUser } = useAuth();

  const steps = [
    {
      target: ".book-title",
      content: "This displays the title of your book project.",
    },
    {
      target: ".pages-progress",
      content:
        "Displays how many pages you’ve used so far. Each book slot includes up to 750 total pages.",
    },
    {
      target: ".book-status",
      content: "Indicates your book’s current status.",
    },
    {
      target: ".book-actions",
      content:
        "Use these buttons to add chapters, preview, or continue your book.",
    },
  ];

  useEffect(() => {
    if (books.length > 0 && user && !user.has_completed_book_onboarding) {
      const timer = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timer);
    }
  }, [books, user]);

  function openPartsModal(bookId) {
    setActiveBookId(bookId);
    setShowPartsModal(true);
  }

  if (!Array.isArray(books) || books.length === 0) return null;

  return (
    <>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {books.map((b) => (
          <motion.div
            key={b.id}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative group bg-[#0a0a0a]/90 rounded-2xl p-4 border border-gray-800 hover:border-green hover:shadow-[0_0_15px_rgba(0,255,150,0.25)] transition-all"
          >
            {/* Glimmer Shine */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[25deg] opacity-0 group-hover:opacity-100 animate-glimmer" />
            </div>

            {/* Title */}
            <h3 className="book-title text-white text-sm font-semibold truncate mb-2">
              {b.book_name || "Untitled Book"}
            </h3>

            {/* Metadata: Part & Purchase Date */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
              <span>Part {b.part_number || 1}</span>
              <span>
                {new Date(b.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="pages-progress flex flex-col items-center my-3">
              <div className="w-full bg-gray-800 rounded-full overflow-hidden h-2">
                <div
                  className="bg-gradient-to-r from-green to-royalPurple h-2"
                  style={{ width: `${Math.min((b.pages / 750) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {b.pages || 0}/750 pages
              </p>
            </div>

            {/* Status */}
            <div className="book-status text-xs font-semibold text-center mt-3">
              {b.status === "pending" ? (
                <div className="flex items-center justify-center gap-2 text-yellow italic">
                  <svg
                    className="animate-spin h-4 w-4 text-yellow"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Generating…
                </div>
              ) : b.status === "failed" ? (
                <span className="bg-red-500 text-white px-3 py-[3px] rounded-full">
                  Failed
                </span>
              ) : b.pages >= 750 ? (
                <span className="bg-green text-black px-3 py-[3px] rounded-full">
                  Completed
                </span>
              ) : b.pages > 0 ? (
                <span className="bg-blue text-white px-3 py-[3px] rounded-full">
                  In Progress
                </span>
              ) : (
                <span className="bg-gray-600 text-white px-3 py-[3px] rounded-full">
                  Idle
                </span>
              )}
            </div>

            {/* Prompt Indicator */}
            <div className="flex justify-center items-center mt-3">
              {b.prompt ? (
                <CheckCircle size={18} className="text-headerGreen" />
              ) : (
                <Timer size={18} className="text-gray-500" />
              )}
            </div>

            {/* Created Timestamp */}
            <div className="text-[11px] text-gray-400 text-center mt-2">
              {b.created_at_prompt ? (
                <>
                  {new Date(b.created_at_prompt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(b.created_at_prompt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </>
              ) : (
                <span className="italic text-gray-500">N/A</span>
              )}
            </div>

            {/* Actions */}
            <div className="book-actions flex flex-col items-stretch gap-2 mt-4 w-full">
              {!b.prompt && (
                <button
                  onClick={() => onAddPrompt(b.id, b.part_number)}
                  className="w-full bg-green text-black rounded-lg py-2 text-sm font-semibold hover:bg-green transition-all"
                  title="Create Chapter"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={16} />
                    <span>Add Chapter</span>
                  </div>
                </button>
              )}
              {/* Continue Draft button */}
              {(b.has_part_1 === 0 && (b.is_draft === 1 || b.draft_text)) && (
                <button
                  onClick={() => onAddPrompt(b.id, b.part_number || 1)}
                  className="w-full bg-blue hover:bg-blue text-white rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  title="Continue Draft"
                >
                  <Rocket size={16} />
                  <span>Continue Draft</span>
                </button>
              )}

              {b.pdf_url && (
                <>
                  <button
                    onClick={() =>
                      setPreviewUrl({
                        url: b.pdf_url,
                        title: b.book_name || "Untitled",
                        partNumber: b.part_number || 1,
                      })
                    }
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 text-sm transition-all"
                    title="Preview Book"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Eye
                        size={16}
                        className={`${b.pages >= 750 ? "text-green" : "text-white"}`}
                      />
                      <span>
                        {b.pages >= 750 ? "Download Book" : "Preview"}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => openPartsModal(b.id)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2 transition"
                    title="View All Parts"
                  >
                    <Layers size={16} />
                    <span>View All Parts</span>
                  </button>
                </>
              )}

              {b.prompt && b.pages < 750 && (
                <button
                  onClick={() => onGenerateNext(b.id, (b.part_number || 1) + 1)}
                  className="w-full bg-royalPurple text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  title="Continue Story"
                >
                  <Rocket size={16} />
                  <span>
                    {b.pages >= 740
                      ? "Finish Book"
                      : `Continue Story (Part ${(b.part_number || 1) + 1})`}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl.url}
          fileTitle={previewUrl.title}
          partNumber={previewUrl.partNumber}
          sourceType="book"
          onClose={() => setPreviewUrl(null)}
        />
      )}

      {/* Book Parts Modal */}
      {showPartsModal && (
        <BookPartsModal
          bookId={activeBookId}
          accessToken={accessToken}
          onClose={() => setShowPartsModal(false)}
        />
      )}

      {/* Onboarding */}
      {showOnboarding && (
        <OnboardingGuide
          steps={steps}
          onFinish={async () => {
            try {
              localStorage.setItem("bookOnboardingComplete", "true");
              setShowOnboarding(false);
              await api.post(
                "https://cre8tlystudio.com/api/books/book-complete",
                { userId: user?.id },
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                }
              );
              await refreshUser();
            } catch (err) {
              console.error("❌ Failed to save onboarding status:", err);
            }
          }}
        />
      )}
    </>
  );
}

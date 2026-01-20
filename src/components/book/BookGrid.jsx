import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, Timer, Plus, Layers, Rocket } from "lucide-react";
import PDFPreviewModal from "../../components/dashboard/PDFPreviewModal";
import BookPartsModal from "./BookPartsModal";
import OnboardingGuide from "../onboarding/OnboardingGuide";
import { useAuth } from "../../admin/AuthContext";
import axiosInstance from "../../api/axios";
import { Tooltip } from "../tools/toolTip";

export default function BookGrid({ books = [], onAddPrompt, onGenerateNext }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [activeBookId, setActiveBookId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, refreshUser } = useAuth();

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
        {books.map((b) => {
          const isFinalized = b.is_complete === 1;
          const canContinue = !isFinalized && b.pages < 750;
          const canEdit = !isFinalized && b.can_edit === 1;

          return (
            <motion.div
              key={b.id}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="
              relative group
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
              rounded-2xl p-4
              transition-all
              hover:border-green
              hover:shadow-[0_0_15px_rgba(0,255,150,0.25)]
            "
            >
              {/* Glimmer Shine */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[25deg] opacity-0 group-hover:opacity-100 animate-glimmer" />
              </div>

              {/* Title */}
              <h3
                className="book-title text-dashboard-text-light
dark:text-dashboard-text-dark text-sm font-semibold truncate mb-2"
              >
                {b.book_name || "Untitled Book"}
              </h3>

              {/* Metadata: Part & Purchase Date */}
              <div
                className="flex items-center justify-between text-[11px] text-dashboard-muted-light
dark:text-dashboard-muted-dark
 mb-2"
              >
                <span>Part {b.part_number || 1}</span>
              </div>

              {/* Progress Bar */}
              <div className="pages-progress flex flex-col items-center my-3">
                <div
                  className="
                  w-full rounded-full h-2
                  bg-dashboard-border-light
                  dark:bg-dashboard-border-dark
"
                >
                  <div
                    className="bg-gradient-to-r from-green to-royalPurple h-2"
                    style={{
                      width: `${Math.min((b.pages / 750) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <p
                    className="text-xs text-dashboard-muted-light
dark:text-dashboard-muted-dark
"
                  >
                    {b.pages || 0}/750 pages used
                  </p>

                  <Tooltip text="Pages are counted across the entire book. You can write, edit, and export PDFs freely until you reach 750 total pages. Downloads do not lock your book." />
                </div>
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Generating…
                  </div>
                ) : b.status === "failed" ? (
                  <span
                    className="bg-red-500 text-dashboard-text-light
dark:text-dashboard-text-dark px-3 py-[3px] rounded-full"
                  >
                    Failed
                  </span>
                ) : b.is_complete === 1 ? (
                  <span className="bg-green text-black px-3 py-[3px] rounded-full">
                    Finalized
                  </span>
                ) : b.pages > 0 ? (
                  <span
                    className="bg-blue text-dashboard-text-light
dark:text-dashboard-text-dark px-3 py-[3px] rounded-full"
                  >
                    In Progress
                  </span>
                ) : (
                  <span
                    className="
                  bg-dashboard-hover-light
                  dark:bg-dashboard-hover-dark
                  text-dashboard-text-light
                  dark:text-dashboard-text-dark
                  px-3 py-[3px] rounded-full
                "
                  >
                    Idle
                  </span>
                )}
              </div>

              {/* Prompt Indicator */}
              <div className="flex justify-center items-center mt-3">
                {b.prompt ? (
                  <CheckCircle size={18} className="text-headerGreen" />
                ) : (
                  <Timer
                    size={18}
                    className="text-dashboard-muted-light dark:text-dashboard-muted-dark"
                  />
                )}
              </div>

              {/* Created Timestamp */}
              <div
                className="text-[11px] text-dashboard-muted-light
dark:text-dashboard-muted-dark
 text-center mt-2 flex items-center justify-center gap-1"
              >
                {b.created_at_prompt ? (
                  <>
                    <span>
                      {new Date(b.created_at_prompt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}{" "}
                      {new Date(b.created_at_prompt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>

                    <Tooltip text="This is the date and time this chapter was generated. Purchase dates are shown in Settings." />
                  </>
                ) : (
                  <span className="italic text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    Not generated yet
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="book-actions flex flex-col items-stretch gap-2 mt-4 w-full">
                {!b.prompt && (
                  <button
                    onClick={() => onAddPrompt(b.id, b.part_number)}
                    className="
                    w-full
                    bg-dashboard-hover-light
                    dark:bg-dashboard-hover-dark
                    text-dashboard-text-light
                    dark:text-dashboard-text-dark
                    rounded-lg py-2 text-sm font-semibold
                    transition-all
                    hover:bg-green
                    hover:text-black
                  "
                    title="Create Chapter"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus size={16} />
                      <span>Add Chapter</span>
                    </div>
                  </button>
                )}

                {b.pdf_url && (
                  <>
                    <button
                      onClick={() => openPartsModal(b.id)}
                      className="
                      w-full
                      bg-dashboard-hover-light
                      dark:bg-dashboard-hover-dark
                      text-dashboard-text-light
                      dark:text-dashboard-text-dark
                      rounded-lg py-2 text-sm
                      flex items-center justify-center gap-2
                      hover:opacity-90
                      transition
                    "
                      title="View All Parts"
                    >
                      <Layers size={16} />
                      <span>View All Parts</span>
                    </button>
                  </>
                )}

                {b.prompt && canContinue && (
                  <button
                    onClick={() =>
                      b.pages >= 750
                        ? openPartsModal(b.id)
                        : onGenerateNext(b.id, (b.part_number || 1) + 1)
                    }
                    className="w-full bg-bookBtnColor text-black rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    title="Continue Story"
                  >
                    <Rocket size={16} />
                    <span>
                      {b.pages >= 750
                        ? "Finish Book"
                        : `Continue Story (Part ${(b.part_number || 1) + 1})`}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
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
          onEditChapter={onAddPrompt}
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
              await axiosInstance.post("/books/book-complete", {
                userId: user?.id,
              });
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

import { useState, useEffect } from "react";
import PDFPreviewModal from "../../components/dashboard/PDFPReviewModal";
import BookPartsModal from "./BookPartsModal";
import { useAuth } from "../../admin/AuthContext";
import { CheckCircle, Timer } from "lucide-react";
import OnboardingGuide from "../onboarding/OnboardingGuide";
import api from "../../api/axios";


export default function BookTable({ books = [], onAddPrompt, onGenerateNext }) {

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [activeBookId, setActiveBookId] = useState(null);
  const { accessToken, user, refreshUser } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  

  const steps = [
    { target: ".title", content: "This displays the title of your book project." },
    { target: ".part", content: "Shows which section or chapter you’re currently working on." },
    {
      target: ".pages",
      content: "Displays how many pages you’ve used so far. Each book slot includes up to 750 total pages.",
    },
    { target: ".purchased", content: "Shows the date when this book slot was purchased or activated." },
    {
      target: ".status",
      content: "Indicates your book’s current status: 'In Progress' means writing has started, 'Idle' means awaiting your first prompt.",
    },
    {
      target: ".prompt",
      content: "Shows the prompt status for this book. A timer means no prompt yet, and a green check means writing has begun.",
    },
    { target: ".created", content: "Displays the date your most recent book chapter was generated." },
    { target: ".chapter", content: "Click Chapter button to create your first chapter of your book." },
  ];

  useEffect(() => {
  if (books.length > 0 && user) {
    if (!user.has_completed_book_onboarding) {
      const timer = setTimeout(() => setShowOnboarding(true), 600);
      return () => clearTimeout(timer);
    }
  }
}, [books, user]);


  function openPartsModal(bookId) {
    setActiveBookId(bookId);
    setShowPartsModal(true);
  }

  if (!Array.isArray(books) || books.length === 0) return null;

  return (
    <>
      <div className="bg-[#111] hidden md:block overflow-x-auto rounded-xl overflow-hidden border border-gray-700">
        <table className="min-w-full text-white align-middle">
          <thead className="bg-gray-800">
            <tr>
              {["Title", "Part", "Pages", "Purchased", "Status", "Prompt", "Created", "Actions"].map((h) => (
                <th key={h} className="px-4 py-2 text-center align-middle">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {books.map((b) => (
              <tr key={`${b.id}-${b.part_number}`} className="border-t border-gray-700 align-middle">
                {/* Title */}
                <td className="title text-center px-4 py-2 font-semibold align-middle">{b.book_name || "Untitled"}</td>

                {/* Part number */}
                <td className="part text-center px-4 py-2 align-middle">Part {b.part_number || 1}</td>

                {/* Pages */}
                <td className="pages px-4 py-2 align-middle">
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-24 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green to-royalPurple h-2"
                        style={{ width: `${Math.min((b.pages / 750) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">{b.pages || 0}/750 pages</p>
                  </div>
                </td>

                {/* Purchased */}
                <td className="purchased text-center px-4 py-2 align-middle">
                  {new Date(b.created_at).toLocaleDateString()}
                </td>

                {/* Status */}
                <td className="status text-center px-4 py-2 align-middle">
                  {b.status === "await_prompt" ? (
                    <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Idle</span>
                  ) : b.status === "pending" ? (
                    <span className="flex justify-center items-center gap-2 text-yellow italic">
                      <svg
                        className="animate-spin h-4 w-4 text-yellow"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Generating…
                    </span>
                  ) : b.status === "failed" ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Failed</span>
                  ) : b.pages >= 750 ? (
                    <span className="bg-green text-black px-2 py-1 rounded-full text-xs font-semibold">Completed</span>
                  ) : b.pages > 0 ? (
                    <span className="bg-blue text-white px-2 py-1 rounded-full text-xs font-semibold">In Progress</span>
                  ) : (
                    <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Idle</span>
                  )}
                </td>

                {/* Prompt */}
                <td className="prompt px-4 py-2 align-middle">
                  <div className="flex justify-center items-center">
                    {b.prompt ? (
                      <CheckCircle size={18} className="text-headerGreen" />
                    ) : (
                      <Timer size={18} className="text-grey" />
                    )}
                  </div>
                </td>

                {/* Created */}
                <td className="created text-center px-4 py-2 align-middle">
                  {b.created_at_prompt ? (
                    <span className="text-xs text-gray-300">
                      {new Date(b.created_at_prompt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}{" "}
                      {new Date(b.created_at_prompt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic text-xs">N/A</span>
                  )}
                </td>

                {/* Actions */}
                <td className="chapter px-4 py-2 align-middle">
                  <div className="flex justify-center items-center flex-wrap gap-2">
                    {!b.prompt && (
                      <button onClick={() => onAddPrompt(b.id, b.part_number)} className="px-3 py-1 bg-blue rounded text-sm">
                        Add Chapter
                      </button>
                    )}
                    {b.pdf_url && (
                      <button
                        onClick={() =>
                          setPreviewUrl({
                            url: b.pdf_url,
                            title: b.title || b.book_name || "Untitled",
                            partNumber: b.part_number || 1,
                          })
                        }
                        className={`px-4 py-1 rounded text-sm ${
                          b.pages >= 750 ? "bg-green text-black" : "bg-blue text-white"
                        }`}
                      >
                        {b.pages >= 750 ? "Download Book" : "Preview"}
                      </button>
                    )}
                    {b.pdf_url && (
                      <button
                        onClick={() => openPartsModal(b.id)}
                        className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600 transition"
                      >
                        View All Parts
                      </button>
                    )}
                    {b.prompt && b.pages < 750 && (
                      <button
                        onClick={() => onGenerateNext(b.id, (b.part_number || 1) + 1)}
                        className="px-3 py-1 bg-gradient-to-r from-[#00E07A] to-[#6a5acd] text-black rounded text-sm hover:opacity-90 transition"
                      >
                        {b.pages >= 740 ? "🏁 Finish Book" : `➕ Continue Story (Part ${(b.part_number || 1) + 1})`}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewUrl && (
        <PDFPreviewModal
          fileUrl={previewUrl.url}
          fileTitle={previewUrl.title}
          partNumber={previewUrl.partNumber}
          sourceType="book"
          onClose={() => setPreviewUrl(null)}
        />
      )}

      {showPartsModal && (
        <BookPartsModal
          bookId={activeBookId}
          accessToken={accessToken}
          onClose={() => setShowPartsModal(false)}
        />
      )}

      {showOnboarding && (
  <OnboardingGuide
    steps={steps}
    onFinish={async () => {
  try {
    // Save to local storage so it won’t rerun in the same session
    localStorage.setItem("bookOnboardingComplete", "true");
    setShowOnboarding(false);

    // ✅ Save onboarding completion to DB
    await api.post(
      "https://cre8tlystudio.com/api/books/book-complete",
      { userId: user?.id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("✅ Onboarding completion saved to database.");
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


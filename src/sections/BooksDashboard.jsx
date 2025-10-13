import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import { useBooks } from "../admin/BookContext.jsx";
import { getVersion } from "@tauri-apps/api/app";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import BookTable from "../components/book/BookTable.jsx";
import PaginationControls from "../components/dashboard/PaginationControls.jsx";
import SupportTab from "./SupportTab.jsx";
import GenerationOverlay from "../components/dashboard/GenerationOverlay.jsx";
import OutOfSlotsModal from "../components/dashboard/OutOfSlotModal.jsx";
import BookPromptModal from "../components/prompt/Book/BookPromptModal.jsx";
import BookCardList from "../components/book/BookCardList.jsx";

export default function BooksDashboard() {
  const { accessToken } = useAuth();
  const { books, setBooks, fetchBooks, loading } = useBooks();
  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const [showGenerating, setShowGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isApp, setIsApp] = useState(false);
  const [showOutOfSlots, setShowOutOfSlots] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const ITEMS_PER_PAGE = 10;

  // ✅ Pagination
  const sortedBooks = [...books].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const totalPages = Math.ceil(sortedBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = sortedBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ Open modal for book or next part
  function openBookModal(bookId, partNumber = 1) {
     setActiveBook({ id: bookId, part_number: partNumber });
    setOpenPrompt(true);
  }

  // ✅ Handle submitted prompt
  function handlePromptSubmitted(bookId, promptText) {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, prompt: promptText, status: "pending" }
          : b
      )
    );
    setTimeout(fetchBooks, 3000);
  }

  async function refreshUserSlots() {
    try {
      const res = await fetch("https://cre8tlystudio.com/api/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      const data = await res.json();
      if (data) fetchBooks();
    } catch (err) {
      console.error("Failed to refresh slots:", err);
    }
  }

  useEffect(() => {
    async function detectApp() {
      try {
        await getVersion();
        setIsApp(true);
      } catch {
        setIsApp(false);
      }
    }
    detectApp();
  }, []);

  // ✅ Render
  return (
    <div className="p-6 pt-28 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashboardHeader
        type="book"
        items={books}
        onCheckout={() => navigate("/plans")}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className={`px-4 py-2 rounded-lg ${
            location.pathname === "/dashboard"
              ? "bg-blue text-white"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          🎯 Lead Magnets
        </button>
        <button
          onClick={() => navigate("/books")}
          className={`px-4 py-2 rounded-lg ${
            location.pathname === "/books"
              ? "bg-blue text-white"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          📚 Books
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : books.length === 0 ? (
        <EmptyState onCheckout={() => navigate("/plans")} type="book" />

      ) : (
        <>
          <BookTable
            books={paginatedBooks}
            onAddPrompt={(id, partNumber) => openBookModal(id, partNumber)}
            onGenerateNext={(id, partNumber) => openBookModal(id, partNumber)}
          />
          <BookCardList
            books={paginatedBooks}
            onAddPrompt={(id, partNumber) => openBookModal(id, partNumber)}
            onGenerateNext={(id, partNumber) => openBookModal(id, partNumber)}
          />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <SupportTab />
        </>
      )}

      {activeBook && (
        <BookPromptModal
          isOpen={openPrompt}
          onClose={() => setOpenPrompt(false)}
          bookId={activeBook.id}
          partNumber={activeBook.part_number}
          accessToken={accessToken}
          setShowGenerating={setShowGenerating}
          setProgress={setProgress}
          onSubmitted={handlePromptSubmitted}
        />
      )}

      <OutOfSlotsModal
        open={showOutOfSlots}
        onClose={() => setShowOutOfSlots(false)}
        onRefresh={refreshUserSlots}
        isFirstTime={books.length === 0}
      />

      <GenerationOverlay visible={showGenerating} progress={progress} type="book" />
    </div>
  );
}

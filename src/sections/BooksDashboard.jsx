import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import { useBooks } from "../admin/BookContext.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import PaginationControls from "../components/dashboard/PaginationControls.jsx";
import SupportTab from "./SupportTab.jsx";
import GenerationOverlay from "../components/dashboard/GenerationOverlay.jsx";
import OutOfSlotsModal from "../components/dashboard/OutOfSlotModal.jsx";
import BookPromptModal from "../components/prompt/Book/BookPromptModal.jsx";
import BookCardList from "../components/book/BookCardList.jsx";
import NewBookModal from "../components/book/NewBookModal.jsx";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import BookGrid from "../components/book/BookGrid.jsx";
import axiosInstance from "../api/axios.jsx";

export default function BooksDashboard() {
  const { accessToken } = useAuth();
  const { books, setBooks, fetchBooks, loading } = useBooks();
  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const [showGenerating, setShowGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOutOfSlots, setShowOutOfSlots] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewBookModal, setShowNewBookModal] = useState(false);
  const [newBookData, setNewBookData] = useState(null);



  const navigate = useNavigate();
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

async function openBookModal(bookId, partNumber = 1) {
  let selectedBook = books.find((b) => b.id === bookId);

  try {
    // Always fetch the most recent data from backend
    const res = await axiosInstance.get(`/books/${bookId}`);

    if (res.data) {
      console.log("📘 Fresh data from backend:", res.data);
      selectedBook = { ...selectedBook, ...res.data };
    }
  } catch (err) {
    console.error("❌ Failed to fetch book by ID:", err);
    toast.error("Could not refresh book info — using cached version");
  }

  if (!selectedBook) return;

  // ✔ Use book_name instead of title
  const bookName =
    selectedBook.book_name || selectedBook.title || ""; // fallback for old data

  const missingAuthor =
    !selectedBook.author_name || selectedBook.author_name.trim() === "";

  const missingBookName =
    !bookName ||
    bookName.trim() === "" ||
    bookName === "Untitled" ||
    bookName === "Untitled Book";

  // ✔ If missing core info, open setup modal
  if (missingAuthor || missingBookName) {
    setActiveBook({ id: bookId, part_number: partNumber });
    setShowNewBookModal(true);
    return;
  }

  // ✔ Populate the book modal with correct naming
  setActiveBook({
    id: selectedBook.id,
    part_number: partNumber,
    book_name: bookName,
    author_name: selectedBook.author_name || "",
    book_type:
      selectedBook.bookType ||
      selectedBook.book_type ||
      "fiction",
  });

  setOpenPrompt(true);
}

  
  
  
  function handlePromptSubmitted(bookId, promptText) {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, prompt: promptText, status: "pending" } : b
      )
    );
    setTimeout(fetchBooks, 3000);
  }

function handleAddBookInfo({ bookName, authorName, bookType }) {
  setNewBookData({ bookName, authorName, bookType });
  setShowNewBookModal(false);
  setOpenPrompt(true);
}



  async function refreshUserSlots() {
  try {
    const res = await axiosInstance.get("/auth/me");

    if (res.data) {
      fetchBooks(); // refresh dashboard books
    }
  } catch (err) {
    console.error("Failed to refresh slots:", err);
  }
}

  // ✅ Render
return (
  <DashboardLayout>
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full">
      <DashboardHeader
        type="book"
        items={books}
        onCheckout={() => navigate("/plans")}
      />
      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : books.length === 0 ? (
        <EmptyState onCheckout={() => navigate("/plans")} type="book" />
      ) : (
        <>
          <BookGrid
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

      {/* Modals */}
      {showNewBookModal && activeBook && (
        <NewBookModal
          bookId={activeBook.id}
          accessToken={accessToken}
          onCreate={handleAddBookInfo}
          onClose={() => setShowNewBookModal(false)}
        />
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
          initialBookData={{
      bookName: newBookData?.bookName || activeBook.book_name || activeBook.title || "",
      authorName: newBookData?.authorName || activeBook.author_name || "",
      bookType: newBookData?.bookType || activeBook.book_type || "fiction",
    }}
        />
      )}

      <OutOfSlotsModal
        open={showOutOfSlots}
        onClose={() => setShowOutOfSlots(false)}
        onRefresh={refreshUserSlots}
        isFirstTime={books.length === 0}
      />

      <GenerationOverlay
        visible={showGenerating}
        progress={progress}
        type="book"
      />
    </div>
  </DashboardLayout>
);

}

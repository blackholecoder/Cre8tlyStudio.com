import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import { useBooks } from "../admin/BookContext.jsx";
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
import BooksDashboardHeader from "../components/dashboard/BooksDashboardHeader.jsx";
import { toast } from "react-toastify";

export default function BooksDashboard() {
  const { accessToken, authLoading, user, refreshUser } = useAuth();
  const { books, setBooks, fetchBooks, loading } = useBooks();
  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const [showGenerating, setShowGenerating] = useState(false);
  const [showOutOfSlots, setShowOutOfSlots] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewBookModal, setShowNewBookModal] = useState(false);
  const [newBookData, setNewBookData] = useState(null);

  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 12;

  // ✅ Pagination
  const sortedBooks = [...books].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
  const totalPages = Math.ceil(sortedBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = sortedBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
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
    const bookName = selectedBook.book_name || selectedBook.title || ""; // fallback for old data

    const missingAuthor =
      !selectedBook.author_name || selectedBook.author_name.trim() === "";

    const missingBookName =
      !bookName ||
      bookName.trim() === "" ||
      bookName === "Untitled" ||
      bookName === "Untitled Book";

    // ✔ If missing core info, open setup modal
    if ((missingAuthor || missingBookName) && !selectedBook.is_draft) {
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
      book_type: selectedBook.bookType || selectedBook.book_type || "fiction",
    });

    setOpenPrompt(true);
  }

  function handlePromptSubmitted(bookId, promptText) {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, prompt: promptText, status: "pending" } : b,
      ),
    );
    setTimeout(fetchBooks, 3000);
  }

  function handleAddBookInfo({ bookId, bookName, authorName, bookType }) {
    setNewBookData({ bookName, authorName, bookType });

    setActiveBook({
      id: bookId,
      part_number: 1,
      book_name: bookName,
      author_name: authorName,
      book_type: bookType,
    });

    setShowNewBookModal(false);
    setOpenPrompt(true);
  }
  async function handleCreateNewBook() {
    try {
      const res = await axiosInstance.post("/books/get-new-book");

      // Refresh books from backend
      await fetchBooks();
    } catch (err) {
      if (err.response?.status === 400) {
        setShowOutOfSlots(true);
        return;
      }

      console.error("Failed to create new book", err);
      toast.error("Could not create a new book");
    }
  }

  async function refreshUserSlots() {
    try {
      // Use the canonical refresh
      const refreshedUser = await refreshUser();

      if (refreshedUser) {
        setSubscriptionStatus(refreshedUser.subscription_status);
        await fetchBooks();
      }
    } catch (err) {
      console.error("Failed to refresh slots:", err);
    }
  }

  async function handleArchiveBook(bookId) {
    try {
      await axiosInstance.post(`/books/${bookId}/archive`);

      // Remove locally (instant UI feedback)
      setBooks((prev) => prev.filter((b) => b.id !== bookId));

      // Refresh user + slots
      await refreshUserSlots();
    } catch (err) {
      console.error("Failed to archive book", err);
      toast.error("Failed to archive book");
    }
  }

  // ✅ Render

  if (authLoading || !user) {
    return (
      <DashboardLayout>
        <LoadingState label="Checking subscription…" />
      </DashboardLayout>
    );
  }
  // 🚫 inactive or canceled subscription
  const hasActiveAuthorsAssistant =
    Boolean(user?.authors_assistant_override) ||
    (user?.subscription_status === "active" && user?.has_book === 1);

  if (!hasActiveAuthorsAssistant) {
    return (
      <DashboardLayout>
        <EmptyState
          type="subscription"
          onCheckout={() => navigate("/plans")}
          title="Author’s Assistant is not active"
          description="Upgrade or activate Author’s Assistant to continue writing."
        />
      </DashboardLayout>
    );
  }

  const ACTIVE_LIMIT = 3;

  const activeBookCount = books.filter(
    (b) => b.is_complete === 0 && !b.deleted_at,
  ).length;

  const availableSlots = Math.max(ACTIVE_LIMIT - activeBookCount, 0);

  return (
    <DashboardLayout>
      <div
        className="
    flex flex-col min-h-screen
    px-4 lg:px-8 py-6
    bg-dashboard-bg-light
    dark:bg-dashboard-bg-dark
  "
      >
        <BooksDashboardHeader
          activeBookCount={activeBookCount}
          availableSlots={availableSlots}
          onCheckout={() => navigate("/plans")}
          onCreateBook={handleCreateNewBook}
        />

        {/* Content */}
        <div className="flex-1">
          {loading ? (
            <LoadingState label="Loading your books..." />
          ) : books.length === 0 ? (
            <EmptyState onCheckout={() => navigate("/plans")} type="book" />
          ) : (
            <>
              <BookGrid
                books={paginatedBooks}
                onAddPrompt={(id, partNumber) => openBookModal(id, partNumber)}
                onGenerateNext={(id, partNumber) =>
                  openBookModal(id, partNumber)
                }
                onArchiveBook={handleArchiveBook}
              />

              <BookCardList
                books={paginatedBooks}
                onAddPrompt={(id, partNumber) => openBookModal(id, partNumber)}
                onGenerateNext={(id, partNumber) =>
                  openBookModal(id, partNumber)
                }
                onArchiveBook={handleArchiveBook}
              />
            </>
          )}
        </div>
        <div className="mt-auto pt-6">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <SupportTab />
        </div>

        {/* Modals */}
        {showNewBookModal && activeBook && (
          <NewBookModal
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
            onSubmitted={handlePromptSubmitted}
            onCompleted={() => {
              fetchBooks();
              setShowGenerating(false);
            }}
            initialBookData={{
              bookName:
                newBookData?.bookName ||
                activeBook.book_name ||
                activeBook.title ||
                "",
              authorName:
                newBookData?.authorName || activeBook.author_name || "",
              bookType:
                newBookData?.bookType || activeBook.book_type || "fiction",
            }}
          />
        )}

        <OutOfSlotsModal
          open={showOutOfSlots}
          onClose={() => setShowOutOfSlots(false)}
          onRefresh={refreshUserSlots}
          context="books"
        />

        <GenerationOverlay
          visible={showGenerating}
          type="book"
          onClose={() => setShowGenerating(false)}
        />
      </div>
    </DashboardLayout>
  );
}

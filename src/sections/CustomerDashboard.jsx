import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../admin/AuthContext.jsx";

// Components
import PromptModal from "../components/PromptModal.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import MagnetTable from "../components/dashboard/MagnetTable.jsx";
import MagnetCardList from "../components/dashboard/MagnetCardList.jsx";
import PaginationControls from "../components/dashboard/PaginationControls.jsx";

export default function CustomerDashboard() {
  const { accessToken, user } = useAuth();
  const [magnets, setMagnets] = useState([]);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeMagnet, setActiveMagnet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMagnets, setLoadingMagnets] = useState(true);

  const location = useLocation();
  const ITEMS_PER_PAGE = 10;

  // -------------------------------
  // Fetch lead magnets
  // -------------------------------
  async function fetchMagnets() {
    try {
      setLoadingMagnets(true);
      const res = await axios.get("https://cre8tlystudio.com/api/lead-magnets", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMagnets(res.data);
    } catch (err) {
      console.error("Error fetching lead magnets:", err);
    } finally {
      setLoadingMagnets(false);
    }
  }

  useEffect(() => {
    if (accessToken) fetchMagnets();
  }, [accessToken]);

  // -------------------------------
  // Stripe checkout redirect handler
  // -------------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("session_id")) {
      console.log("✅ Stripe checkout success:", params.get("session_id"));
      fetchMagnets();
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  // -------------------------------
  // Prompt submission handler
  // -------------------------------
  function handlePromptSubmitted(magnetId, promptText, theme) {
    setMagnets((prev) =>
      prev.map((m) =>
        m.id === magnetId
          ? { ...m, prompt: promptText, status: "pending", theme }
          : m
      )
    );
  }

  // -------------------------------
  // Checkout handler
  // -------------------------------
  async function handleCheckout() {
    try {
      const { data } = await axios.post(
        "https://cre8tlystudio.com/api/checkout",
        {
          userId: user?.id,
          priceId: "price_1SEC9lA3LinCYcoDTBYy0xY4",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Try again.");
    }
  }

  // -------------------------------
  // Poll for pending PDFs
  // -------------------------------
  useEffect(() => {
    if (!accessToken || magnets.length === 0) return;

    const hasPending = magnets.some((m) => m.status === "pending");
    if (!hasPending) return;

    const interval = setInterval(() => {
      console.log("🔄 Polling for PDF updates...");
      fetchMagnets();
    }, 5000);

    return () => clearInterval(interval);
  }, [magnets, accessToken]);

  // -------------------------------
  // Pagination setup
  // -------------------------------
  const sortedMagnets = [...magnets].sort(
    (a, b) => (a.slot_number || 0) - (b.slot_number || 0)
  );
  const totalPages = Math.ceil(sortedMagnets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMagnets = sortedMagnets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // -------------------------------
  // Prompt modal trigger
  // -------------------------------
  function openPromptModal(id) {
    setActiveMagnet(id);
    setOpenPrompt(true);
  }

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="p-6 pt-28 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashboardHeader magnets={magnets} onCheckout={handleCheckout} />

      {loadingMagnets ? (
        <LoadingState />
      ) : magnets.length === 0 ? (
        <EmptyState onCheckout={handleCheckout} />
      ) : (
        <>
          {/* Desktop view */}
          <MagnetTable magnets={paginatedMagnets} onAddPrompt={openPromptModal} />

          {/* Mobile view */}
          <MagnetCardList magnets={paginatedMagnets} onAddPrompt={openPromptModal} />

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {activeMagnet && (
        <PromptModal
          isOpen={openPrompt}
          onClose={() => setOpenPrompt(false)}
          magnetId={activeMagnet}
          accessToken={accessToken}
          onSubmitted={handlePromptSubmitted}
        />
      )}
    </div>
  );
}

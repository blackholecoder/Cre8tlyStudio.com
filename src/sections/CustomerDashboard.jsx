import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import { useMagnets } from "../admin/MagnetContext.jsx"; // ✅ use the global context

// Components
import PromptModal from "../components/PromptModal.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import MagnetTable from "../components/dashboard/MagnetTable.jsx";
import MagnetCardList from "../components/dashboard/MagnetCardList.jsx";
import PaginationControls from "../components/dashboard/PaginationControls.jsx";
import SupportTab from "./SupportTab.jsx";

export default function CustomerDashboard() {
  const { accessToken } = useAuth();
  const { magnets, setMagnets, fetchMagnets, loading } = useMagnets(); // ✅ data from context

  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeMagnet, setActiveMagnet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  // ✅ Handle Stripe success redirect
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(location.search);
    if (params.get("session_id")) {
      console.log("✅ Stripe checkout success:", params.get("session_id"));
      fetchMagnets();
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }

  // ✅ Update local state instantly after a new prompt is submitted
  function handlePromptSubmitted(magnetId, promptText, theme) {
    setMagnets((prev) =>
      prev.map((m) =>
        m.id === magnetId
          ? { ...m, prompt: promptText, status: "pending", theme }
          : m
      )
    );

    // trigger refresh shortly after
    setTimeout(fetchMagnets, 3000);
  }

  // ✅ Plan checkout
  function handleCheckout() {
    navigate("/plans");
  }

  // ✅ Pagination
  const sortedMagnets = [...magnets].sort(
    (a, b) => (a.slot_number || 0) - (b.slot_number || 0)
  );
  const totalPages = Math.ceil(sortedMagnets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMagnets = sortedMagnets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ Prompt modal open
  function openPromptModal(id) {
    setActiveMagnet(id);
    setOpenPrompt(true);
  }

  // ✅ Render
  return (
    <div className="p-6 pt-28 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashboardHeader magnets={magnets} onCheckout={handleCheckout} />

      {loading ? (
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

          <SupportTab />
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

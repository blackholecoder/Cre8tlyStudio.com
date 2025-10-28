import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import { useMagnets } from "../admin/MagnetContext.jsx";
import PromptModal from "../components/PromptModal.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import MagnetCardList from "../components/dashboard/MagnetCardList.jsx";
import PaginationControls from "../components/dashboard/PaginationControls.jsx";
import SupportTab from "./SupportTab.jsx";
import OutOfSlotsModal from "../components/dashboard/OutOfSlotModal.jsx";
import GenerationOverlay from "../components/dashboard/GenerationOverlay.jsx";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import EditorModal from "../components/editor/EditorModal.jsx";
import MagnetGrid from "../components/magnets/MagnetGrid.jsx";

export default function CustomerDashboard() {
  const { user, accessToken, refreshUser } = useAuth();
  const { magnets, setMagnets, fetchMagnets, loading } = useMagnets(); // ✅ data from context
  const [showOutOfSlots, setShowOutOfSlots] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeMagnet, setActiveMagnet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showGenerating, setShowGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedContentType, setSelectedContentType] = useState("lead_magnet");
  const [editorRenderKey, setEditorRenderKey] = useState(0);

  function handleEditorClose() {
    setEditorId(null);
    // ✅ triggers full editor re-mount next time it opens
    setTimeout(() => setEditorRenderKey((k) => k + 1), 100);
  }

  const [editorId, setEditorId] = useState(null);
  function openEditor(id) {
    setEditorId(id);
  }

  const activeMagnetData = (magnets.magnets || []).find(
    (m) => m.id === editorId
  );

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
    setMagnets((prev) => {
      const updatedMagnets = (prev.magnets || []).map((m) =>
        m.id === magnetId
          ? { ...m, prompt: promptText, status: "pending", theme }
          : m
      );
      return { ...prev, magnets: updatedMagnets };
    });

    // ✅ trigger refresh shortly after
    setTimeout(fetchMagnets, 3000);
  }

  // ✅ Plan checkout
  function handleCheckout() {
    navigate("/plans");
  }

  const magnetList = magnets?.magnets || [];

  // ✅ Pagination-safe sorting
  const sortedMagnets = [...magnetList].sort(
    (a, b) => (a.slot_number || 0) - (b.slot_number || 0)
  );

  const totalPages = Math.ceil(sortedMagnets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMagnets = sortedMagnets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ Prompt modal open
  function openPromptModal(id, contentType = "lead_magnet") {
    setActiveMagnet(id);
    setSelectedContentType(contentType);
    setOpenPrompt(true);
  }

  async function refreshUserSlots() {
    try {
      await refreshUser(); // ✅ refreshes the logged-in user in AuthContext
      await fetchMagnets(); // ✅ refreshes magnets with updated slot info
    } catch (err) {
      console.error("Failed to refresh user slots:", err);
    }
  }

  useEffect(() => {
    if (user?.has_book && !user?.has_magnet) {
      navigate("/books");
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full">
        {/* Header */}
        <DashboardHeader
          type="magnet"
          items={magnets.magnets || []}
          summary={magnets.summary || {}}
          onCheckout={handleCheckout}
        />

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : magnets.length === 0 ? (
          <EmptyState onCheckout={handleCheckout} type="magnet" />
        ) : (
          <>
            <MagnetGrid
              magnets={paginatedMagnets}
              onAddPrompt={openPromptModal}
              onOpenEditor={openEditor}
            />
            <MagnetCardList
              magnets={paginatedMagnets}
              onAddPrompt={openPromptModal}
              onOpenEditor={openEditor}
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
        {activeMagnet && (
          <PromptModal
            isOpen={openPrompt}
            onClose={() => setOpenPrompt(false)}
            magnetId={activeMagnet}
            accessToken={accessToken}
            contentType={selectedContentType}
            setShowGenerating={setShowGenerating}
            setProgress={setProgress}
            onSubmitted={handlePromptSubmitted}
          />
        )}

        <OutOfSlotsModal
          open={showOutOfSlots}
          onClose={() => setShowOutOfSlots(false)}
          onRefresh={refreshUserSlots}
          isFirstTime={magnets.length === 0}
        />

        <GenerationOverlay
          visible={showGenerating}
          progress={progress}
          type="lead"
        />
        <EditorModal
          key={editorRenderKey}
          leadMagnetId={editorId}
          open={!!editorId}
          onClose={handleEditorClose}
          onCommitted={(url) => fetchMagnets()}
          bgTheme={activeMagnetData?.bg_theme || "modern"}
        />
      </div>
    </DashboardLayout>
  );
}

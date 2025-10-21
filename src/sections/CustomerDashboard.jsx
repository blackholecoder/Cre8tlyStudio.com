import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import { useMagnets } from "../admin/MagnetContext.jsx"; 
import { getVersion } from "@tauri-apps/api/app";
// Components
import PromptModal from "../components/PromptModal.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import MagnetTable from "../components/dashboard/MagnetTable.jsx";
import MagnetCardList from "../components/dashboard/MagnetCardList.jsx";
import PaginationControls from "../components/dashboard/PaginationControls.jsx";
import SupportTab from "./SupportTab.jsx";
import OutOfSlotsModal from "../components/dashboard/OutOfSlotModal.jsx";
import GenerationOverlay from "../components/dashboard/GenerationOverlay.jsx";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";



export default function CustomerDashboard() {
  const { user, accessToken, refreshUser } = useAuth();
  const { magnets, setMagnets, fetchMagnets, loading } = useMagnets(); // ✅ data from context
  const [showOutOfSlots, setShowOutOfSlots] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [activeMagnet, setActiveMagnet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isApp, setIsApp] = useState(false);
  const [showGenerating, setShowGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

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
    if (isApp) {
      setShowOutOfSlots(true); // 👈 open info modal inside the app
    } else {
      navigate("/plans"); // 👈 normal Stripe checkout for web
    }
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

  async function refreshUserSlots() {
  try {
    await refreshUser();   // ✅ refreshes the logged-in user in AuthContext
    await fetchMagnets();  // ✅ refreshes magnets with updated slot info
  } catch (err) {
    console.error("Failed to refresh user slots:", err);
  }
}


  useEffect(() => {
  if (user?.has_book && !user?.has_magnet) {
    navigate("/books");
  }
}, [user]);

  useEffect(() => {
    async function checkIfApp() {
      try {
        await getVersion(); // ✅ This will succeed ONLY in Tauri
        setIsApp(true);
        console.log("✅ Running inside Tauri app");
      } catch {
        console.log("🌐 Running in browser");
        setIsApp(false);
      }
    }
    checkIfApp();
    refreshUserSlots();
  }, []);


return (
  <DashboardLayout>
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full">
      {/* Header */}
      <DashboardHeader type="magnet" items={magnets} onCheckout={handleCheckout} />


      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : magnets.length === 0 ? (
        <EmptyState onCheckout={handleCheckout} type="magnet" />
      ) : (
        <>
          <MagnetTable magnets={paginatedMagnets} onAddPrompt={openPromptModal} />
          <MagnetCardList magnets={paginatedMagnets} onAddPrompt={openPromptModal} />
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
    </div>
  </DashboardLayout>
);

}

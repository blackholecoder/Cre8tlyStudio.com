import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../admin/AuthContext";
import PlanDetailsModal from "../components/PlansDetailModal";
import CustomCursor from "../components/CustomCursor";
import { headerLogo } from "../assets/images";

export default function PlansPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();

  const handleSelectPlan = async (planType) => {
    if (!user || !user.id) {
      toast.error("Please sign in before selecting a plan");
      return;
    }

    try {
      setLoadingPlan(planType);
      const token = localStorage.getItem("accessToken");

      let productType = planType;
      let billingCycle = null;

      if (planType === "business_builder_pack_annual") {
        productType = "business_builder_pack";
        billingCycle = "annual";
      } else if (planType === "business_builder_pack_monthly") {
        productType = "business_builder_pack";
        billingCycle = "monthly";
      }

      const res = await api.post(
        "/checkout",
        { userId: user.id, productType, billingCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout session");
      setLoadingPlan(null);
    }
  };

    useEffect(() => {
    // Always restore scrolling when this page mounts
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";
  
    return () => {
      // Ensure scroll is restored if you navigate away and come back
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center px-6 py-20">
      <CustomCursor />

      {/* ===== Header ===== */}
      <div className="flex flex-col items-center mb-10">
        <img
          src={headerLogo}
          alt="Cre8tly Studio Logo"
          className="w-28 h-auto mb-6 hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(147,51,234,0.4)]"
        />
        <h1 className="text-2xl font-extrabold tracking-tight text-center design-text">
          Pricing
        </h1>
        <p className="text-gray-400 mt-4 text-center max-w-xl">
          Start free. Upgrade anytime for professional tools, branding, and
          automation built for creators and entrepreneurs.
        </p>
      </div>

      {/* ===== Main Plans Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl mx-auto place-items-stretch">

        {/* ---------- Free Tier ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-green/50 transition">
          <h2 className="text-2xl font-bold mb-2 text-white design-text">
            Free Trial
          </h2>
          <p className="text-4xl font-extrabold mb-2">$0</p>
          <p className="text-gray-400 mb-4 text-sm">No credit card required</p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 1 Lead Magnet Slot (5 pages)</li>
            <li>✅ Basic Templates</li>
            <li>✅ AI-Assisted Writing Tools</li>
            <li>⚡ 7-Day Trial Access</li>
          </ul>

          {/* 🔹 Dynamic Free-Trial Button */}
{!user ? (
  // Not logged in — show sign-up CTA
  <button
    onClick={() => (window.location.href = "/sign-up")}
    className="mt-auto w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-green to-royalPurple text-black hover:opacity-90 transition"
  >
    Start Free
  </button>
) : user?.has_free_magnet === 1 ? (
  // Logged in and already has free tier
  <button
    disabled
    className="mt-auto w-full py-3 text-lg font-semibold rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed"
  >
    Trial Active
  </button>
) : (
  // Logged in but somehow no free tier (edge case)
  <button
    onClick={() => (window.location.href = "/dashboard")}
    className="mt-auto w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-green to-royalPurple text-black hover:opacity-90 transition"
  >
    Go to Dashboard
  </button>
)}

        </div>

        {/* ---------- Pro Business Builder ---------- */}
        {/* <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-blue-500 transition">
          <h2 className="text-2xl font-bold mb-2 text-blue-400 design-text">
            Pro Business
          </h2>
          <p className="text-4xl font-extrabold mb-2">$129.99</p>
          <p className="text-gray-400 mb-4 text-sm">Annual or Monthly</p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 15 Digital Asset Slots /monthly</li>
            <li>✅ Custom Landing Page</li>
            <li>✅ Custom Subdomain</li>
            <li>✅ Sellers Dashboard - keep 90% of sales</li>
            <li>✅ Email Capture Automation</li>
            <li>✅ Pro Covers</li>
            <li>✅ Prompt Memory</li>
            <li>✅ Analytics Dashboard</li>
            <li>✅ Custom Domains</li>
            <li>✅ Priority Support</li>
          </ul>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-auto w-full">
            <button
              onClick={() => handleSelectPlan("business_builder_pack_annual")}
              disabled={loadingPlan === "business_builder_pack_annual"}
              className={`flex-1 py-3 text-lg font-semibold rounded-lg border transition-all ${
                loadingPlan === "business_builder_pack_annual"
                  ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
                  : "bg-gradient-to-r from-blue to-blue/90 border-blue-500 hover:opacity-90 text-white shadow-lg shadow-blue-500/20"
              }`}
            >
              {loadingPlan === "business_builder_pack_annual"
                ? "Redirecting..."
                : "Annual • $129.99"}
            </button>

            <button
              onClick={() => handleSelectPlan("business_builder_pack_monthly")}
              disabled={loadingPlan === "business_builder_pack_monthly"}
              className={`flex-1 py-3 text-lg font-semibold rounded-lg border transition-all ${
                loadingPlan === "business_builder_pack_monthly"
                  ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
                  : "bg-gradient-to-r from-sky-400 to-sky-300 border-sky-400 text-black hover:opacity-90 shadow-lg shadow-sky-400/30"
              }`}
            >
              {loadingPlan === "business_builder_pack_monthly"
                ? "Redirecting..."
                : "Monthly • $199"}
            </button>
          </div>

          <button
            onClick={() => setSelectedPlan("business_builder_pack")}
            className="mt-4 text-sm text-blue-400 hover:underline text-center"
          >
            Learn More
          </button>
        </div> */}
        {/* ---------- Business Builder (Annual) ---------- */}
<div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-blue-500/50 transition">
  <h2 className="text-2xl font-bold mb-2 text-blue-400 design-text">
    Business Builder (Annual)
  </h2>
  <p className="text-4xl font-extrabold mb-2 text-blue-400">$129.99</p>
  <p className="text-gray-400 mb-4 text-sm">Billed annually ($1,560/year)</p>

  <ul className="text-sm text-gray-300 space-y-2 mb-8">
    <li>✅ 15 Lead Magnet Slots /month</li>
    <li>✅ Sell on Your Landing Page</li>
    <li>✅ Keep 90% of Every Sale</li>
    <li>✅ Pro Covers & Prompt Memory</li>
    <li>✅ Custom Subdomain + Email Capture</li>
    <li>✅ Analytics Dashboard</li>
    <li>✅ Priority Support</li>
  </ul>

  <button
    onClick={() => handleSelectPlan("business_builder_pack_annual")}
    disabled={loadingPlan === "business_builder_pack_annual"}
    className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg border transition-all ${
      loadingPlan === "business_builder_pack_annual"
        ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
        : "bg-gradient-to-r from-blue-500 to-indigo-400 text-white border-blue-400 hover:opacity-90 shadow-lg shadow-blue-400/30"
    }`}
  >
    {loadingPlan === "business_builder_pack_annual"
      ? "Redirecting..."
      : "Get Annual Plan"}
  </button>

  <button
    onClick={() => setSelectedPlan("business_builder_pack")}
    className="mt-4 text-sm text-blue-400 hover:underline text-center"
  >
    Learn More
  </button>
</div>

{/* ---------- Business Builder (Monthly) ---------- */}
<div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-sky-400/50 transition">
  <h2 className="text-2xl font-bold mb-2 text-sky-400 design-text">
    Business Builder (Monthly)
  </h2>
  <p className="text-4xl font-extrabold mb-2 text-sky-400">$199.99</p>
  <p className="text-gray-400 mb-4 text-sm">Billed monthly (12-month term)</p>

  <ul className="text-sm text-gray-300 space-y-2 mb-8">
    <li>✅ 15 Lead Magnet Slots /month</li>
    <li>✅ Sell on Your Landing Page</li>
    <li>✅ Keep 90% of Every Sale</li>
    <li>✅ Pro Covers & Prompt Memory</li>
    <li>✅ Custom Subdomain + Email Capture</li>
    <li>✅ Analytics Dashboard</li>
    <li>✅ Priority Support</li>
  </ul>

  <button
    onClick={() => handleSelectPlan("business_builder_pack_monthly")}
    disabled={loadingPlan === "business_builder_pack_monthly"}
    className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg border transition-all ${
      loadingPlan === "business_builder_pack_monthly"
        ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
        : "bg-gradient-to-r from-sky-400 to-sky-300 border-sky-400 text-black hover:opacity-90 shadow-lg shadow-sky-400/30"
    }`}
  >
    {loadingPlan === "business_builder_pack_monthly"
      ? "Redirecting..."
      : "Get Monthly Plan"}
  </button>

  <button
    onClick={() => setSelectedPlan("business_builder_pack")}
    className="mt-4 text-sm text-sky-400 hover:underline text-center"
  >
    Learn More
  </button>
</div>


        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-pink-400 transition">
            <h2 className="text-2xl font-bold mb-2 text-pink-400 design-text">
              Author’s Assistant
            </h2>
            <p className="text-4xl font-extrabold mb-2 text-pink-400">$850</p>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              AI-powered co-writer that helps you structure, write, and edit up
              to 750 pages while keeping your unique voice.
            </p>

            <button
              onClick={() => setSelectedPlan("author")}
              className="text-pink-400 text-sm hover:underline mb-3"
            >
              Learn More
            </button>

            <button
              onClick={() => handleSelectPlan("author")}
              disabled={loadingPlan === "author"}
              className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg transition-all ${
                loadingPlan === "author"
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90"
              }`}
            >
              {loadingPlan === "author"
                ? "Redirecting..."
                : "Unlock Author’s Assistant"}
            </button>
          </div>


      </div>

      {selectedPlan && (
        <PlanDetailsModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}

      <p className="text-gray-500 text-sm mt-16 text-center">
        🔒 Secure checkout — powered by Stripe
      </p>
    </div>
  );
}

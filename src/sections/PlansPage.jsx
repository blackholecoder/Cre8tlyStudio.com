import { useState } from "react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full max-w-7xl">
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

        {/* ---------- Basic Creator ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-purple-500 transition">
          <h2 className="text-2xl font-bold mb-2 text-purple-400 design-text">
            Basic Creator
          </h2>
          <p className="text-4xl font-extrabold mb-2">$47</p>
          <p className="text-gray-400 mb-4 text-sm">One-time payment</p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 5 Digital Product Slots</li>
            <li>✅ AI Templates & Content Blocks</li>
            <li>✅ Instant PDF Generation</li>
            <li>✅ Custom Branding</li>
          </ul>

          <button
            onClick={() => handleSelectPlan("basic")}
            disabled={loadingPlan === "basic"}
            className={`w-full mt-auto py-3 text-lg font-semibold rounded-lg transition-all ${
              loadingPlan === "basic"
                ? "opacity-50 cursor-not-allowed bg-gray-700"
                : "bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90"
            }`}
          >
            {loadingPlan === "basic" ? "Redirecting..." : "Get Started"}
          </button>

          <button
            onClick={() => setSelectedPlan("basic")}
            className="mt-3 text-sm text-purple-400 hover:underline"
          >
            Learn More
          </button>
        </div>

        {/* ---------- Pro Business Builder ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-blue-500 transition">
          <h2 className="text-2xl font-bold mb-2 text-blue-400 design-text">
            Pro Business
          </h2>
          <p className="text-4xl font-extrabold mb-2">$129.99</p>
          <p className="text-gray-400 mb-4 text-sm">Annual or Monthly</p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 5 Digital Asset Slots</li>
            <li>✅ Landing Pages & Lead Forms</li>
            <li>✅ Email Capture Automation</li>
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
        </div>

        {/* ---------- All-In-One Bundle ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-yellow-400 transition">
          <h2 className="text-2xl font-bold mb-2 text-yellow-300 design-text">
            All-In-One Bundle
          </h2>
          <p className="text-4xl font-extrabold mb-2">$999</p>
          <p className="text-gray-400 mb-4 text-sm">Lifetime Access</p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ Everything in Basic & Pro Covers</li>
            <li>✅ Author’s Assistant (750 pages)</li>
            <li>✅ Pro Covers + Templates</li>
            <li>✅ Priority Support</li>
            <li>✅ Lifetime Updates</li>
          </ul>

          <button
            onClick={() => handleSelectPlan("bundle")}
            disabled={loadingPlan === "bundle"}
            className={`w-full mt-auto py-3 text-lg font-semibold rounded-lg transition-all ${
              loadingPlan === "bundle"
                ? "opacity-50 cursor-not-allowed bg-gray-700"
                : "bg-gradient-to-r from-yellow to-yellow/80 text-black hover:opacity-90"
            }`}
          >
            {loadingPlan === "bundle" ? "Redirecting..." : "Get the Bundle"}
          </button>

          <button
            onClick={() => setSelectedPlan("bundle")}
            className="mt-3 text-sm text-yellow-300 hover:underline"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* ===== Add-Ons Section ===== */}
      {/* ===== Add-Ons Section ===== */}
      <div className="w-full max-w-6xl mt-20">
        <h3 className="text-3xl font-bold text-center mb-8 design-text">
          Add-Ons
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ---------- Prompt Memory ---------- */}
          <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-emerald-400 transition">
            <h2 className="text-2xl font-bold mb-2 text-green-400 design-text">
              Prompt Memory Subscription
            </h2>
            <p className="text-4xl font-extrabold mb-2 text-green-400">
              $14.99
              <span className="text-lg font-normal text-gray-400">
                {" "}
                / month
              </span>
            </p>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Your AI’s memory for tone, style, and brand voice — so every
              project you create feels authentically yours. Stay consistent and
              save hours on rewriting.
            </p>

            <button
              onClick={() => setSelectedPlan("prompt_memory")}
              className="text-green-400 text-sm hover:underline mb-3"
            >
              Learn More
            </button>

            <button
              onClick={() => handleSelectPlan("prompt_memory")}
              disabled={loadingPlan === "prompt_memory"}
              className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg transition-all ${
                loadingPlan === "prompt_memory"
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "bg-gradient-to-r from-green to-green/90 text-black hover:opacity-90"
              }`}
            >
              {loadingPlan === "prompt_memory" ? "Redirecting..." : "Subscribe"}
            </button>
          </div>

          {/* ---------- Pro Covers ---------- */}
          <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-green-500 transition">
            <h2 className="text-2xl font-bold mb-2 text-green-400 design-text">
              Pro Covers
            </h2>
            <p className="text-4xl font-extrabold mb-2 text-green-400">$150</p>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Unlimited{" "}
              <span className="text-white font-medium">
                custom and Unsplash cover uploads
              </span>
              . Single purchase unlocks Pro Covers for lifetime.
            </p>

            <button
              onClick={() => setSelectedPlan("pro")}
              className="text-green-400 text-sm hover:underline mb-3"
            >
              Learn More
            </button>

            <button
              onClick={() => handleSelectPlan("pro")}
              disabled={loadingPlan === "pro"}
              className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg transition-all ${
                loadingPlan === "pro"
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "bg-green text-black hover:opacity-90"
              }`}
            >
              {loadingPlan === "pro" ? "Redirecting..." : "Unlock Pro Covers"}
            </button>
          </div>

          {/* ---------- Author’s Assistant ---------- */}
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

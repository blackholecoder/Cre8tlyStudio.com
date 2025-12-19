import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../admin/AuthContext";
import PlanDetailsModal from "../components/PlansDetailModal";
import { useLocation } from "react-router-dom";

export default function PlansPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("ref");

    if (fromUrl) {
      localStorage.setItem("ref_slug", fromUrl);
      return;
    }

    // If no ?ref in URL, do nothing.
    // The stored slug (if any) remains untouched.
  }, [location]);

  const handleSelectPlan = async (planType) => {
    if (!user || !user.id) {
      toast.warning(
        "Create a free account to continue. No credit card required."
      );
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
      } else if (planType === "business_basic_builder") {
        productType = "business_basic_builder";
        billingCycle = "annual";
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
    <div className="min-h-screen bg-[#fff] text-white flex flex-col items-center px-6 py-20">
      {/* ===== Header ===== */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-center design-text text-black mt-20">
          Pricing
        </h1>
        <p className="text-black mt-4 text-center max-w-xl">
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
              onClick={() => {
                const refSlug = localStorage.getItem("ref_slug");
                if (refSlug) {
                  window.location.href = `/sign-up?ref=${refSlug}`;
                } else {
                  window.location.href = "/sign-up";
                }
              }}
              className="mt-auto w-full py-3 text-lg font-semibold rounded-lg bg-green text-black hover:opacity-90 transition"
            >
              Start Building for Free
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

        {/* ---------- Business Basic (Annual) ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-emerald-400/50 transition">
          <h2 className="text-2xl font-bold mb-2 text-white design-text">
            Business Basic <br />
            (Annual)
          </h2>

          <p className="text-4xl font-extrabold mb-2 text-white">$65</p>
          <p className="text-gray-400 mb-4 text-sm">
            Billed annually ($780.00/year)
          </p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 7 Lead Magnet Slots /month</li>
            <li>✅ Sell on Your Landing Page</li>
            <li>✅ No platform fees: keep what you make</li>
            <li>✅ Pro Covers & Prompt Memory</li>
            <li>✅ 5M Unsplash Library</li>
            <li>✅ Custom Subdomain + Email Capture</li>
            <li>❌ Gradient Themes</li>
            <li>❌ Custom Branding</li>
            <li>❌ Audio Player</li>
            <li>❌ Calendly Integration</li>
            <li>❌ Verified Reviews</li>
            <li>❌ Advanced Analytics</li>
          </ul>

          <button
            onClick={() => handleSelectPlan("business_basic_builder")}
            disabled={loadingPlan === "business_basic_builder"}
            className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg border transition-all ${
              loadingPlan === "business_basic_builder"
                ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
                : "text-white border-blue-400 hover:opacity-90 shadow-lg shadow-blue-400/30"
            }`}
          >
            {loadingPlan === "business_basic_builder"
              ? "Redirecting..."
              : "Get Basic Plan"}
          </button>

          <button
            onClick={() => setSelectedPlan("business_basic_builder")}
            className="mt-4 text-sm text-white hover:underline text-center"
          >
            Learn More
          </button>
        </div>

        {/* ---------- Business Builder (Annual) ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-blue-500/50 transition">
          <h2 className="text-2xl font-bold mb-2 text-blue-400 design-text">
            Business Builder (Annual)
          </h2>
          <p className="text-4xl font-extrabold mb-2 text-blue-400">$129.99</p>
          <p className="text-gray-400 mb-4 text-sm">
            Billed annually ($1,560/year)
          </p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 15 Lead Magnet Slots /month</li>
            <li>✅ Sell on Your Landing Page</li>
            <li>✅ No platform fees: keep what you make</li>
            <li>✅ Pro Covers & Prompt Memory</li>
            <li>✅ 5M Unsplash Library</li>
            <li>✅ Custom Subdomain + Email Capture</li>
            <li>✅ Custom Branding</li>
            <li>✅ Advanced Analytics</li>
            <li>✅ Priority Support</li>
            <li>✅ Audio Player</li>
            <li>✅ Calendly Integration</li>
            <li>✅ Verified Reviews</li>
          </ul>

          <button
            onClick={() => handleSelectPlan("business_builder_pack_annual")}
            disabled={loadingPlan === "business_builder_pack_annual"}
            className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg border transition-all ${
              loadingPlan === "business_builder_pack_annual"
                ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
                : "text-white border-blue-400 hover:opacity-90"
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
          <h2 className="text-2xl font-bold mb-2 text-white design-text">
            Business Builder (Monthly)
          </h2>
          <p className="text-4xl font-extrabold mb-2 text-white">$199.99</p>
          <p className="text-gray-400 mb-4 text-sm">
            Billed monthly (12-month term)
          </p>

          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 15 Lead Magnet Slots /month</li>
            <li>✅ Sell on Your Landing Page</li>
            <li>✅ No platform fees: keep what you make</li>
            <li>✅ Pro Covers & Prompt Memory</li>
            <li>✅ 5M Unsplash Library</li>
            <li>✅ Custom Subdomain + Email Capture</li>
            <li>✅ Analytics Dashboard</li>
            <li>✅ Priority Support</li>
            <li>✅ Audio Player</li>
            <li>✅ Calendly Integration</li>
            <li>✅ Verified Reviews</li>
            <li>✅ Advanced Analytics</li>
          </ul>

          <button
            onClick={() => handleSelectPlan("business_builder_pack_monthly")}
            disabled={loadingPlan === "business_builder_pack_monthly"}
            className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg border transition-all ${
              loadingPlan === "business_builder_pack_monthly"
                ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
                : "text-white border-blue-400 hover:opacity-90"
            }`}
          >
            {loadingPlan === "business_builder_pack_monthly"
              ? "Redirecting..."
              : "Get Monthly Plan"}
          </button>

          <button
            onClick={() => setSelectedPlan("business_builder_pack")}
            className="mt-4 text-sm text-white hover:underline text-center"
          >
            Learn More
          </button>
        </div>

        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-pink-400 transition">
          <h2 className="text-2xl font-bold mb-2 text-pink-400 design-text">
            Author’s Assistant <br /> (1 Book)
          </h2>
          <p className="text-4xl font-extrabold mb-2 text-pink-400">$850</p>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            AI-powered co-writer that helps you structure, write, and edit up to
            750 pages while keeping your unique voice and storytelling style.
          </p>
          <ul className="text-sm text-gray-300 space-y-2 mb-8">
            <li>✅ 750 Pages of Writing Power</li>
            <li>✅ Save Unlimited Drafts</li>
            <li>✅ Upload Any Text File or Document</li>
            <li>✅ Continues Your Story From Memory</li>
            <li>✅ Generate Chapters Instantly</li>
            <li>✅ Pro-Level Book Covers</li>
            <li>✅ Premium Font Selection</li>
            <li>✅ Live Book Preview & Editing</li>
            <li>✅ Rewrite, Expand, or Shorten Any Section</li>
            <li>✅ One-Click Export (PDF & DOCX)</li>
          </ul>

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
          <button
            onClick={() => setSelectedPlan("author")}
            className="text-pink-400 text-sm hover:underline mt-3"
          >
            Learn More
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

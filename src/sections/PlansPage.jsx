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
        "Create a free account to continue. No credit card required.",
      );
      return;
    }

    try {
      setLoadingPlan(planType);
      const token = localStorage.getItem("accessToken");

      // 🔴 AUTHOR’S ASSISTANT (NEW SUBSCRIPTION FLOW)
      if (planType === "author") {
        const res = await api.post(
          "/seller-checkout/create-authors-assistant-subscription",
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );

        window.location.href = res.data.url;
        return;
      }

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
        { headers: { Authorization: `Bearer ${token}` } },
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
          The community is always free.
          <br /> Upgrade when you’re ready to monetize your work.
        </p>
      </div>

      {/* ===== Main Plans Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl mx-auto place-items-stretch">
        {/* ---------- Free Tier ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-green/50 transition">
          {/* PLAN NAME */}
          <h2 className="text-2xl font-bold mb-1 text-white design-text">
            Community (free)
          </h2>

          {/* PRICE */}
          <p className="text-4xl font-extrabold text-white mb-6">$0</p>

          {/* INCLUDED */}
          <ul className="text-sm text-gray-300 space-y-2 mb-6">
            <li>✅ Publish posts and short fragments</li>
            <li>✅ Participate in the community feed</li>
            <li>✅ Comment and engage in discussion</li>
            <li>✅ Create a public writing profile</li>
            <li>✅ Join for free, no credit card</li>
          </ul>

          {/* UPGRADE SEED */}
          <p className="text-xs text-gray-500 mb-8">
            Set your own subscription prices anytime. We don’t control your
            rates.
          </p>

          {/* CTA LOGIC */}
          {!user ? (
            <button
              onClick={() => {
                const refSlug = localStorage.getItem("ref_slug");
                window.location.href = refSlug
                  ? `/sign-up?ref=${refSlug}`
                  : "/sign-up";
              }}
              className="mt-auto w-full py-3 text-lg font-semibold rounded-lg bg-green text-black hover:opacity-90 transition"
            >
              Join the Community
            </button>
          ) : user?.has_free_magnet === 1 ? (
            <button
              disabled
              className="mt-auto w-full py-3 text-lg font-semibold rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed"
            >
              Trial Active
            </button>
          ) : (
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-auto w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-green to-royalPurple text-black hover:opacity-90 transition"
            >
              Go to Dashboard
            </button>
          )}
        </div>

        {/* ---------- Authors (Subscription) ---------- */}

        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-pink-400 transition">
          {/* IDENTITY */}
          <h2 className="text-2xl font-bold mb-1 text-pink-400 design-text">
            Author’s Assistant
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Active subscription · Up to 750 pages per book
          </p>

          {/* PRICE */}
          <p className="text-4xl font-extrabold text-pink-400">
            $49.99
            <span className="text-lg font-medium text-gray-400">/month</span>
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Cancel anytime · Access ends when subscription ends
          </p>

          {/* OUTCOME ANCHOR */}
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">
            A structured writing and publishing system designed to help you
            plan, write, finalize, and publish a full-length book, while
            preserving your unique voice and intent.
          </p>

          {/* CORE CAPABILITIES */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-pink-400 mb-2">
              Write with confidence
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✅ Generate chapters and structured sections</li>
              <li>✅ Rewrite, expand, or shorten any passage</li>
              <li>✅ Save unlimited revisions without losing progress</li>
              <li>✅ Continue writing with full book-level context</li>
            </ul>
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-pink-400 mb-2">
              Maintain continuity
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✅ Up to 750 pages across a single book project</li>
              <li>✅ Import existing drafts, notes, or research</li>
              <li>✅ Edit chapters individually without breaking structure</li>
            </ul>
          </div>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-pink-400 mb-2">
              Publish professionally
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✅ Finalize and lock your completed book</li>
              <li>✅ Combine all chapters into a single EPUB</li>
              <li>
                ✅ Publish EPUBs compatible with Kindle and major platforms
              </li>
            </ul>
          </div>

          {/* CTA */}
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
              : "Start Writing with Author’s Assistant"}
          </button>

          <button
            onClick={() => setSelectedPlan("author")}
            className="text-pink-400 text-sm hover:underline mt-3 text-center"
          >
            Learn more about Author’s Assistant
          </button>
        </div>

        {/* ---------- Business Basic (Annual) ---------- */}

        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/80 p-10 text-left hover:border-emerald-400/50 transition">
          {/* PLAN NAME */}
          <h2 className="text-2xl font-bold mb-1 text-white design-text">
            Business Basic
          </h2>
          <p className="text-sm text-gray-400 mb-4">(Annual)</p>

          {/* PRICE */}
          <p className="text-4xl font-extrabold text-white">$65</p>
          <p className="text-gray-400 mb-3 text-sm">
            Billed annually ($780/year)
          </p>

          {/* OUTCOME ANCHOR */}
          <p className="text-sm text-gray-300 mb-6">
            Best for writers who want a professional home to sell books, set
            their own subscription tiers, and own their audience.
          </p>

          {/* INCLUDED */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              What’s included
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✅ Free access to the community</li>
              <li>✅ Set your own subscription prices</li>
              <li>✅ Monthly, annual, and VIP Founder tiers</li>
              <li>✅ Subscriber-only posts and fragments</li>
              <li>✅ Direct relationship with your readers</li>
            </ul>
          </div>

          {/* BUILDER / SELLING TOOLS */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              Professional tools
            </p>

            <ul className="text-[13px] text-gray-500 space-y-1 opacity-70">
              <li>• Landing page builder to sell books</li>
              <li>• Custom domain support</li>
              <li>• Clean, professional layouts</li>
              <li>• Shareable links for posts and pages</li>
              <li>• Simple analytics for growth</li>
            </ul>
          </div>

          {/* CTA */}
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
              : "Start with Business Basic"}
          </button>

          {/* SECONDARY */}
          <button
            onClick={() => setSelectedPlan("business_basic_builder")}
            className="mt-4 text-sm text-gray-400 hover:text-white hover:underline text-center"
          >
            Learn more about this plan
          </button>
        </div>

        {/* ---------- Business Builder (Annual) ---------- */}

        <div className="relative flex flex-col rounded-2xl border border-blue-500/40 bg-[#111]/90 p-10 text-left shadow-xl shadow-blue-500/10 transition hover:border-blue-400">
          {/* PLAN IDENTITY */}
          <h2 className="text-2xl font-bold mb-1 text-blue-400 design-text">
            Business Builder
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            (Annual · Full Platform Access)
          </p>

          {/* PRICE */}
          <p className="text-4xl font-extrabold text-white">$129.99</p>
          <p className="text-gray-400 mb-3 text-sm">
            Billed annually ($1,560/year)
          </p>

          {/* OUTCOME ANCHOR */}
          <p className="text-sm text-gray-300 mb-6">
            Built for writers and creators who want to scale paid communities,
            sell books professionally, and fully own their platform.
          </p>

          {/* CORE CAPABILITIES */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-blue-400 mb-2">
              Everything you need to scale
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✅ Free access to the community</li>
              <li>✅ Set your own subscription prices</li>
              <li>✅ Monthly, annual, and VIP Founder tiers</li>
              <li>✅ Subscriber-only posts and fragments</li>
              <li>✅ Unlimited paid subscribers</li>
              <li>✅ Priority support</li>
            </ul>
          </div>

          {/* FULL ACCESS */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              Professional tools
            </p>
            <ul className="text-[13px] text-gray-500 space-y-1 opacity-75">
              <li>• Landing page builder to sell books</li>
              <li>• Custom domain and branding</li>
              <li>• Advanced layouts and themes</li>
              <li>• Shareable links and pages</li>
              <li>• Deeper analytics and insights</li>
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={() => handleSelectPlan("business_builder_pack_annual")}
            disabled={loadingPlan === "business_builder_pack_annual"}
            className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg border transition-all ${
              loadingPlan === "business_builder_pack_annual"
                ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
                : "text-white bg-blue-500 border-blue-500 hover:bg-blue-400 shadow-lg shadow-blue-500/30"
            }`}
          >
            {loadingPlan === "business_builder_pack_annual"
              ? "Redirecting..."
              : "Build with Business Builder"}
          </button>

          {/* SECONDARY */}
          <button
            onClick={() => setSelectedPlan("business_builder_pack")}
            className="mt-4 text-sm text-blue-400 hover:underline text-center"
          >
            See everything included
          </button>
        </div>

        {/* ---------- Business Builder (Monthly) ---------- */}
        <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#111]/70 p-10 text-left transition hover:border-sky-400/40">
          {/* PLAN IDENTITY */}
          <h2 className="text-2xl font-bold mb-1 text-white design-text">
            Business Builder
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Monthly billing · Same features as annual
          </p>

          {/* PRICE */}
          <p className="text-4xl font-extrabold text-white">$199.99</p>
          <p className="text-gray-400 mb-3 text-sm">
            Billed monthly (12-month commitment)
          </p>

          {/* VALUE FRAMING */}
          <p className="text-sm text-gray-300 mb-6">
            For writers and creators who want full access to the platform with
            the flexibility of monthly billing.
          </p>

          {/* FEATURE SUMMARY */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wide text-sky-400 mb-2">
              Full Business Builder access
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✅ Free access to the community</li>
              <li>✅ Set your own subscription prices</li>
              <li>✅ Monthly, annual, and VIP Founder tiers</li>
              <li>✅ Subscriber-only posts and fragments</li>
              <li>✅ Landing page builder and custom domains</li>
              <li>✅ Priority support</li>
            </ul>
          </div>

          {/* OPTIONAL REFERENCE */}
          <p className="text-xs text-gray-300 mb-8">
            Prefer the best value? Save significantly with annual billing.
          </p>

          {/* CTA */}
          <button
            onClick={() => handleSelectPlan("business_builder_pack_monthly")}
            disabled={loadingPlan === "business_builder_pack_monthly"}
            className={`mt-auto w-full py-3 text-lg font-semibold rounded-lg border transition-all ${
              loadingPlan === "business_builder_pack_monthly"
                ? "opacity-50 cursor-not-allowed bg-gray-700 border-gray-700"
                : "text-white border-sky-400 hover:bg-sky-400/10"
            }`}
          >
            {loadingPlan === "business_builder_pack_monthly"
              ? "Redirecting..."
              : "Choose Monthly Billing"}
          </button>

          {/* SECONDARY */}
          <button
            onClick={() => setSelectedPlan("business_builder_pack")}
            className="mt-4 text-sm text-gray-400 hover:text-white hover:underline text-center"
          >
            Compare with annual option
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

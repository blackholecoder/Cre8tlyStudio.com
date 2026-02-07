import { useEffect, useState } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import axiosInstance from "../../../api/axios";
import { toast } from "react-toastify";
import { defaultImage } from "../../../assets/images";
import { ButtonSpinner } from "../../../helpers/buttonSpinner";

export default function SubscribeChoicePage() {
  const { authorId } = useParams();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";
  const navigate = useNavigate();

  const redirectBack = location.state?.from || `/community/authors/${authorId}`;

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasPaidSubscription, setHasPaidSubscription] = useState(false);

  useEffect(() => {
    loadAuthor();
  }, []);

  async function loadAuthor() {
    try {
      const [authorRes, statusRes] = await Promise.all([
        axiosInstance.get(`/community/authors/${authorId}`),
        axiosInstance.get(`/community/subscriptions/${authorId}/status`),
      ]);

      setAuthor(authorRes.data.profile);
      setHasPaidSubscription(statusRes.data.has_paid_subscription);
    } catch (err) {
      toast.error("Failed to load author");
      navigate(redirectBack);
    } finally {
      setLoading(false);
    }
  }

  const hasMonthly = !!author?.monthly_price;
  const hasAnnual = !!author?.annual_price;

  const hasVIP = typeof author?.vip_price === "number";

  const vipPrice =
    typeof author?.vip_price === "number" ? author.vip_price : null;

  const monthlyPrice =
    typeof author?.monthly_price === "number" ? author.monthly_price : null;

  const annualPrice =
    typeof author?.annual_price === "number" ? author.annual_price : null;

  const annualMonthlyEquivalent =
    monthlyPrice && annualPrice ? annualPrice / 12 : null;

  const annualSavings =
    monthlyPrice && annualPrice ? monthlyPrice * 12 - annualPrice : null;

  const hasAnnualSavings = annualSavings !== null && annualSavings > 0;

  async function handleFreeSubscribe() {
    if (submitting) return;
    setSubmitting(true);

    try {
      await axiosInstance.post(
        `/community/subscriptions/${authorId}/subscribe`,
      );
      toast.success("Subscribed");
      navigate(redirectBack);
    } catch (err) {
      toast.error("Failed to subscribe");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaidSubscribe(interval) {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await axiosInstance.post(
        `/seller-checkout/create-author-subscription-checkout`,
        {
          authorUserId: authorId,
          billingInterval: interval,
        },
      );

      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Failed to start checkout");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center opacity-60">
        Loading subscription options…
      </div>
    );
  }

  if (!author) {
    return <div className="p-10 text-center opacity-60">Author not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-0 py-10 space-y-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => {
          if (isPreview) {
            window.close();
            return;
          }

          navigate(redirectBack);
        }}
        className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
      >
        <ArrowLeft size={16} />
        {isPreview ? "Close preview" : "Back"}
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <img
          src={author.profile_image_url || defaultImage}
          alt={author.name}
          className="w-20 h-20 rounded-full mx-auto object-cover"
        />

        <h1 className="text-2xl font-semibold">Subscribe to {author.name}</h1>

        <p className="text-sm opacity-70 max-w-md mx-auto">
          Choose how you’d like to follow and support this writer.
        </p>
      </div>
      {isPreview && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 px-4 py-2 text-sm text-center">
          You’re previewing your subscription page as others see it.
        </div>
      )}

      {/* Options */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Free */}
        <div className="rounded-xl border p-6 space-y-4 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark">
          <h3 className="text-lg font-semibold">Free</h3>

          <ul className="text-sm space-y-2 opacity-80">
            <li className="flex items-center gap-2">
              <Check size={14} /> New public post
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} /> Comment and engage
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} /> Send tips
            </li>
          </ul>

          <button
            type="button"
            disabled={submitting}
            onClick={handleFreeSubscribe}
            className={`
            w-full mt-4 py-3 rounded-lg
            border
            transition
            flex items-center justify-center gap-2
            ${submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"}
          `}
          >
            {submitting ? (
              <>
                <ButtonSpinner size={16} />
                Subscribing…
              </>
            ) : (
              "Subscribe for free"
            )}
          </button>
        </div>

        {/* Paid */}
        {hasMonthly && (
          <div className="rounded-xl border p-6 space-y-4 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark">
            <h3 className="text-lg font-semibold">Monthly</h3>

            <ul className="text-sm space-y-2 opacity-80">
              {author.monthly_benefits?.length > 0 ? (
                author.monthly_benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className="mt-[2px] shrink-0" />
                    {b}
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-2">
                  <Check size={14} /> Support the writer
                </li>
              )}
            </ul>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handlePaidSubscribe("monthly")}
              className="
              w-full mt-4 py-3 rounded-lg
              bg-blue text-white
              hover:opacity-90
              transition
            "
            >
              Subscribe – ${author.monthly_price.toFixed(2)}
            </button>
          </div>
        )}
        {hasAnnual && (
          <div className="rounded-xl border p-6 space-y-4 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Annual
              <span className="text-xs px-2 py-0.5 rounded-full bg-green/10 text-green">
                Best value
              </span>
            </h3>

            <ul className="text-sm space-y-2 opacity-80">
              {author.annual_benefits?.length > 0 ? (
                author.annual_benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className="mt-[2px] shrink-0" />
                    {b}
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <Check size={14} /> Everything in Monthly
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} /> Save with annual billing
                  </li>
                </>
              )}
            </ul>

            {annualMonthlyEquivalent && (
              <p className="text-xs opacity-70">
                ${annualMonthlyEquivalent.toFixed(2)}/month, billed annually
              </p>
            )}

            {hasAnnualSavings && (
              <p className="text-xs text-green">
                Save ${annualSavings.toFixed(2)} per year
              </p>
            )}

            <button
              type="button"
              disabled={submitting}
              onClick={() => handlePaidSubscribe("annual")}
              className="
              w-full mt-4 py-3 rounded-lg
              bg-blue/90 text-white
              hover:opacity-90
              transition
            "
            >
              Subscribe – ${author.annual_price.toFixed(2)}
            </button>
          </div>
        )}
        {hasVIP && (
          <div className="rounded-xl border p-6 space-y-4 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              VIP Founder
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-brightPurple">
                Limited
              </span>
            </h3>

            <ul className="text-sm space-y-2 opacity-80">
              {author.vip_benefits?.length > 0 ? (
                author.vip_benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={14} className="mt-[2px] shrink-0" />
                    {b}
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <Check size={14} /> Founder level access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} /> Direct support of the writer
                  </li>
                </>
              )}
            </ul>

            <p className="text-xs opacity-70">Billed annually</p>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handlePaidSubscribe("vip")}
              className="
        w-full mt-4 py-3 rounded-lg
        bg-brightPurple text-white
        hover:opacity-90
        transition
      "
            >
              Subscribe – ${vipPrice.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

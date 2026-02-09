import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import { Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import PreviewSubscribeModal from "./modals/PreviewSubscribeModal";
import { defaultBrandLogo } from "../../../assets/images";

const inputClass = `
  w-full rounded-xl px-4 py-3 text-sm
  bg-white dark:bg-[#0f1216]
  text-dashboard-text-light dark:text-dashboard-text-dark
  border border-dashboard-border-light dark:border-[#23272f]
  placeholder:text-dashboard-muted-light dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-blue/40
`;

export default function ProfileSettings() {
  const originalPublicationNameRef = useRef("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [currentEmployment, setCurrentEmployment] = useState("");

  const [interests, setInterests] = useState([]);
  const [services, setServices] = useState([]);
  const [mediaLinks, setMediaLinks] = useState([]);

  const [newInterest, setNewInterest] = useState("");
  const [newService, setNewService] = useState("");
  const [newMediaLabel, setNewMediaLabel] = useState("");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [authorId, setAuthorId] = useState(null);

  const [notificationPrefs, setNotificationPrefs] = useState({
    new_free_subscriber: true,
    canceled_free_subscription: true,
    post_comments: true,
  });

  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [hasUsername, setHasUsername] = useState(false);
  const [profile, setProfile] = useState(null);
  const [publicationLogoUrl, setPublicationLogoUrl] = useState(null);
  const [publicationName, setPublicationName] = useState("");
  const [publicationNameWarning, setPublicationNameWarning] = useState("");

  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(false);

  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [annualPrice, setAnnualPrice] = useState("");

  const [vipPrice, setVipPrice] = useState("");
  const [vipBenefits, setVipBenefits] = useState([]);
  const [newVipBenefit, setNewVipBenefit] = useState("");

  const [hasStripeCustomer, setHasStripeCustomer] = useState(false);
  const [monthlyBenefits, setMonthlyBenefits] = useState([]);
  const [annualBenefits, setAnnualBenefits] = useState([]);

  const [newMonthlyBenefit, setNewMonthlyBenefit] = useState("");
  const [newAnnualBenefit, setNewAnnualBenefit] = useState("");

  const [showPreviewWarning, setShowPreviewWarning] = useState(false);

  function togglePref(key) {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  useEffect(() => {
    fetchProfile();
    fetchNotificationPrefs();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/community/authors/me");

      const p = res.data.profile || {};

      setSubscriptionsEnabled(!!p.subscriptions_enabled);
      setUsername(p.username || "");
      setBio(p.bio || "");
      setAbout(p.about || "");
      setCurrentEmployment(p.current_employment || "");
      setInterests(p.interests || []);
      setServices(p.services || []);
      setMediaLinks(p.media_links || []);
      setProfile(p);
      setPublicationLogoUrl(p.publication_logo_url || null);
      setPublicationName(p.publication_name || "");

      originalPublicationNameRef.current = p.publication_name || "";

      setAuthorId(p.id);
      setHasStripeCustomer(!!p.stripe_connect_account_id);

      setSubscriptionsEnabled(!!p.subscriptions_enabled);
      setMonthlyPrice(
        typeof p.monthly_price === "number" ? p.monthly_price.toFixed(2) : "",
      );
      setAnnualPrice(
        typeof p.annual_price === "number" ? p.annual_price.toFixed(2) : "",
      );
      setMonthlyBenefits(p.monthly_benefits || []);
      setAnnualBenefits(p.annual_benefits || []);
      setVipPrice(
        typeof p.vip_price === "number" ? p.vip_price.toFixed(2) : "",
      );
      setVipBenefits(p.vip_benefits || []);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const canToggleSubscriptions = hasStripeCustomer || subscriptionsEnabled;

  async function uploadPublicationLogo(file) {
    if (!file || !authorId) return;

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const res = await axiosInstance.post("/upload-data/upload-avatar", {
          userId: authorId,
          profileImage: reader.result,
          target: "publication",
        });

        setPublicationLogoUrl(res.data.profileImage); // ✅ now defined
        toast.success("Publication logo updated");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Publication logo upload failed", err);
      toast.error("Failed to upload logo");
    }
  }

  async function fetchNotificationPrefs() {
    try {
      const res = await axiosInstance.get(
        "/community/authors/me/notifications",
      );

      setNotificationPrefs({
        new_free_subscriber: !!res.data.preferences.new_free_subscriber,
        canceled_free_subscription:
          !!res.data.preferences.canceled_free_subscription,
        post_comments: !!res.data.preferences.post_comments,
      });
      setPrefsLoaded(true);
    } catch (err) {
      console.error("fetchNotificationPrefs error", err);
      toast.error("Failed to load notification preferences");
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);

      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        toast.error(
          "Username must be 3–20 characters and contain only letters, numbers, or underscores.",
        );
        return;
      }

      await axiosInstance.post("/community/authors/me", {
        username,
        bio,
        about,
        current_employment: currentEmployment,
        interests,
        services,
        media_links: mediaLinks,
        publication_logo_url: publicationLogoUrl,
        publication_name: publicationName,
        monthly_benefits: monthlyBenefits,
        annual_benefits: annualBenefits,
        vip_benefits: vipBenefits,
      });

      await axiosInstance.post("/community/authors/me/subscription-pricing", {
        subscriptions_enabled: subscriptionsEnabled,
        monthly_price_cents:
          subscriptionsEnabled && monthlyPrice
            ? Math.round(Number(monthlyPrice) * 100)
            : undefined,
        annual_price_cents:
          subscriptionsEnabled && annualPrice
            ? Math.round(Number(annualPrice) * 100)
            : undefined,
        vip_price_cents: vipPrice
          ? Math.round(Number(vipPrice) * 100)
          : undefined,
      });

      await axiosInstance.post(
        "/community/authors/me/update-notifications",
        notificationPrefs,
      );

      toast.success("Profile updated");
      setPublicationNameWarning("");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save profile";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  function addMediaLink() {
    if (!newMediaLabel || !newMediaUrl) return;

    setMediaLinks([...mediaLinks, { label: newMediaLabel, url: newMediaUrl }]);

    setNewMediaLabel("");
    setNewMediaUrl("");
  }

  function removeMediaLink(index) {
    setMediaLinks(mediaLinks.filter((_, i) => i !== index));
  }

  if (loading) {
    return <p className="p-6 opacity-60">Loading settings…</p>;
  }

  return (
    <div className="h-screen flex flex-col bg-dashboard-bg-light dark:bg-dashboard-bg-dark overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-3 z-20 border-b border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
        <div className="px-3 sm:px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Author Settings</h1>
          </div>

          {/* Desktop save button */}
          <div className="hidden md:flex justify-end">
            <button
              onClick={saveProfile}
              disabled={saving || !prefsLoaded}
              className="
          px-4 py-2 rounded-lg text-sm font-medium
          bg-blue text-white
          hover:opacity-90 disabled:opacity-50
        "
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile action bar */}
      <div className="md:hidden px-4 py-3 border-b border-dashboard-border-light dark:border-dashboard-border-dark bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="
      w-full
      py-3
      rounded-lg
      text-sm
      font-medium
      bg-blue
      text-white
      hover:opacity-90
      disabled:opacity-50
    "
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-0 sm:px-4 py-4 sm:py-6 max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <Section
            title="Username"
            description="Your public @username. This will appear on your posts and profile."
          >
            {hasUsername && (
              <p className="text-xs mt-1 text-yellow-600">
                Usernames can’t be changed once set.
              </p>
            )}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="@username"
              disabled={hasUsername}
              className={`${inputClass} disabled:opacity-60`}
            />

            <p className="text-xs mt-1 text-dashboard-muted-light dark:text-dashboard-muted-dark">
              Letters, numbers, and underscores only
            </p>
          </Section>
          <Section
            title="Publication name"
            description="This is the public name of your writing publication."
          >
            <input
              value={publicationName}
              onChange={(e) => {
                const value = e.target.value;
                setPublicationName(value);

                const trimmed = value.trim();

                if (!trimmed) {
                  setPublicationNameWarning("");
                  return;
                }

                if (trimmed === originalPublicationNameRef.current.trim()) {
                  setPublicationNameWarning("");
                  return;
                }

                if (trimmed.length < 3) {
                  setPublicationNameWarning(
                    "Publication name must be at least 3 characters",
                  );
                } else if (trimmed.length > 120) {
                  setPublicationNameWarning(
                    "Publication name can’t exceed 120 characters",
                  );
                } else {
                  setPublicationNameWarning(
                    "Publication names must be unique and can’t be shared with other writers",
                  );
                }
              }}
              placeholder="The Messy Attic"
              maxLength={120}
              className={inputClass}
            />

            {publicationNameWarning ? (
              <p className="text-xs mt-1 text-yellow-600">
                {publicationNameWarning}
              </p>
            ) : (
              <p className="text-xs mt-1 opacity-60">
                If left blank, your name will be used.
              </p>
            )}
          </Section>

          <Section
            title="Publication logo"
            description="This image appears on your author page and publication header."
          >
            <div className="flex items-center gap-4">
              <img
                src={publicationLogoUrl || defaultBrandLogo}
                alt="Publication logo"
                className="w-20 h-20 rounded-xl object-cover border border-dashboard-border-light dark:border-dashboard-border-dark"
              />

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPublicationLogo(file);
                  }}
                />

                <span
                  className="
                  inline-flex items-center
                  px-4 py-2
                  rounded-lg
                  text-sm font-medium
                  bg-dashboard-hover-light
                  dark:bg-dashboard-hover-dark
                  border
                  border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  hover:opacity-90
                  transition
                "
                >
                  Upload logo
                </span>
              </label>
            </div>
          </Section>

          <Section title="Bio" description="Short one-line summary">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </Section>
          <Section title="About" description="Writer introduction">
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={15}
              className={inputClass}
            />
          </Section>
          <Section title="Current Employment">
            <input
              value={currentEmployment}
              onChange={(e) => setCurrentEmployment(e.target.value)}
              className={inputClass}
            />
          </Section>
          <TagSection
            title="Interests"
            value={newInterest}
            setValue={setNewInterest}
            list={interests}
            setList={setInterests}
          />
          <TagSection
            title="Services Provided"
            value={newService}
            setValue={setNewService}
            list={services}
            setList={setServices}
          />
          <Section title="Media Links">
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Label"
                value={newMediaLabel}
                onChange={(e) => setNewMediaLabel(e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="URL"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={addMediaLink}
                className="
                  px-4 rounded-xl
                  bg-dashboard-hover-light dark:bg-[#1b1f27]
                  border border-dashboard-border-light dark:border-[#2a2f38]
                "
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {mediaLinks.map((m, i) => (
                <div
                  key={i}
                  className="
                    flex items-center justify-between
                    rounded-xl p-4
                    bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
                    border border-dashboard-border-light dark:border-dashboard-border-dark
                  "
                >
                  <div>
                    <p className="font-medium">{m.label}</p>
                    <p className="text-xs opacity-60">{m.url}</p>
                  </div>
                  <button onClick={() => removeMediaLink(i)}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Section>
          <Section
            title="Paid subscriptions"
            description={
              <div className="space-y-1">
                <p>Let readers support you with a recurring subscription.</p>

                {!hasStripeCustomer && (
                  <p className="text-xs text-yellow-500">
                    You’ll need to{" "}
                    <Link to="/settings" className="underline hover:opacity-80">
                      set up billing
                    </Link>{" "}
                    before enabling paid subscriptions.
                  </p>
                )}
              </div>
            }
          >
            <div className="w-full mb-6 sm:flex sm:justify-end">
              {subscriptionsEnabled && authorId && (
                <button
                  type="button"
                  onClick={() => setShowPreviewWarning(true)}
                  className="
                  w-full
                  sm:w-auto
                  text-xs
                  px-4
                  py-3
                  sm:py-2
                  rounded-lg
                  border
                  text-center
                  hover:bg-dashboard-hover-light
                  dark:hover:bg-dashboard-hover-dark
                  transition
                "
                >
                  Preview page
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Enable toggle */}
              <label className="flex items-center gap-3 text-sm text-green">
                <input
                  type="checkbox"
                  disabled={!canToggleSubscriptions}
                  checked={subscriptionsEnabled}
                  onChange={(e) => setSubscriptionsEnabled(e.target.checked)}
                />
                Enable paid subscriptions
              </label>

              {subscriptionsEnabled && (
                <div
                  className="
                  rounded-xl
                  p-4
                  sm:p-5
                  bg-dashboard-hover-light
                  dark:bg-dashboard-hover-dark
                  border
                  border-dashboard-border-light
                  dark:border-dashboard-border-dark
                  space-y-5
                "
                >
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue/20 text-mediaBlue">
                      Standard
                    </span>
                    <span className="text-xs opacity-60">
                      Monthly and annual subscriptions
                    </span>
                  </div>

                  {/* Monthly */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs opacity-60">
                        Monthly price (USD)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(e.target.value)}
                        className={inputClass}
                        placeholder="7.50"
                      />
                    </div>

                    <BenefitEditor
                      title="Monthly subscription benefits"
                      benefits={monthlyBenefits}
                      setBenefits={setMonthlyBenefits}
                      newValue={newMonthlyBenefit}
                      setNewValue={setNewMonthlyBenefit}
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashboard-border-light dark:border-dashboard-border-dark" />

                  {/* Annual */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs opacity-60">
                        Annual price (USD)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={annualPrice}
                        onChange={(e) => setAnnualPrice(e.target.value)}
                        className={inputClass}
                        placeholder="50.00"
                      />
                    </div>

                    <BenefitEditor
                      title="Annual subscription benefits"
                      benefits={annualBenefits}
                      setBenefits={setAnnualBenefits}
                      newValue={newAnnualBenefit}
                      setNewValue={setNewAnnualBenefit}
                    />
                  </div>
                </div>
              )}

              {subscriptionsEnabled && (
                <div
                  className="
      rounded-xl
      p-4
      sm:p-5
      bg-dashboard-hover-light
      dark:bg-dashboard-hover-dark
      border
      border-dashboard-border-light
      dark:border-dashboard-border-dark
      space-y-4
    "
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-purple/20 text-purple">
                        VIP Founder
                      </span>
                      <span className="text-xs opacity-60">
                        Premium, limited tier
                      </span>
                    </div>

                    <span className="text-xs opacity-50">Annual only</span>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-xs opacity-60">
                      Price (USD / year)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={vipPrice}
                      onChange={(e) => setVipPrice(e.target.value)}
                      className={inputClass}
                      placeholder="240.00"
                    />
                  </div>

                  {/* Benefits */}
                  <BenefitEditor
                    title="VIP Founder benefits"
                    benefits={vipBenefits}
                    setBenefits={setVipBenefits}
                    newValue={newVipBenefit}
                    setNewValue={setNewVipBenefit}
                  />
                </div>
              )}
            </div>
          </Section>

          <Section
            title="Unlock more tools"
            description="Upgrade your plan to access premium writing and publishing features."
          >
            <div
              className="
              flex flex-col sm:flex-row
              items-start sm:items-center
              justify-between
              gap-4
              rounded-xl
              p-4
              bg-dashboard-hover-light
              dark:bg-dashboard-hover-dark
              border
              border-dashboard-border-light
              dark:border-dashboard-border-dark
            "
            >
              <p className="text-sm opacity-80 max-w-xl">
                Author’s Assistant is available on paid plan.
              </p>

              <Link to="/plans">
                <button
                  className="
                  px-4 py-2
                  rounded-lg
                  text-sm font-medium
                  bg-blue
                  text-white
                  hover:opacity-90
                  whitespace-nowrap
                "
                >
                  View plans
                </button>
              </Link>
            </div>
          </Section>

          <Section
            title="Notifications"
            description="Control which activity you want to be notified about"
          >
            <div className="space-y-6">
              {/* Subscriptions */}
              <div className="space-y-4">
                {/* <NotificationRow
                  title="New paid subscriber"
                  description="When someone pays to subscribe"
                  enabled={notificationPrefs.new_paid_subscriber}
                  onToggle={() => togglePref("new_paid_subscriber")}
                /> */}

                <NotificationRow
                  title="New free subscriber"
                  description="When someone subscribes for free"
                  enabled={notificationPrefs.new_free_subscriber}
                  onToggle={() => togglePref("new_free_subscriber")}
                />

                {/* <NotificationRow
                  title="Canceled paid subscription"
                  description="When someone cancels a paid subscription"
                  enabled={notificationPrefs.canceled_paid_subscription}
                  onToggle={() => togglePref("canceled_paid_subscription")}
                /> */}

                <NotificationRow
                  title="Canceled free subscription"
                  description="When someone cancels a free subscription"
                  enabled={notificationPrefs.canceled_free_subscription}
                  onToggle={() => togglePref("canceled_free_subscription")}
                />
              </div>

              <div className="border-t border-dashboard-border-light dark:border-dashboard-border-dark" />

              {/* Engagement */}
              <div className="space-y-4">
                <NotificationRow
                  title="Comments on your posts"
                  description="When someone comments on a post you published"
                  enabled={notificationPrefs.post_comments}
                  onToggle={() => togglePref("post_comments")}
                />
              </div>
            </div>
          </Section>
        </div>
      </div>
      <PreviewSubscribeModal
        open={showPreviewWarning}
        onClose={() => setShowPreviewWarning(false)}
        onConfirm={() => {
          setShowPreviewWarning(false);
          window.open(
            `/community/subscribe/${authorId}/choose?preview=1`,
            "_blank",
          );
        }}
      />
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Section({ title, description, children }) {
  return (
    <div
      className="
        /* mobile */
        p-4
        rounded-none
        border-none
        shadow-none
        bg-transparent

        /* desktop */
        sm:p-6
        sm:rounded-2xl
        sm:bg-dashboard-sidebar-light
        sm:dark:bg-dashboard-sidebar-dark
        sm:border
        sm:border-dashboard-border-light
        sm:dark:border-dashboard-border-dark
        sm:shadow-sm
      "
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && (
          <div className="text-xs opacity-60 mt-1">{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition
        ${enabled ? "bg-indigo-500" : "bg-gray-400/40"}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition
          ${enabled ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  );
}

function NotificationRow({ title, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm opacity-60">{description}</p>
      </div>
      <Toggle enabled={enabled} onChange={onToggle} />
    </div>
  );
}

function TagSection({ title, value, setValue, list, setList }) {
  function addTags() {
    if (!value.trim()) return;

    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => !list.includes(t));

    if (tags.length) {
      setList([...list, ...tags]);
    }

    setValue("");
  }

  return (
    <Section title={title}>
      <div className="flex gap-2 mb-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTags();
            }
          }}
          placeholder="Type tags separated by commas"
          className={inputClass}
        />
        <button
          onClick={addTags}
          className="
            px-4 rounded-xl
            bg-dashboard-hover-light dark:bg-[#1b1f27]
            border border-dashboard-border-light dark:border-[#2a2f38]
          "
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {list.map((tag) => (
          <span
            key={tag}
            className="
              flex items-center gap-1
              px-3 py-1 rounded-full text-xs font-medium
              bg-dashboard-hover-light dark:bg-[#1b1f27]
              border border-dashboard-border-light dark:border-[#2a2f38]
            "
          >
            {tag}
            <button onClick={() => setList(list.filter((t) => t !== tag))}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </Section>
  );
}

function BenefitEditor({
  title,
  benefits,
  setBenefits,
  newValue,
  setNewValue,
}) {
  const MAX_BENEFITS = 10;
  const isAtLimit = benefits.length >= MAX_BENEFITS;

  const [dragIndex, setDragIndex] = useState(null);

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(dropIndex) {
    if (dragIndex === null || dragIndex === dropIndex) return;

    const updated = [...benefits];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);

    setBenefits(updated);
    setDragIndex(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{title}</label>
        <span className="text-xs opacity-60">
          {benefits.length}/{MAX_BENEFITS}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={isAtLimit ? "Maximum benefits reached" : "Add a benefit"}
          disabled={isAtLimit}
          className={`${inputClass} ${isAtLimit ? "opacity-60" : ""}`}
        />

        <button
          disabled={isAtLimit}
          onClick={() => {
            if (!newValue.trim() || isAtLimit) return;
            setBenefits([...benefits, newValue.trim()]);
            setNewValue("");
          }}
          className="
            px-4 rounded-xl
            bg-dashboard-hover-light dark:bg-[#1b1f27]
            disabled:opacity-50
          "
        >
          <Plus size={16} />
        </button>
      </div>

      {isAtLimit && (
        <p className="text-xs text-yellow-500">
          You can add up to 10 benefits per subscription tier.
        </p>
      )}

      <ul className="space-y-2">
        {benefits.map((b, i) => (
          <li
            key={i}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(i)}
            className="
              flex items-center justify-between gap-3
              rounded-xl p-3
              bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light dark:border-dashboard-border-dark
              cursor-move
            "
          >
            <div className="flex items-center gap-2">
              <span className="opacity-50 cursor-grab">☰</span>
              <span className="text-sm">{b}</span>
            </div>

            <button
              onClick={() =>
                setBenefits(benefits.filter((_, idx) => idx !== i))
              }
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

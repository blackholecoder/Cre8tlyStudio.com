import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import { Plus, X } from "lucide-react";

const inputClass = `
  w-full rounded-xl px-4 py-3 text-sm
  bg-white dark:bg-[#0f1216]
  text-dashboard-text-light dark:text-dashboard-text-dark
  border border-dashboard-border-light dark:border-[#23272f]
  placeholder:text-dashboard-muted-light dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-blue/40
`;

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const [notificationPrefs, setNotificationPrefs] = useState({
    new_free_subscriber: true,
    canceled_free_subscription: true,
    post_comments: true,
  });

  const [prefsLoaded, setPrefsLoaded] = useState(false);

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

      setBio(p.bio || "");
      setAbout(p.about || "");
      setCurrentEmployment(p.current_employment || "");
      setInterests(p.interests || []);
      setServices(p.services || []);
      setMediaLinks(p.media_links || []);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
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

      await axiosInstance.post("/community/authors/me", {
        bio,
        about,
        current_employment: currentEmployment,
        interests,
        services,
        media_links: mediaLinks,
      });

      await axiosInstance.post(
        "/community/authors/me/update-notifications",
        notificationPrefs,
      );

      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save profile");
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
        <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-4xl mx-auto space-y-6 sm:space-y-8">
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
          <p className="text-xs opacity-60 mt-1">{description}</p>
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

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

  useEffect(() => {
    fetchProfile();
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
        <div className="px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Author Settings</h1>
          </div>

          {/* Desktop save button */}
          <div className="hidden md:flex justify-end">
            <button
              onClick={saveProfile}
              disabled={saving}
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
        <div className="px-4 py-6 max-w-4xl mx-auto space-y-8">
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
        rounded-2xl p-5 sm:p-6
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
        shadow-sm
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

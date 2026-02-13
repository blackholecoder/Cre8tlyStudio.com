import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import { ExternalLink, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../admin/AuthContext";
import { ProfilePostCarousel } from "../posts/ProfilePostCarousel";
import { ButtonSpinner } from "../../../helpers/buttonSpinner";
import { BADGE_DEFS } from "../badges";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const { user } = useAuth(); // viewer
  const { userId } = useParams(); // profile owner
  const navigate = useNavigate();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [badges, setBadges] = useState([]);
  const [hasPaidSubscription, setHasPaidSubscription] = useState(false);

  const isOwnProfile = !userId || user?.id === userId;

  useEffect(() => {
    if (!profile?.id) return;
    if (!user) return;
    if (isOwnProfile) return;

    loadSubscriptionStatus();
  }, [profile, user, isOwnProfile]);

  async function loadSubscriptionStatus() {
    try {
      const res = await axiosInstance.get(
        `/community/subscriptions/${profile.id}/status`,
      );

      setIsSubscribed(res.data.subscribed);
      setHasPaidSubscription(res.data.has_paid_subscription);
    } catch (err) {
      console.error("Failed to load subscription status", err);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchBadges();
  }, [userId]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        userId ? `/community/authors/${userId}` : "/community/authors/me",
      );
      setProfile(res.data.profile);
    } catch (err) {
      console.error("Failed to load author profile");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBadges() {
    try {
      const url =
        isOwnProfile || !userId
          ? "/badges/my-badges"
          : `/badges/user-badges/${userId}`;

      const res = await axiosInstance.get(url);
      setBadges(res.data.badges || []);
    } catch (err) {
      console.error("Failed to load badges", err);
    }
  }

  function handleSubscribeClick() {
    if (!profile?.id) return;

    if (!user) {
      navigate(
        `/signup-community?redirect=/community/subscribe/${profile.id}/choose`,
      );
      return;
    }

    navigate(`/community/subscribe/${profile.id}/choose`, {
      state: {
        from: `/community/authors/${profile.id}`,
      },
    });
  }

  if (loading) {
    return <div className="p-6 opacity-60">Loading profile…</div>;
  }

  if (!profile) {
    return <div className="p-6 opacity-60">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-dashboard-bg-light dark:bg-dashboard-bg-dark">
      <div className="max-w-6xl mx-auto px-0 py-2 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-2xl p-6 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark border border-dashboard-border-light dark:border-dashboard-border-dark">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-dashboard-hover-light dark:bg-dashboard-hover-dark">
                  {profile.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-semibold opacity-40">
                      {profile.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <h1 className="text-lg font-semibold">{profile.name}</h1>
                <p>@{profile.username}</p>
                {!isOwnProfile && (
                  <button
                    onClick={handleSubscribeClick}
                    disabled={subLoading}
                    className={`
    mt-4
    text-sm px-4 py-2 rounded-lg border transition
    flex items-center justify-center gap-2
    ${
      isSubscribed
        ? "bg-green/10 text-green border-green/30 hover:bg-green/20"
        : "bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-dashboard-text-light dark:text-dashboard-text-dark border-dashboard-border-light dark:border-dashboard-border-dark hover:opacity-80"
    }
    disabled:opacity-50
  `}
                  >
                    {subLoading ? (
                      <>
                        <ButtonSpinner size={14} />
                        <span className="text-xs">Please wait</span>
                      </>
                    ) : isSubscribed ? (
                      "Manage Subscription"
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                )}

                {profile.bio && (
                  <p className="mt-3 text-sm opacity-70 leading-relaxed text-left">
                    {profile.bio}
                  </p>
                )}
                <button
                  onClick={() => {
                    if (isOwnProfile) {
                      navigate("/community/subscriptions/subscribers");
                    } else {
                      navigate(`/community/authors/${profile.id}/subscribers`);
                    }
                  }}
                  className="
                  mt-4 w-full
                  flex items-center justify-center
                  rounded-lg
                  bg-dashboard-hover-light dark:bg-dashboard-hover-dark
                  px-4 py-2
                  text-sm
                  text-dashboard-text-light dark:text-dashboard-text-dark
                  hover:opacity-80
                  transition
                "
                >
                  <span>{profile.subscriber_count.toLocaleString()}</span>
                  <span className="ml-1 opacity-70">
                    subscriber{profile.subscriber_count === 1 ? "" : "s"}
                  </span>
                </button>
                {badges.length > 0 && (
                  <div className="mt-4 w-full">
                    <div
                      className="
                      grid grid-cols-3 gap-3 justify-items-center
                      sm:flex sm:flex-wrap sm:justify-center
                    "
                    >
                      {badges.map((badge) => (
                        <ProfileBadge key={badge.key_name} badge={badge} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Media Links */}
            {profile.media_links?.length > 0 && (
              <div className="rounded-2xl p-5 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark border border-dashboard-border-light dark:border-dashboard-border-dark">
                <h3 className="text-sm font-semibold mb-3">Links</h3>

                <div className="space-y-2">
                  {profile.media_links.map((m, i) => (
                    <a
                      key={i}
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        flex items-center justify-between
                        px-3 py-2 rounded-lg text-sm
                        bg-dashboard-hover-light dark:bg-dashboard-hover-dark
                        hover:opacity-80 transition
                      "
                    >
                      <span>{m.label}</span>
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* Publication */}
            {profile.posts?.length > 0 && (
              <div className="rounded-2xl p-5 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark border border-dashboard-border-light dark:border-dashboard-border-dark">
                <div className="flex flex-col gap-4">
                  {/* Publication header */}
                  <div className="flex items-center gap-3">
                    {profile.publication_logo_url && (
                      <img
                        src={profile.publication_logo_url}
                        alt={profile.publication_name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}

                    <div className="leading-tight">
                      <h3 className="text-sm font-semibold">
                        {profile.publication_name || "Publication"}
                      </h3>
                      <p className="text-xs opacity-60">
                        Writing by {profile.name}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {profile.publication_description && (
                    <p className="text-sm opacity-70 leading-relaxed">
                      {profile.publication_description}
                    </p>
                  )}

                  {/* Action */}
                  <button
                    onClick={() =>
                      navigate(`/community/authors/${profile.id}/publication`)
                    }
                    className="
          mt-1
          w-full
          flex items-center justify-between
          px-4 py-2
          rounded-lg
          bg-dashboard-hover-light dark:bg-dashboard-hover-dark
          text-sm
          text-dashboard-text-light dark:text-dashboard-text-dark
          hover:opacity-80
          transition
        "
                  >
                    <span>
                      Read {profile.publication_name || "publication"}
                    </span>
                    <ChevronRight size={16} className="mt-[1px]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            {profile.about && (
              <Section title="About">
                <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">
                  {profile.about}
                </p>
              </Section>
            )}

            {/* Current Employment */}
            {profile.current_employment && (
              <Section title="Current Employment">
                <p className="text-sm opacity-80">
                  {profile.current_employment}
                </p>
              </Section>
            )}

            {/* Interests */}
            {profile.interests?.length > 0 && (
              <Section title="Interests">
                <TagGrid tags={profile.interests} />
              </Section>
            )}

            {/* Services */}
            {profile.services?.length > 0 && (
              <Section title="Services Provided">
                <TagGrid tags={profile.services} />
              </Section>
            )}

            {/* Recent Posts */}
            {profile.posts?.length > 0 && (
              <Section title="Posts">
                <ProfilePostCarousel posts={profile.posts} />
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */
function Section({ title, children }) {
  return (
    <div className="rounded-2xl p-6 bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark border border-dashboard-border-light dark:border-dashboard-border-dark">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function ProfileBadge({ badge }) {
  const def = BADGE_DEFS[badge.key_name];

  // Safety guard (never crash profile)
  if (!def) return null;

  const earned = Boolean(badge.earned);
  const Icon = def.icon;

  return (
    <div
      title={badge.description}
      className={`
        flex flex-col items-center
        w-16
        text-center
        transition
        ${earned ? "opacity-100" : "opacity-40 grayscale"}
      `}
    >
      <div
        className={`
          w-10 h-10 rounded-full
          flex items-center justify-center
          border
          ${def.bg}
          ${earned ? def.color : ""}
          border-dashboard-border-light dark:border-dashboard-border-dark
        `}
      >
        <Icon size={18} />
      </div>

      <span className="mt-1 text-[10px] leading-tight">{def.label}</span>
    </div>
  );
}

function TagGrid({ tags }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="
            px-2.5 py-0.5
            rounded-full
            text-[11px] font-medium tracking-wide
            bg-dashboard-hover-light/70
            dark:bg-[#1b1f27]/70
            border border-dashboard-border-light/60
            dark:border-[#2a2f38]/60
            opacity-80
          "
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

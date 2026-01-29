import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../admin/AuthContext";
import { defaultImage, headerLogo } from "../../../assets/images";

export default function InviteAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState(null);

  useEffect(() => {
    verifyInvite();
  }, []);

  async function verifyInvite() {
    try {
      const res = await axiosInstance.get(
        `/community/subscriptions/invites/${token}`,
      );
      setInvite(res.data.invite);
    } catch {
      toast.error("Invite not found or expired");
    } finally {
      setLoading(false);
    }
  }

  async function acceptInvite() {
    if (!user) {
      navigate(
        `/signup-community?email=${encodeURIComponent(invite.email)}&invite=${token}`,
      );
      return;
    }

    try {
      navigate(
        `/signup-community?email=${encodeURIComponent(invite.email)}&invite=${token}`,
      );

      toast.success("Subscription activated");
      navigate("/community");
    } catch {
      toast.error("Failed to accept invite");
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  if (!invite) {
    return (
      <div className="p-10 text-center opacity-60">Invite not available</div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-dashboard-bg-dark">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dashboard-sidebar-dark border border-gray-200 dark:border-dashboard-border-dark shadow-xl p-8 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <img src={headerLogo} alt="The Messy Attic" className="h-16 mb-2" />
          <div className="text-lg font-semibold tracking-wide text-gray-700 dark:text-gray-300">
            yThe Messy Attic Community
          </div>
        </div>

        {/* Inviter avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={invite.author_avatar || defaultImage}
              alt={invite.author_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          You’ve been invited
        </h1>

        {/* Subhead */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {invite.author_name}
          </span>{" "}
          has invited you to join a private community for writers, authors, and
          readers.
        </p>

        {/* CTA */}
        <button
          onClick={acceptInvite}
          className="w-full py-3 rounded-xl bg-primary text-black font-semibold hover:opacity-90 transition"
        >
          Accept invitation
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400">
          You’ll be asked to sign in or create an account if needed.
        </p>
      </div>
    </div>
  );
}

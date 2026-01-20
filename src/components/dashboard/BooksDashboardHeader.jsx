import { FileEdit, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../admin/AuthContext";

export default function BooksDashboardHeader({ books = [], onCheckout }) {
  const { user } = useAuth();

  if (!user) return null;

  const totalSlots = user?.book_slots ?? 0;

  const usedSlots = books.filter((b) => b.is_complete === 1).length;

  const availableSlots = Math.max(totalSlots - usedSlots, 0);

  return (
    <div className="mb-8">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left */}
        <div>
          <h1
            className="
            text-3xl font-bold normal-case
            text-dashboard-text-light
            dark:text-dashboard-text-dark
"
          >
            My Books
          </h1>

          <div
            className="
            text-sm mt-1
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
          "
          >
            Welcome,{" "}
            <span
              className="
              font-semibold
              text-dashboard-text-light
              dark:text-dashboard-text-dark
            "
            >
              {user?.name?.split(" ")[0] || "Author"}
            </span>
          </div>

          <p
            className="
            mt-2
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark
          "
          >
            You currently have {availableSlots} book slots remaining.
          </p>
        </div>

        {/* Right actions */}
        <div className="flex items-start gap-3">
          <Link
            to="/docs/authors-assistant"
            className="
            inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            bg-dashboard-hover-light
            dark:bg-dashboard-hover-dark
            text-black
            dark:text-green
            hover:opacity-90
          "
          >
            <FileEdit className="w-4 h-4 text-black dark:text-green" />
            Docs
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Slot actions */}
      {availableSlots === 0 && (
        <div className="mt-4">
          <button
            onClick={onCheckout}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green to-royalPurple text-white font-semibold hover:opacity-90 transition shadow-lg"
          >
            Purchase More Slots
          </button>
        </div>
      )}
    </div>
  );
}

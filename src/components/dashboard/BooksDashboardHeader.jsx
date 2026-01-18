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
          <h1 className="text-3xl font-bold text-white normal-case">
            My Books
          </h1>

          <div className="text-sm text-gray-400 mt-1">
            Welcome,{" "}
            <span className="text-white font-semibold">
              {user?.name?.split(" ")[0] || "Author"}
            </span>
          </div>

          <p className="text-silver mt-2">
            You currently have {availableSlots} book slots remaining.
          </p>
        </div>

        {/* Right actions */}
        <div className="flex items-start gap-3">
          <Link
            to="/docs/authors-assistant"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-black/40 px-3 py-2 text-xs text-green hover:bg-black/60 transition"
          >
            <FileEdit className="w-4 h-4" />
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

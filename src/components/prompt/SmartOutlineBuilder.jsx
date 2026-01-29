import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../admin/AuthContext";

export default function SmartPromptBuilder({ onPromptReady }) {
  const [audience, setAudience] = useState("");
  const [pain, setPain] = useState("");
  const [promise, setPromise] = useState("");
  const [offer, setOffer] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, accessToken } = useAuth();

  const isFreePlan = user?.has_free_magnet === 1 && user?.magnet_slots === 1;

  const handleGeneratePrompt = async () => {
    if (!audience || !pain || !promise) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to generate prompts.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://themessyattic.com/api/lead-magnets/prompt-builder",
        {
          userId: user.id, // ✅ include user ID for tone lookup
          audience,
          pain,
          promise,
          offer,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ optional, if route uses auth middleware
          },
        },
      );

      onPromptReady(res.data.prompt);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate prompt. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      bg-dashboard-hover-light
      dark:bg-dashboard-hover-dark
      p-4 sm:p-6
      rounded-xl
      border border-dashboard-border-light
      dark:border-dashboard-border-dark
    "
    >
      {/* 🔽 Internal scroll container */}
      <div
        className="max-h-[75vh]
        sm:max-h-[60vh]
        overflow-y-auto
        pr-1
        sm:pr-2
        space-y-5"
      >
        <h2 className="text-xl font-bold text-dashboard-text-light dark:text-dashboard-text-dark">
          Smart Prompt Builder
        </h2>

        <p className="text-sm text-dashboard-muted-light dark:text-dashboard-muted-dark">
          Answer a few quick questions so we can craft a personalized lead
          magnet prompt for you.
        </p>

        {/* Audience */}
        <div>
          <label className="block mb-1 text-dashboard-text-light dark:text-dashboard-text-dark">
            Who is this for?
          </label>
          <textarea
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="
            w-full
            min-h-[110px]
            sm:min-h-[80px]
            resize-y
            overflow-y-auto
            p-3 sm:p-3
            rounded
            bg-dashboard-bg-light
            dark:bg-dashboard-bg-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            placeholder-dashboard-muted-light
            dark:placeholder-dashboard-muted-dark
            leading-relaxed
            "
            placeholder="Example: entrepreneurs, creators, small business owners"
          />
        </div>

        {/* Pain */}
        <div>
          <label className="block mb-1 text-dashboard-text-light dark:text-dashboard-text-dark">
            What problem are they facing?
          </label>
          <textarea
            value={pain}
            onChange={(e) => setPain(e.target.value)}
            className="
            w-full
            min-h-[110px]
            sm:min-h-[80px]
            resize-y
            overflow-y-auto
            p-3 sm:p-3
            rounded
            bg-dashboard-bg-light
            dark:bg-dashboard-bg-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            placeholder-dashboard-muted-light
            dark:placeholder-dashboard-muted-dark
            leading-relaxed
            "
            placeholder="Example: struggling to grow an email list or convert leads"
          />
        </div>

        {/* Promise */}
        <div>
          <label className="block mb-1 text-dashboard-text-light dark:text-dashboard-text-dark">
            What transformation or result do they want?
          </label>
          <textarea
            value={promise}
            onChange={(e) => setPromise(e.target.value)}
            className="
            w-full
            min-h-[110px]
            sm:min-h-[80px]
            resize-y
            overflow-y-auto
            p-3 sm:p-3
            rounded
            bg-dashboard-bg-light
            dark:bg-dashboard-bg-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            placeholder-dashboard-muted-light
            dark:placeholder-dashboard-muted-dark
            leading-relaxed
            "
            placeholder="Example: consistently attract qualified leads every week"
          />
        </div>

        {/* Offer */}
        <div>
          <label className="block mb-1 text-dashboard-text-light dark:text-dashboard-text-dark">
            What’s your offer or next step? (optional)
          </label>
          <textarea
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="
            w-full
            min-h-[110px]
            sm:min-h-[80px]
            resize-y
            overflow-y-auto
            p-3 sm:p-3
            rounded
            bg-dashboard-bg-light
            dark:bg-dashboard-bg-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            placeholder-dashboard-muted-light
            dark:placeholder-dashboard-muted-dark
            leading-relaxed
            "
            placeholder="Example: join my course, book a free strategy call"
          />
        </div>
      </div>

      {/* 🔽 Sticky action bar */}
      <div
        className="flex
        flex-col
        sm:flex-row
        gap-3
        mt-6"
      >
        <button
          onClick={handleGeneratePrompt}
          disabled={loading}
          className="w-full
          sm:flex-1
          px-6
          py-4
          sm:py-3
         bg-green
        text-dashboard-bg-dark
          font-semibold
          rounded
          hover:bg-green-500
          transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {!isFreePlan && (
          <button
            onClick={() => onPromptReady("")}
            disabled={loading}
            className="
            w-full
            sm:flex-1
            px-6
            py-4
            sm:py-3
            bg-transparent
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            text-dashboard-text-light
            dark:text-dashboard-text-dark
            font-semibold
            rounded
            hover:border-green
            hover:text-green
            transition
            "
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

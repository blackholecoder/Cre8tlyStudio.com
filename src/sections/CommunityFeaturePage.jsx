// src/pages/CommunityFeaturePage.jsx
import {
  MessageSquare,
  Upload,
  Lock,
  PenTool,
  DollarSign,
  TrendingUp,
  Check,
  AudioWaveform,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ------------------ helpers ------------------ */

const Card = ({ className = "", children }) => (
  <div
    className={[
      "rounded-2xl border border-gray-200 bg-white shadow-sm",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

/* motion presets – NO opacity fades */
const reveal = {
  hidden: { y: 24 },
  visible: {
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------ page ------------------ */

export default function CommunityFeaturePage() {
  const navigate = useNavigate();

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-20">
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14 sm:pt-20 sm:pb-20 overflow-hidden">
        {/* background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-neutral-900 sm:rounded-xl" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative grid gap-8 lg:grid-cols-2 items-center"
        >
          {/* LEFT CONTENT */}
          <div className="flex flex-col gap-5 text-center lg:text-left px-2 sm:px-0">
            <motion.div
              variants={reveal}
              className="text-sm font-medium tracking-wide text-white/70 uppercase"
            >
              WRITING-FIRST · SUBSCRIPTION-POWERED
            </motion.div>

            <motion.h1
              variants={reveal}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
            >
              A focused writing community built on real support.
            </motion.h1>

            <motion.p
              variants={reveal}
              className="max-w-2xl mx-auto lg:mx-0 text-lg text-white/90"
            >
              Publish free previews. Lock full essays behind a subscriber
              paywall. Turn readers into paying supporters without algorithms,
              follower counts, or platforms deciding who gets seen.
            </motion.p>
          </div>

          {/* RIGHT ICON */}
          <motion.div
            variants={reveal}
            className="flex justify-center lg:justify-end pt-2 sm:pt-0"
          >
            <div className="relative flex items-center justify-center">
              <div
                className="
      flex items-center justify-center 
      rounded-full
      border border-white/10
      h-28 w-28
      sm:h-36 sm:w-36
      lg:h-64 lg:w-64
    "
              >
                <PenTool className="h-14 w-14 sm:h-18 sm:w-18 lg:h-32 lg:w-32 text-neutral-200" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURE PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            {
              icon: Lock,
              title: "Free + Paid in one post",
              desc: "Write a free preview, then lock the rest behind your paywall.",
            },
            {
              icon: DollarSign,
              title: "Subscriber-based access",
              desc: "Offer paid subscriptions and unlock exclusive posts and discussions.",
            },
            {
              icon: Upload,
              title: "Bring your audience",
              desc: "Invite readers directly and build a community you actually own.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={reveal}
              whileHover={{ y: -6 }}
              className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
          transition
        "
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200">
                  <Icon className="h-5 w-5 text-gray-800" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* VALUE GRID */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        {/* SECTION HEADER */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Built for writers who care about the work
          </h2>
          <p className="mt-4 text-gray-600">
            The Messy Attic is designed for writers who want fewer distractions,
            deeper conversations, and a community that values the work, not the
            numbers.
          </p>
        </motion.div>

        {/* FEATURE GRID */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3 items-stretch"
        >
          {[
            {
              icon: MessageSquare,
              title: "Real conversation",
              desc: "Readers engage thoughtfully. Writing rises through discussion, not algorithms.",
            },
            {
              icon: Lock,
              title: "Built-in paywall",
              desc: "Publish free previews and lock full essays for subscribers in the same post.",
              highlight: true,
            },
            {
              icon: TrendingUp,
              title: "Predictable income",
              desc: "Turn consistent writing into recurring revenue from readers who value your work.",
            },
          ].map(({ icon: Icon, title, desc, highlight }) => (
            <motion.div
              key={title}
              variants={reveal}
              className={`
        p-8 rounded-2xl transition h-full flex flex-col
        ${
          highlight
            ? "bg-black text-white border border-black"
            : "bg-white border border-gray-200"
        }
      `}
            >
              <Icon
                className={`h-6 w-6 ${
                  highlight ? "text-emerald-400" : "text-gray-800"
                }`}
              />

              <h3
                className={`mt-4 text-xl font-semibold ${
                  highlight ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h3>

              <p
                className={`mt-3 text-sm leading-relaxed ${
                  highlight ? "text-white/80" : "text-gray-600"
                }`}
              >
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      {/* FREE VS SUBSCRIBERS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Free readers or paid supporters
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Let anyone discover your writing. Reward subscribers who choose to
            support it.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 items-stretch">
          {/* FREE */}
          <div className="p-10 rounded-3xl border border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              Free Readers
            </h3>

            <ul className="mt-8 space-y-4 text-sm text-gray-700">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-gray-400" />
                Read previews
              </li>

              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-gray-400" />
                Comment on public posts
              </li>

              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-gray-400" />
                Discover your work
              </li>
            </ul>
          </div>

          {/* SUBSCRIBERS */}
          <div className="p-10 rounded-3xl bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black to-neutral-900" />

            <div className="relative">
              <h3 className="text-xl font-semibold">Subscribers</h3>

              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Unlock full essays
                </li>

                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Access private posts
                </li>

                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Join paid discussions
                </li>

                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Support your writing directly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EMAIL + PUBLICATION INFRASTRUCTURE */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* LEFT SIDE – COPY */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Own your audience.
            </h2>

            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              When someone subscribes, they don’t just unlock content. They
              become part of your publication.
            </p>

            <ul className="mt-8 space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-500 mt-1" />
                Custom email templates branded to your publication
              </li>

              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-500 mt-1" />
                Automatic email alerts when you publish new work
              </li>

              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-500 mt-1" />
                Notifications when readers comment or engage
              </li>

              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-500 mt-1" />A dedicated
                publication page for all your writing
              </li>
            </ul>
          </div>

          {/* RIGHT SIDE – PLATFORM PREVIEW */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 shadow-xl">
            {/* Publication Header */}
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">The Inspired</div>
              <div className="text-xs text-neutral-500">
                Writing by David Parsons
              </div>
            </div>

            {/* Featured Post */}
            <div className="mt-6 border border-neutral-800 rounded-xl p-6 bg-neutral-900">
              <div className="text-lg font-bold text-white">
                Silent in the woods
              </div>
              <div className="mt-1 text-sm text-neutral-400">
                Lost in darkness
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                Feb 9, 2026 · David Parsons
              </div>
            </div>

            {/* Sidebar List Style */}
            <div className="mt-6 space-y-4">
              <div className="border-t border-neutral-800 pt-4">
                <div className="text-sm font-medium text-white">
                  The seeds we sew
                </div>
                <div className="text-xs text-neutral-500">Jan 26, 2026</div>
              </div>

              <div className="border-t border-neutral-800 pt-4">
                <div className="text-sm font-medium text-white">Letting Go</div>
                <div className="text-xs text-neutral-500">Jan 23, 2026</div>
              </div>

              <div className="border-t border-neutral-800 pt-4">
                <div className="text-sm font-medium text-white">
                  Welcome to paradise
                </div>
                <div className="text-xs text-neutral-500">Jan 20, 2026</div>
              </div>
            </div>

            {/* Email Badge */}
          </div>
        </div>
      </section>

      {/* AUDIO SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* LEFT CONTENT */}
          <div>
            <div className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
              Long-form audio built in
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Publish audio up to 3 hours.
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Record podcasts. Read chapters of your book. Tell stories in your
              own voice. Upload full-length audio directly to your posts and let
              subscribers listen without leaving your page.
            </p>

            <ul className="mt-8 space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-emerald-500" />
                Upload audio up to 3 hours long
              </li>

              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-emerald-500" />
                Perfect for podcasting and long-form storytelling
              </li>

              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-emerald-500" />
                Read your books aloud for your community
              </li>

              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 mt-1 text-emerald-500" />
                Offer subscriber-only audio episodes
              </li>
            </ul>
          </div>

          {/* RIGHT VISUAL CARD */}
          <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200">
                <AudioWaveform className="h-7 w-7 text-gray-800" />
              </div>

              <div className="text-xl font-semibold text-gray-900">
                Built for serious creators
              </div>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">
              This isn’t short clips. This is full-length audio publishing. Your
              voice. Your pace. Your format.
            </p>

            <div className="mt-8 rounded-xl bg-black text-white p-6">
              <div className="text-sm text-white/70">Maximum length</div>
              <div className="mt-1 text-2xl font-bold">3 hours per upload</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 pb-24">
        <Card className="relative overflow-hidden p-10">
          {/* background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black to-neutral-900 sm:rounded-xl" />

          {/* subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="text-sm font-semibold text-white/80">
                The Messy Attic Community
              </div>

              <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Publish freely. Build a paid community.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateWithReferral("/signup-community")}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-lg hover:bg-gray-100 transition"
              >
                Join the community
              </button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

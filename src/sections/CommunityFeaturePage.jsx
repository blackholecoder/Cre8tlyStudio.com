// src/pages/CommunityFeaturePage.jsx
import {
  Users,
  MessageSquare,
  FileText,
  Upload,
  Share2,
  Lock,
  PenTool,
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
              SUBSCRIPTION-FIRST · WRITING-LED · INVITE-ONLY
            </motion.div>

            <motion.h1
              variants={reveal}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
            >
              A subscription-first community built for writers.
            </motion.h1>

            <motion.p
              variants={reveal}
              className="max-w-2xl mx-auto lg:mx-0 text-lg text-white/90"
            >
              Publish posts, invite your audience, and build a focused community
              without follows, feeds, or algorithms.
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
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20">
        <Card className="p-6 sm:p-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              {
                icon: Users,
                title: "Subscribe only, no follows",
                desc: "Members subscribe intentionally. No followers, no feeds, no algorithmic noise.",
              },
              {
                icon: FileText,
                title: "Professional posts",
                desc: "Publish long form posts with a clean editor built for serious writing.",
              },
              {
                icon: Upload,
                title: "Invite by CSV",
                desc: "Upload your email list and invite your existing audience directly.",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                variants={reveal}
                whileHover={{ y: -6 }}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-700">
                    <Icon className="h-5 w-5 text-black" />
                  </div>
                  <div className="font-bold">{title}</div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Card>
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
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-800 leading-tight">
            Everything a modern
            <span className="block">community needs</span>
          </h2>
          <p className="mt-4 text-gray-600">
            The Messy Attic communities are designed for focus, ownership, and
            meaningful discussion without algorithms or social feeds.
          </p>
        </motion.div>

        {/* FEATURE GRID */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              icon: Users,
              title: "Creator profiles",
              color: "text-blue-600",
              desc: "Each creator has a dedicated profile with bio, links, and a clear identity.",
            },
            {
              icon: MessageSquare,
              title: "Comments and discussion",
              color: "text-purple-600",
              desc: "Readers can comment, reply, and take part in thoughtful discussion together.",
            },
            {
              icon: Share2,
              title: "Shareable posts",
              color: "text-emerald-600",
              desc: "Every post includes a shareable link you can use anywhere online.",
            },
            {
              icon: Lock,
              title: "Intentional access",
              color: "text-pink-600",
              desc: "Subscription based access keeps communities focused, respectful, and intentional.",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <motion.div key={title} variants={reveal}>
              <Card className="p-6 hover:-translate-y-1 transition">
                <Icon className={`h-5 w-5 ${color}`} />
                <div className="mt-3 font-bold">{title}</div>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
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
                Build a community around your writing.
              </div>

              <p className="mt-3 text-white/90 max-w-xl">
                Publish posts, invite your audience, and host thoughtful
                discussion without followers or algorithms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateWithReferral("/signup-community")}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-lg hover:bg-gray-100 transition"
              >
                Join the community
              </button>

              <button
                onClick={() => navigateWithReferral("/plans")}
                className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Start free trial
              </button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

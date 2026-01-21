// src/pages/CommunityFeaturePage.jsx
import {
  Users,
  MessageSquare,
  Bell,
  Heart,
  CornerDownRight,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ------------------ helpers ------------------ */

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
    {children}
  </span>
);

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
        <div className="absolute inset-0 bg-royalPurple sm:rounded-xl" />

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
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              <Pill>
                <Users className="h-4 w-4" />
                Community
              </Pill>
              <Pill>
                <Sparkles className="h-4 w-4" />
                Built for engagement
              </Pill>
              <Pill>
                <Bell className="h-4 w-4" />
                Real time interaction
              </Pill>
            </motion.div>

            <motion.h1
              variants={reveal}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
            >
              Build community,
              <span className="block">not just an audience.</span>
            </motion.h1>

            <motion.p
              variants={reveal}
              className="max-w-2xl mx-auto lg:mx-0 text-lg text-white/90"
            >
              Give your users a place to connect, ask questions, share ideas,
              and stay engaged long after they download or buy.
            </motion.p>
          </div>

          {/* RIGHT ICON */}
          <motion.div
            variants={reveal}
            className="flex justify-center lg:justify-end pt-2 sm:pt-0"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />

              <div
                className="
            relative
            flex items-center justify-center
            rounded-full
            bg-white/10
            border border-white/20
            h-28 w-28
            sm:h-36 sm:w-36
            lg:h-64 lg:w-64
          "
              >
                <Users className="h-14 w-14 sm:h-18 sm:w-18 lg:h-32 lg:w-32 text-white" />
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
                icon: MessageSquare,
                title: "Create topics",
                desc: "Organize discussions by topic so conversations stay focused and easy to follow.",
                color: "bg-blue-600",
              },
              {
                icon: PlusCircle,
                title: "Post and reply",
                desc: "Start conversations, reply to posts, and keep discussions moving naturally.",
                color: "bg-purple-600",
              },
              {
                icon: CornerDownRight,
                title: "Replies to replies",
                desc: "Nested replies allow deeper conversations without clutter.",
                color: "bg-emerald-600",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                variants={reveal}
                whileHover={{ y: -6 }}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
                  >
                    <Icon className="h-5 w-5 text-white" />
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
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-700">
            Everything a modern
            <span className="block">community needs.</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Cre8tly Studio communities are designed to feel familiar, intuitive,
            and engaging, just like the social platforms users already love.
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
            { icon: Bell, title: "Notifications", color: "text-blue-600" },
            {
              icon: Heart,
              title: "Likes and reactions",
              color: "text-pink-600",
            },
            {
              icon: MessageSquare,
              title: "Threaded discussions",
              color: "text-purple-600",
            },
            {
              icon: Users,
              title: "Built for growth",
              color: "text-emerald-600",
            },
          ].map(({ icon: Icon, title, color }) => (
            <motion.div key={title} variants={reveal}>
              <Card className="p-6 hover:-translate-y-1 transition">
                <Icon className={`h-5 w-5 ${color}`} />
                <div className="mt-3 font-bold">{title}</div>
                <p className="mt-2 text-sm text-gray-600">
                  Designed to keep users engaged and coming back consistently.
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Card className="relative overflow-hidden p-10">
          {/* background gradient */}
          <div className="absolute inset-0 bg-royalPurple" />

          {/* subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="text-sm font-semibold text-white/80">
                Cre8tly Studio Community
              </div>

              <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Turn users into members.
              </div>

              <p className="mt-3 text-white/90 max-w-xl">
                Communities drive retention, trust, and long term growth. Give
                your audience a place to stay connected.
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

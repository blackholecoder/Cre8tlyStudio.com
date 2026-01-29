// src/pages/AnalyticsFeaturePage.jsx
import { useMemo, useState } from "react";
import {
  BarChart3,
  MousePointerClick,
  Download,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ------------------ helpers ------------------ */

/* motion – slide only */
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

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold tracking-wide text-gray-700">
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

const RangeButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={[
      "px-4 py-2 min-w-[88px] rounded-full text-sm font-semibold border transition select-none whitespace-nowrap",
      active
        ? "bg-green text-gray-700 border-green"
        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100",
    ].join(" ")}
  >
    {children}
  </button>
);

const Stat = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div
    variants={reveal}
    whileHover={{ y: -6 }}
    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition"
  >
    <div className="flex items-center gap-3">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
    {sub && <div className="mt-3 text-sm text-gray-600">{sub}</div>}
  </motion.div>
);

function formatNumber(n) {
  return new Intl.NumberFormat().format(n);
}

/* ------------------ page ------------------ */

export default function AnalyticsFeaturePage() {
  const navigate = useNavigate();

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  const ranges = useMemo(
    () => [
      { key: "7", label: "7 days", mult: 1 },
      { key: "14", label: "14 days", mult: 1.6 },
      { key: "30", label: "30 days", mult: 2.8 },
      { key: "90", label: "90 days", mult: 6.9 },
    ],
    [],
  );

  const [rangeKey, setRangeKey] = useState("30");

  const demo = useMemo(() => {
    const baseClicks = 1800;
    const baseDownloads = 420;
    const r = ranges.find((x) => x.key === rangeKey) || ranges[2];

    const clicks = Math.round(baseClicks * r.mult);
    const downloads = Math.round(baseDownloads * r.mult);
    const conversion = Math.max(
      5,
      Math.min(40, Math.round((downloads / clicks) * 100)),
    );

    return {
      clicks,
      downloads,
      conversion,
      trend: r.key === "7" ? 8 : r.key === "14" ? 14 : r.key === "30" ? 26 : 41,
    };
  }, [rangeKey, ranges]);

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24">
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14 sm:pt-20 sm:pb-20">
        {/* background */}
        <div className="absolute inset-0 bg-green sm:rounded-xl" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative grid gap-10 lg:grid-cols-2 items-center"
        >
          {/* LEFT CONTENT */}
          <div className="flex flex-col gap-5 text-center lg:text-left px-2 sm:px-0">
            <motion.div
              variants={reveal}
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              <Pill>
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Pill>
              <Pill>
                <Sparkles className="h-4 w-4" />
                Digital product tracking
              </Pill>
              <Pill>
                <ShieldCheck className="h-4 w-4" />
                Business ready insights
              </Pill>
            </motion.div>

            <motion.h1
              variants={reveal}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-700"
            >
              Analytics help you
              <span className="block">grow with confidence.</span>
            </motion.h1>

            <motion.p
              variants={reveal}
              className="max-w-2xl mx-auto lg:mx-0 text-lg text-gray-700/80"
            >
              Track views, clicks, and downloads across 7, 14, 30, and 90 day
              windows so you always know what is working and what to improve.
            </motion.p>
          </div>

          {/* RIGHT ICON */}
          <motion.div
            variants={reveal}
            className="flex justify-center lg:justify-end pt-2 sm:pt-0"
          >
            <div className="relative">
              {/* subtle glow */}
              <div className="absolute inset-0 rounded-full bg-black/10 blur-xl" />

              <div
                className="
            relative
            flex items-center justify-center
            rounded-full
            bg-white/60
            border border-black/10
            h-28 w-28
            sm:h-36 sm:w-36
            lg:h-64 lg:w-64
          "
              >
                <BarChart3 className="h-14 w-14 sm:h-18 sm:w-18 lg:h-32 lg:w-32 text-gray-700" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ANALYTICS PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-700">
                  Performance snapshot
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Demo preview using sample data
                </div>
              </div>

              <div className="flex gap-2">
                {ranges.map((r) => (
                  <RangeButton
                    key={r.key}
                    active={rangeKey === r.key}
                    onClick={() => setRangeKey(r.key)}
                  >
                    {r.label}
                  </RangeButton>
                ))}
              </div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-4 md:grid-cols-3"
            >
              <Stat
                icon={MousePointerClick}
                label="Total clicks"
                value={formatNumber(demo.clicks)}
                sub="All landing page interactions"
                color="bg-black"
              />
              <Stat
                icon={Download}
                label="Total downloads"
                value={formatNumber(demo.downloads)}
                sub="Assets delivered to users"
                color="bg-downloadGreen"
              />

              <motion.div
                variants={reveal}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-royalPurple flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500">
                      Conversion rate
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {demo.conversion}%
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Momentum</span>
                    <span>+{demo.trend}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-royalPurple"
                      style={{ width: `${demo.trend}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Card>
      </section>

      {/* VALUE */}
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
            Built for growth,
            <span className="block">not guesswork.</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Analytics turn effort into strategy. When you know what users click
            and download, you can scale what works and fix what does not.
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
          {[Clock, MousePointerClick, Download, TrendingUp].map((Icon, i) => (
            <motion.div key={i} variants={reveal}>
              <Card className="p-6 hover:-translate-y-1 transition">
                <Icon className="h-5 w-5 text-emerald-600" />
                <div className="mt-3 font-bold">
                  {
                    [
                      "Time based insights",
                      "Track real intent",
                      "Clear performance signals",
                      "Scale with confidence",
                    ][i]
                  }
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Make smarter decisions with real performance data.
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Card className="relative p-10">
          {/* solid background */}
          <div className="absolute inset-0 bg-green rounded-xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                The Messy Attic Analytics
              </div>

              <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-700 leading-tight">
                Know more. Convert more.
              </div>

              <p className="mt-3 text-gray-800 max-w-xl">
                Track performance across time, understand user behavior, and
                grow your digital products with clarity.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigateWithReferral("/plans")}
                className="rounded-xl border border-black/40 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-white/10 transition"
              >
                Get started for free
              </button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

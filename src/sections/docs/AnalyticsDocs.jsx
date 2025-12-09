import React from "react";
import {
  BookOpen,
  FileText,
  BarChart2,
  Activity,
  MousePointerClick,
  Download,
  DollarSign,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function LandingAnalyticsDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "overview", label: "What Analytics Track" },
    { id: "ranges", label: "7, 14, 30, 90 Day Filters" },
    { id: "unique", label: "Unique Visitors Explained" },
    { id: "exclusions", label: "Which Views Do NOT Count" },
    { id: "metrics", label: "Understanding Each Metric" },
    { id: "charts", label: "Graph & Data Visualization" },
    { id: "faq", label: "Troubleshooting" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 text-white relative">
      {/* SIDEBAR */}
      <aside className="hidden lg:block w-64 fixed left-[180px] top-[120px] z-20">
        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-green" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Analytics Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Learn how Cre8tly tracks views, clicks, downloads, and sales across
            your landing pages.
          </p>

          <ul className="space-y-1 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollTo(s.id)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white text-gray-300 text-xs transition"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto bg-black/70 rounded-2xl shadow-lg p-8">
        <main className="pb-16">
          {/* HEADER */}
          <header className="mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  Landing Page Analytics
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Track unique visitors, clicks, downloads, and sales over time.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated Learning Time, under 2 minutes
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-green" />
                Best For, creators optimizing page performance
              </span>
            </div>
          </header>

          {/* INTRO */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              The Analytics dashboard gives you a clear picture of how your
              landing page is performing. You can see how many people visit, how
              many click your CTA, how many download your lead magnet, and how
              many complete a purchase.
            </p>
            <p className="text-sm text-gray-300">
              This makes it easy to test designs, measure improvements, and
              understand how your audience moves through your funnel.
            </p>
          </section>

          {/* OVERVIEW */}
          <section id="overview" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. What Analytics Track
            </h2>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>
                <span className="font-semibold">Unique Visitors</span>, people
                who viewed your landing page
              </li>
              <li>
                <span className="font-semibold">Clicks</span>, taps or clicks on
                your main CTA or Stripe button
              </li>
              <li>
                <span className="font-semibold">Downloads</span>, how many times
                your PDF was downloaded
              </li>
              <li>
                <span className="font-semibold">Sales</span>, purchases
                completed through Stripe Checkout
              </li>
            </ul>
          </section>

          {/* RANGE FILTERS */}
          <section id="ranges" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. 7, 14, 30, and 90-Day Filters
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              You can switch between different time periods to see how your page
              performs over short or long ranges:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>
                <span className="font-semibold">7 days</span>, perfect for new
                pages and quick tests
              </li>
              <li>
                <span className="font-semibold">14 days</span>, wider snapshot
                of engagement
              </li>
              <li>
                <span className="font-semibold">30 days</span>, a full month of
                performance
              </li>
              <li>
                <span className="font-semibold">90 days</span>, long-term
                behavior and trends
              </li>
            </ul>
          </section>

          {/* UNIQUE VISITORS */}
          <section id="unique" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. How Unique Visitors Are Counted
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Cre8tly tracks{" "}
              <span className="font-semibold">unique visitors</span> by counting
              each device or browser session only once per day. This means:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>
                If the same person visits your page multiple times in one day,
                it counts as 1 view
              </li>
              <li>
                If they return the next day, it counts as another unique view
              </li>
              <li>
                This prevents inflated numbers and gives clean, accurate data
              </li>
            </ul>
          </section>

          {/* EXCLUSIONS */}
          <section id="exclusions" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              5. Views That Are NOT Counted
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              To keep your analytics accurate, Cre8tly automatically excludes
              your own visits when you click{" "}
              <span className="font-semibold">“Visit Live URL”</span> inside the
              Landing Page Builder.
            </p>

            <p className="text-sm text-gray-300 mb-2">This means:</p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>
                <span className="font-semibold">
                  Your own views do not count
                </span>
              </li>
              <li>
                <span className="font-semibold">
                  Your own CTA clicks do not count
                </span>
              </li>
              <li>
                <span className="font-semibold">
                  Your own downloads do not count
                </span>
              </li>
            </ul>

            <p className="text-sm text-gray-300 mt-3">
              Only real visitors—actual potential customers—are included.
            </p>
          </section>

          {/* METRICS */}
          <section id="metrics" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              6. Understanding Each Metric
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-gray-400" />
                  Unique Views
                </h3>
                <p className="text-sm text-gray-300">
                  How many individual people saw your landing page during the
                  selected time range.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-1">
                  <MousePointerClick className="w-4 h-4 text-gray-400" />
                  Clicks
                </h3>
                <p className="text-sm text-gray-300">
                  Tracks clicks on your CTA button or Stripe Checkout button.
                  This shows how many visitors engaged with your offer.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-1">
                  <Download className="w-4 h-4 text-gray-400" />
                  Downloads
                </h3>
                <p className="text-sm text-gray-300">
                  Counts how many times your lead magnet or PDF was downloaded
                  from your page.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  Sales
                </h3>
                <p className="text-sm text-gray-300">
                  How many purchases were completed through Stripe Checkout.
                </p>
              </div>
            </div>
          </section>

          {/* CHART */}
          <section id="charts" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              7. Charts & Visual Data
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              The bar chart shows a daily breakdown of Views, Clicks, and
              Downloads across the selected date range. Missing days are
              automatically filled so the graph always displays a complete
              timeline.
            </p>

            <p className="text-sm text-gray-300">
              Hover over any bar to see the exact numbers for that day.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              8. Troubleshooting{" "}
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My analytics show zero views
                </h3>
                <p className="text-sm text-gray-300">
                  Remember that your own visits are not counted. Have someone
                  else visit your page or share your link publicly to start
                  generating real data.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  The chart has gaps or missing days
                </h3>
                <p className="text-sm text-gray-300">
                  This is normal. Days with no activity are shown as zero so
                  your timeline stays accurate.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My downloads increased but my sales didn’t
                </h3>
                <p className="text-sm text-gray-300">
                  High downloads but low sales often mean your CTA or offer
                  needs clarification or a stronger headline.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

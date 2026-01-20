import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { ResponsiveBar } from "@nivo/bar";
import { useAuth } from "../../admin/AuthContext";
import { BarChart2 } from "lucide-react";

export default function LandingAnalytics() {
  const { user } = useAuth();
  const [landingPageId, setLandingPageId] = useState(null);
  const [range, setRange] = useState("7");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch the user’s landing page ID automatically
  useEffect(() => {
    async function fetchLandingId() {
      const res = await axiosInstance.get(
        `https://cre8tlystudio.com/api/landing-analytics/id/by-user/${user.id}`
      );
      setLandingPageId(res.data.id);
    }
    if (user?.id) fetchLandingId();
  }, [user?.id]);

  // 🔹 Fetch analytics once we have the landing page ID
  useEffect(() => {
    if (landingPageId) fetchAnalytics(range);
  }, [range, landingPageId]);

  async function fetchAnalytics(selectedRange) {
    if (!landingPageId) return;
    setLoading(true);
    try {
      console.log(
        "🚀 Fetching analytics for:",
        landingPageId,
        "range:",
        selectedRange
      );

      const res = await axiosInstance.get(
        `https://cre8tlystudio.com/api/landing-analytics/summary/${landingPageId}?days=${selectedRange}`
      );

      if (res.data && res.data.success) {
        setData({
          views: res.data.views || [],
          clicks: res.data.clicks || [],
          downloads: res.data.downloads || [],
        });
      } else {
        console.warn("⚠️ Unexpected response shape:", res.data);
        setData({ views: [], clicks: [], downloads: [] });
      }
    } catch (err) {
      console.error("❌ Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  }

  const metrics = [
    { key: "views", color: "#1f2937", label: "Views" },
    { key: "clicks", color: "#7bed9f", label: "Clicks" },
    { key: "downloads", color: "#670fe7", label: "Downloads" },
  ];

  const chartData = (() => {
    if (!data) return [];

    const numDays = parseInt(range, 10) || 7;
    const today = new Date();

    // 🧠 Build continuous date range (fills missing days)
    const dateRange = Array.from({ length: numDays }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (numDays - 1 - i));
      return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    });

    const findTotal = (arr, date) =>
      arr?.find((x) => x.date.slice(0, 10) === date)?.total || 0;

    return dateRange.map((d) => ({
      date: (() => {
        const raw = typeof d === "string" ? d : new Date(d).toISOString();
        const parts = raw.split("T")[0].split("-");
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        const day = Number(parts[2]);
        return new Date(y, m, day).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      })(),
      Views: findTotal(data.views, d),
      Clicks: findTotal(data.clicks, d),
      Downloads: findTotal(data.downloads, d),
    }));
  })();

  return (
    <div
      className="w-full min-h-screen px-4 py-8 pt-24
      text-dashboard-text-light
      dark:text-dashboard-text-dark
      bg-dashboard-bg-light
      dark:bg-dashboard-bg-dark"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1
              className="text-xl font-semibold normal-case
            text-dashboard-text-light
            dark:text-dashboard-text-dark"
            >
              Views
            </h1>
            <BarChart2
              size={22}
              className="mt-[1px] sm:mt-0
            text-dashboard-text-light
            dark:text-dashboard-text-dark"
            />
          </div>
          <div className="flex gap-2">
            {["7", "14", "30", "90"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  range === r
                    ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-dashboard-text-light dark:text-dashboard-text-dark"
                    : "bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark text-dashboard-muted-light dark:text-dashboard-muted-dark border border-dashboard-border-light dark:border-dashboard-border-dark"
                }`}
              >
                {r} days
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        {data && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 mb-6">
            {metrics.map((m) => (
              <div
                key={m.key}
                className="flex flex-col items-center justify-center rounded-xl p-3 sm:p-4 shadow-md
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light
              dark:border-dashboard-border-dark"
              >
                <p
                  className="text-sm
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark"
                >
                  {m.label}
                </p>
                <p
                  className={`text-2xl font-semibold ${
                    m.key === "views"
                      ? "text-dashboard-metric-light dark:text-dashboard-metric-dark dark:drop-shadow-[0_0_10px_rgba(229,240,255,0.35)]"
                      : ""
                  }`}
                  style={m.key !== "views" ? { color: m.color } : undefined}
                >
                  {data[m.key]?.reduce((acc, v) => acc + v.total, 0) || 0}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Total Views */}
        {data && (
          <div
            className="rounded-2xl py-8 text-center mb-6
          bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark"
          >
            <p
              className="text-sm uppercase tracking-wide mb-1
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark"
            >
              Total Views
            </p>
            <h2
              className="text-5xl font-bold mb-1
              text-dashboard-metric-light
              dark:text-dashboard-metric-dark"
            >
              {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                data.views?.reduce((acc, v) => acc + v.total, 0) || 0
              )}
            </h2>

            {/* Show date range (start to end) */}
            {chartData.length > 0 && (
              <p
                className="text-sm mt-1
              text-dashboard-muted-light
              dark:text-dashboard-muted-dark"
              >
                {new Date(chartData[0].date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                –{" "}
                {new Date(
                  chartData[chartData.length - 1].date
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        )}

        {/* Chart */}
        <div
          className="rounded-2xl p-4 h-[400px] shadow-inner mb-8
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light
        dark:border-dashboard-border-dark"
        >
          {loading ? (
            <p
              className="text-center mt-20
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark"
            >
              Loading analytics...
            </p>
          ) : data ? (
            <ResponsiveBar
              data={chartData}
              keys={["Views", "Clicks", "Downloads"]}
              colors={
                ({ id }) =>
                  id === "Views"
                    ? "#1f2937"
                    : id === "Clicks"
                      ? "#7bed9f"
                      : "#670fe7" // pink
              }
              indexBy="date"
              margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
              padding={0.25}
              borderRadius={[4, 4, 0, 0]}
              axisTop={null}
              axisRight={null}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                format: (v) => (v >= 1000 ? `${v / 1000}K` : v),
                legend: "",
              }}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: "",
                tickValues: [
                  chartData[0]?.date,
                  chartData[chartData.length - 1]?.date,
                ],
                format: (d) =>
                  new Date(d).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }),
              }}
              enableLabel={false}
              enableGridX={false}
              gridYValues={5}
              theme={{
                textColor: "#9ca3af",
                grid: { line: { stroke: "#1f1f1f", strokeWidth: 1 } },
                axis: {
                  ticks: { text: { fill: "#9ca3af", fontSize: 12 } },
                },
                tooltip: {
                  container: {
                    background: "#111",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #333",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    padding: "8px 10px",
                    fontSize: 12,
                  },
                },
              }}
              tooltip={({ id, value, indexValue, color }) => (
                <div
                  className="px-3 py-2 rounded-lg
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark"
                >
                  <p className="text-sm font-medium" style={{ color }}>
                    {id}: {value}
                  </p>
                  <p
                    className="text-xs
                  text-dashboard-muted-light
                  dark:text-dashboard-muted-dark"
                  >
                    {indexValue}
                  </p>
                </div>
              )}
              groupMode="grouped"
            />
          ) : (
            <p
              className="text-center
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark"
            >
              No analytics data yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

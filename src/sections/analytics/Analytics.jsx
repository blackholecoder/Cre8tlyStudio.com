import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { ResponsiveBar } from "@nivo/bar";
import { useAuth } from "../../admin/AuthContext";
import { BarChart2 } from "lucide-react";

export default function LandingAnalytics() {
  const { user } = useAuth();
  const [landingPageId, setLandingPageId] = useState(null);
  const [range, setRange] = useState("week");
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

      console.log("📬 API response:", res.data);

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
    { key: "views", color: "#ffffff", label: "Views" },
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
    <div className="w-full min-h-screen text-white px-4 py-8 pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl font-semibold normal-case">Views</h1>
            <BarChart2 size={22} className="text-white mt-[1px] sm:mt-0" />
          </div>
          <div className="flex gap-2">
            {["7", "14", "30", "90"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  range === r
                    ? "bg-gray-700 text-white"
                    : "bg-[#111111] text-gray-400 border border-[#2A2F3A]"
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
                className="flex flex-col items-center justify-center bg-[#0a0a0a] rounded-xl p-3 sm:p-4 shadow-md border border-[#2A2F3A]"
              >
                <p className="text-sm text-gray-400">{m.label}</p>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: m.color }}
                >
                  {data[m.key]?.reduce((acc, v) => acc + v.total, 0) || 0}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Total Views */}
        {data && (
          <div className="bg-[#0a0a0a] rounded-2xl py-8 text-center mb-6 border border-[#2A2F3A]">
            <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">
              Total Views
            </p>
            <h2 className="text-5xl font-bold mb-1">
              {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                data.views?.reduce((acc, v) => acc + v.total, 0) || 0
              )}
            </h2>

            {/* Show date range (start to end) */}
            {chartData.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
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
        <div className="bg-[#0a0a0a] rounded-2xl border border-[#2A2F3A] p-4 h-[400px] shadow-inner mb-8">
          {loading ? (
            <p className="text-center text-gray-500 mt-20">
              Loading analytics...
            </p>
          ) : data ? (
            <ResponsiveBar
              data={chartData}
              keys={["Views", "Clicks", "Downloads"]}
              colors={
                ({ id }) =>
                  id === "Views"
                    ? "#ffffff" // bright green
                    : id === "Clicks"
                      ? "#7bed9f" // mint green
                      : "#670fe7" // pink
              }
              indexBy="date"
              margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
              padding={0.25}
              borderRadius={4}
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
                <div className="px-3 py-2 bg-[#111] border border-gray-700 rounded-lg">
                  <p className="text-sm font-medium" style={{ color }}>
                    {id}: {value}
                  </p>
                  <p className="text-xs text-gray-400">{indexValue}</p>
                </div>
              )}
              groupMode="grouped"
            />
          ) : (
            <p className="text-center text-gray-500">No analytics data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { Mail, Calendar, FileText } from "lucide-react";
import Papa from "papaparse";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLanding, setSelectedLanding] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `https://cre8tlystudio.com/api/landing/leads?page=${page}&limit=${limit}`
        );
        setLeads(res.data.leads || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error("❌ Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [page]);

  // ✅ Get unique landing pages for filter dropdown
  const landingOptions = [
    ...new Map(leads.map((l) => [l.landing_page_id, l.landing_title])).entries(),
  ].map(([id, title]) => ({ id, title }));

  // ✅ Filter by email search and selected landing
  const filtered = leads.filter((l) => {
    const matchesEmail = l.email.toLowerCase().includes(search.toLowerCase());
    const matchesLanding =
      selectedLanding === "all" || l.landing_page_id === selectedLanding;
    return matchesEmail && matchesLanding;
  });

  const totalPages = Math.ceil(total / limit);

  const downloadCSV = () => {
  if (!leads.length) {
    alert("No leads available to download");
    return;
  }

  const csvData = leads.map((lead) => ({
    Email: lead.email,
    "Created At": new Date(lead.created_at).toLocaleString(),
    "Landing Title": lead.landing_title,
    "PDF Title": lead.title || "Untitled PDF",
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leads_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 text-white">
      <div className="max-w-5xl mx-auto bg-black/70 rounded-2xl shadow-lg p-8">
      
        <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-silver flex items-center gap-3">
    <Mail className="text-green" /> Leads
  </h1>
  <button
    onClick={downloadCSV}
    className="bg-green text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-lime-400 transition"
  >
    Download CSV
  </button>
</div>

        {/* 🔍 Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0F172A] text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green outline-none"
          />

          <select
            value={selectedLanding}
            onChange={(e) => setSelectedLanding(e.target.value)}
            className="bg-[#0F172A] text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green outline-none"
          >
            <option value="all">All PDFs</option>
            {landingOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.title || "Untitled Landing"}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading leads...</p>
        ) : filtered.length ? (
          <>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {filtered.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1E293B]/70 border border-gray-700 rounded-xl p-4 hover:border-green transition-all duration-300"
                >
                  <div>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Mail size={16} className="text-green" /> {lead.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <Calendar size={14} />{" "}
                      {new Date(lead.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right mt-3 sm:mt-0">
                    <p className="text-sm text-silver font-semibold flex items-center justify-end gap-2">
                      <FileText size={14} />{" "}
                      {lead.title || lead.landing_title || "Untitled PDF"}
                    </p>
                    {lead.pdf_url && (
                      <a
                        href={lead.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green underline text-xs mt-1 block"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-400">
                Page {page} of {totalPages || 1}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic text-center">No leads found.</p>
        )}
      </div>
    </div>
  );
}

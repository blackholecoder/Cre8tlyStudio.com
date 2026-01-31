import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import { Mail, Calendar, FileText } from "lucide-react";
import Papa from "papaparse";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLanding, setSelectedLanding] = useState("all");
  const [landingOpen, setLandingOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `https://themessyattic.com/api/landing/leads?page=${page}&limit=${limit}`,
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

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLandingOpen(false);
      }
    }

    if (landingOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [landingOpen]);

  // ✅ Get unique landing pages for filter dropdown
  const pdfOptions = [
    ...new Map(leads.map((l) => [l.title, l.title])).entries(),
  ].map(([title]) => ({ title }));

  // ✅ Filter by email search and selected landing
  const filtered = leads.filter((l) => {
    const matchesEmail = l.email.toLowerCase().includes(search.toLowerCase());
    const matchesLanding =
      selectedLanding === "all" || l.title === selectedLanding;

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
    <div
      className="min-h-screen p-10
      bg-dashboard-bg-light
      dark:bg-dashboard-bg-dark
      text-dashboard-text-light
      dark:text-dashboard-text-dark"
    >
      <div
        className="max-w-5xl mx-auto rounded-2xl shadow-lg p-8
      bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark"
      >
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-3xl font-bold flex items-center gap-3 normal-case
          text-dashboard-text-light
          dark:text-dashboard-text-dark"
          >
            Leads <Mail className="text-green" />
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
          <div ref={dropdownRef} className="relative w-full sm:w-64">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setLandingOpen((v) => !v)}
              className="
      w-full flex items-center justify-between
      rounded-lg px-4 py-2 text-sm transition
      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
      text-dashboard-text-light dark:text-dashboard-text-dark
      border border-dashboard-border-light dark:border-dashboard-border-dark
      hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
    "
            >
              <span className="truncate">
                {selectedLanding === "all"
                  ? "All PDFs"
                  : selectedLanding || "Untitled PDF"}
              </span>

              <span
                className={`transition-transform ${
                  landingOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>

            {/* Dropdown */}
            {landingOpen && (
              <div
                className="
        absolute z-30 mt-2 w-full
        rounded-lg shadow-lg
        max-h-64 overflow-y-auto
        bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
        border border-dashboard-border-light dark:border-dashboard-border-dark
      "
              >
                {/* All option */}
                <div
                  onClick={() => {
                    setSelectedLanding("all");
                    setLandingOpen(false);
                  }}
                  className="
          px-4 py-2 cursor-pointer text-sm transition
          text-dashboard-text-light dark:text-dashboard-text-dark
          hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark
        "
                >
                  All PDFs
                </div>

                {pdfOptions.map((opt, i) => {
                  const active = selectedLanding === opt.title;

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedLanding(opt.title);
                        setLandingOpen(false);
                      }}
                      className={`
              px-4 py-2 cursor-pointer text-sm transition
              ${
                active
                  ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark font-semibold"
                  : "hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
              }
              text-dashboard-text-light dark:text-dashboard-text-dark
            `}
                    >
                      {opt.title || "Untitled PDF"}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p
            className="text-dashboard-muted-light
          dark:text-dashboard-muted-dark"
          >
            Loading leads...
          </p>
        ) : filtered.length ? (
          <>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {filtered.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-4 transition-all duration-300
                bg-dashboard-hover-light
                dark:bg-dashboard-hover-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                hover:border-green"
                >
                  <div>
                    <p
                      className="font-medium flex items-center gap-2
                    text-dashboard-text-light
                    dark:text-dashboard-text-dark"
                    >
                      <Mail size={16} className="text-green" /> {lead.email}
                    </p>
                    <p
                      className="text-xs mt-1 flex items-center gap-2
                    text-dashboard-muted-light
                    dark:text-dashboard-muted-dark"
                    >
                      <Calendar size={14} />{" "}
                      {new Date(lead.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right mt-3 sm:mt-0">
                    <p
                      className="text-sm font-semibold flex items-center justify-end gap-2
                    text-dashboard-text-light
                    dark:text-dashboard-text-dark"
                    >
                      <FileText size={14} />{" "}
                      {lead.title || lead.landing_title || "Untitled PDF"}
                    </p>
                    {lead.pdf_url && (
                      <a
                        href={
                          lead.pdf_url.startsWith("http")
                            ? lead.pdf_url
                            : `https://${lead.pdf_url}`
                        }
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
                className="px-3 py-1 rounded disabled:opacity-50
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              text-dashboard-text-light
              dark:text-dashboard-text-dark"
              >
                Prev
              </button>
              <span
                className="text-dashboard-muted-light
              dark:text-dashboard-muted-dark"
              >
                Page {page} of {totalPages || 1}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 rounded disabled:opacity-50
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              text-dashboard-text-light
              dark:text-dashboard-text-dark"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p
            className="italic text-center
          text-dashboard-muted-light
          dark:text-dashboard-muted-dark"
          >
            No leads found.
          </p>
        )}
      </div>
    </div>
  );
}

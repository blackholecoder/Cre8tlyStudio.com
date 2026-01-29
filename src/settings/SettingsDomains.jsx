import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function SettingsDomains() {
  const [domains, setDomains] = useState([]);
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(null);
  const navigate = useNavigate();

  // Fetch domains
  const fetchDomains = async () => {
    try {
      const res = await axiosInstance.get("/domains");
      setDomains(res.data.domains || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load domains");
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // Add domain
  const handleAddDomain = async () => {
    if (!domainInput.trim()) {
      toast.warning("Enter a domain name");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/domains/add", {
        domain: domainInput.trim().toLowerCase(),
      });

      toast.success("Domain added. Please verify ownership.");
      setDomainInput("");
      fetchDomains();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add domain");
    } finally {
      setLoading(false);
    }
  };

  // Verify domain
  const handleVerifyDomain = async (domain) => {
    setVerifyingDomain(domain);
    try {
      const res = await axiosInstance.post("/domains/verify", { domain });

      if (res.data.verified) {
        toast.success("Domain verified successfully!");
        fetchDomains();
      } else {
        toast.info("Verification not found yet. Try again shortly.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    } finally {
      setVerifyingDomain(null);
    }
  };

  // Remove domain
  const handleRemoveDomain = async (domain) => {
    if (!window.confirm("Remove this domain?")) return;

    try {
      await axiosInstance.delete(`/domains/remove/${domain}`);
      toast.info("Domain removed");
      fetchDomains();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove domain");
    }
  };

  // Set primary
  const handleSetPrimary = async (domain) => {
    try {
      await axiosInstance.post("/domains/set-primary", { domain });
      toast.success("Primary domain updated");
      fetchDomains();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set primary domain");
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#030712] text-white">
      <div className="w-full max-w-[900px] p-6">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/settings")}
            className="mb-4 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 hover:text-white transition"
          >
            ← Back to Settings
          </button>
          <h1 className="text-3xl font-bold mb-2">Custom Domains</h1>
          <p className="text-sm text-gray-400 max-w-xl">
            Connect your own domain to host landing pages under your brand.
            Domain ownership verification is required.
          </p>
        </div>

        {/* Add Domain */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-1">Add New Domain</h2>
          <p className="text-sm text-gray-400 mb-4">
            Enter a root domain you own, for example yourdomain.com
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="yourdomain.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green outline-none"
            />

            <button
              onClick={handleAddDomain}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-royalPurple text-white font-semibold hover:opacity-90 disabled:opacity-60 transition"
            >
              {loading ? "Adding..." : "Add Domain"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Subdomains like www will be handled automatically.
          </p>
        </div>

        {/* Domains List */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 shadow-lg mt-10">
          <h2 className="text-lg font-semibold mb-4">Your Domains</h2>

          {domains.length === 0 ? (
            <p className="text-sm text-gray-400">No domains connected yet.</p>
          ) : (
            <div className="space-y-4">
              {domains.map((d) => (
                <div
                  key={d.domain}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-900/60"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {d.domain}
                        </span>

                        {d.verified && (
                          <span className="text-xs px-2 py-1 rounded-md bg-green/10 text-green font-semibold">
                            Verified
                          </span>
                        )}

                        {d.is_primary && (
                          <span className="text-xs px-2 py-1 rounded-md bg-blue/10 text-blue font-semibold">
                            Primary
                          </span>
                        )}
                      </div>

                      {!d.verified && (
                        <p className="text-xs text-amber-400 mt-2">
                          Add this TXT record to your DNS to verify ownership
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!d.verified && (
                        <button
                          onClick={() => handleVerifyDomain(d.domain)}
                          disabled={verifyingDomain === d.domain}
                          className="px-4 py-1.5 text-sm rounded-md bg-amber-500 text-black font-semibold hover:opacity-90"
                        >
                          {verifyingDomain === d.domain
                            ? "Verifying..."
                            : "Verify"}
                        </button>
                      )}

                      {d.verified && !d.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(d.domain)}
                          className="px-4 py-1.5 text-sm rounded-md bg-gray-800 text-gray-300 hover:border-green border border-gray-700"
                        >
                          Set Primary
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveDomain(d.domain)}
                        className="px-4 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {!d.verified && (
                    <div className="mt-4 bg-black/60 border border-gray-700 rounded-lg p-3 text-xs font-mono text-gray-200">
                      <div>Type: TXT</div>
                      <div>Host: @</div>
                      <div className="break-all">
                        Value: cre8tly-domain-verification=
                        {d.verification_token}
                      </div>
                    </div>
                  )}
                  {d.verified && !d.is_primary && (
                    <div className="mt-4 bg-[#0B1220] border border-gray-700 rounded-lg p-4">
                      <p className="text-sm font-semibold text-white mb-2">
                        Step 2: Point your domain to Cre8tly
                      </p>

                      <p className="text-xs text-gray-400 mb-3">
                        Add ONE of the following DNS records with your domain
                        provider
                      </p>

                      {/* Option A */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-green mb-1">
                          Option A (recommended)
                        </p>

                        <div className="bg-black/60 rounded-md p-3 text-xs font-mono text-gray-200 space-y-1">
                          <div>Type: CNAME</div>
                          <div>Host: @</div>
                          <div>Value: domains.themessyattic.com</div>
                          <div>Proxy: ON (orange cloud)</div>
                        </div>
                      </div>

                      {/* Option B */}
                      <div>
                        <p className="text-xs font-semibold text-blue mb-1">
                          Option B (if @ is not allowed)
                        </p>

                        <div className="bg-black/60 rounded-md p-3 text-xs font-mono text-gray-200 space-y-1">
                          <div>Type: CNAME</div>
                          <div>Host: www</div>
                          <div>Value: domains.themessyattic.com</div>
                          <div>Proxy: ON (orange cloud)</div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        DNS changes may take a few minutes to propagate
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal */}
        <div className="bg-black/40 border border-gray-700 rounded-xl p-5 mt-10">
          <p className="text-xs text-gray-400 leading-relaxed">
            By connecting a domain, you confirm that you own or control this
            domain and have permission to use it. The Messy Attic reserves the
            right to suspend or remove domains used for impersonation, abuse,
            copyright infringement, or unlawful activity.
          </p>
        </div>
      </div>
    </div>
  );
}

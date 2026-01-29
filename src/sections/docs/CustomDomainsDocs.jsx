import React from "react";
import {
  BookOpen,
  Globe,
  ShieldCheck,
  Link,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function CustomDomainsDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "overview", label: "What Custom Domains Do" },
    { id: "add", label: "Adding a Domain" },
    { id: "verify", label: "Verifying Ownership" },
    { id: "point", label: "Pointing Your Domain" },
    { id: "primary", label: "Primary Domains" },
    { id: "propagation", label: "DNS Propagation" },
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
              Custom Domains Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Learn how to connect and verify your own domain with The Messy
            Attic.
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
              <Globe className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  Custom Domains
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Host your landing pages on your own branded domain.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated Learning Time, under 2 minutes
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-green" />
                Best For, creators building branded funnels
              </span>
            </div>
          </header>

          {/* INTRO */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              Custom Domains allow you to publish your Cre8tly landing pages
              under your own domain instead of a Cre8tly subdomain.
            </p>
            <p className="text-sm text-gray-300">
              This builds trust, improves conversions, and gives your brand full
              control over how your pages appear to visitors.
            </p>
          </section>

          {/* OVERVIEW */}
          <section id="overview" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. What Custom Domains Do
            </h2>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Host landing pages on your own domain</li>
              <li>Remove Cre8tly branding from page URLs</li>
              <li>Improve trust and professionalism</li>
              <li>Enable consistent branding across funnels</li>
            </ul>
          </section>

          {/* ADD DOMAIN */}
          <section id="add" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. Adding a Domain
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              To add a domain, navigate to{" "}
              <span className="font-semibold">Settings → Domains</span> and
              enter the root domain you own.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Enter only the root domain, example, yourdomain.com</li>
              <li>Do not include https or paths</li>
              <li>Subdomains like www are handled automatically</li>
            </ul>
          </section>

          {/* VERIFY */}
          <section id="verify" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              4. Verifying Domain Ownership
              <ShieldCheck className="w-4 h-4 text-gray-400" />
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              After adding a domain, Cre8tly generates a verification token.
              This ensures you actually own or control the domain.
            </p>

            <p className="text-sm text-gray-300 mb-2">
              You must add a TXT record to your DNS provider:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Type, TXT</li>
              <li>Host, @</li>
              <li>Value, cre8tly-domain-verification=your-token</li>
            </ul>
          </section>

          {/* POINT DOMAIN */}
          <section id="point" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              5. Pointing Your Domain
              <Link className="w-4 h-4 text-gray-400" />
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Once verified, you must point your domain to Cre8tly using a CNAME
              record.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Type, CNAME</li>
              <li>Host, @ or www</li>
              <li>Value, domains.themessyattic.com</li>
              <li>Proxy must be ON if using Cloudflare</li>
            </ul>
          </section>

          {/* PRIMARY */}
          <section id="primary" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              6. Primary Domains
            </h2>

            <p className="text-sm text-gray-300">
              If you connect multiple domains, you can set one as your primary
              domain. This is the default domain used when publishing landing
              pages.
            </p>
          </section>

          {/* PROPAGATION */}
          <section id="propagation" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              7. DNS Propagation
              <AlertTriangle className="w-4 h-4 text-gray-400" />
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              DNS changes are not instant. Depending on your provider, it may
              take a few minutes up to 24 hours for changes to fully propagate.
            </p>

            <p className="text-sm text-gray-300">
              If verification fails immediately, wait a few minutes and try
              again.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              8. Troubleshooting
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My domain will not verify
                </h3>
                <p className="text-sm text-gray-300">
                  Double-check that the TXT record is added correctly and wait
                  for DNS propagation before retrying verification.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My domain points correctly but pages do not load
                </h3>
                <p className="text-sm text-gray-300">
                  Ensure your CNAME record points to domains.themessyattic.com
                  and that proxy mode is enabled if using Cloudflare.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  Can I remove a domain later
                </h3>
                <p className="text-sm text-gray-300">
                  Yes. Domains can be removed at any time from Settings. Any
                  pages using that domain will stop resolving.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

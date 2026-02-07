import React, { useState } from "react";
import { Search, ShieldQuestionMark } from "lucide-react";
import { Link } from "react-router-dom";

export default function DocsIndexPage() {
  const [query, setQuery] = useState("");

  const docs = [
    {
      id: "settings-page",
      title: "Settings Page",
      description:
        "Manage your profile, avatar, Two-Factor Authentication, Passkeys, Stripe payouts, brand identity file, and your default CTA message.",
      path: "/docs/settings",
    },
    {
      id: "landing-builder",
      title: "Landing Page Builder",
      description:
        "Create landing pages using blocks, templates, Stripe checkout, and custom branding.",
      path: "/docs/landing-page-builder",
    },
    {
      id: "seller-dashboard",
      title: "Seller Dashboard",
      description:
        "Track sales, payouts, customers, and AI emails with your Stripe-connected dashboard.",
      path: "/docs/seller-dashboard",
    },
    {
      id: "analytics",
      title: "Analytics",
      description:
        "Track views, clicks, analytics, sales, and sales across your entire system.",
      path: "/docs/analytics-docs",
    },
    {
      id: "custom-domains",
      title: "Custom Domains",
      description:
        "Connect your own domain to The Messy Attic, verify ownership, and host landing pages under your brand.",
      path: "/docs/custom-domain",
    },
    {
      id: "authors-assistant",
      title: "Author’s Assistant",
      description:
        "Write, revise, finalize, and publish full-length books using a structured, section-based workflow built for serious authors.",
      path: "/docs/authors-assistant",
    },
  ];

  const filteredDocs = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="
      w-full max-w-4xl mx-auto
      py-10 px-6
      text-dashboard-text-light
      dark:text-dashboard-text-dark
    "
    >
      <header className="mb-10">
        <h1
          className="
          text-3xl font-bold flex items-center gap-3 mb-2 normal-case
          text-dashboard-text-light
          dark:text-dashboard-text-dark
        "
        >
          <ShieldQuestionMark className="w-8 h-8 text-green" />
          Documentation
        </h1>

        <p
          className="
          text-sm
          text-dashboard-muted-light
          dark:text-dashboard-muted-dark
        "
        >
          Search or browse through all Cre8tly Studio help guides, tutorials,
          and feature overviews.
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-8">
        <Search
          className="
          absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5
          text-dashboard-muted-light
          dark:text-dashboard-muted-dark
        "
        />

        <input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: "50px" }}
          className="
          w-full
          px-4 py-3 pl-14
          rounded-xl
          bg-dashboard-bg-light
          dark:bg-dashboard-bg-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark
          text-dashboard-text-light
          dark:text-dashboard-text-dark
          placeholder-dashboard-muted-light
          dark:placeholder-dashboard-muted-dark
          focus:outline-none
          focus:ring-2 focus:ring-green
        "
        />
      </div>

      {/* Docs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => (
          <Link
            to={doc.path}
            key={doc.id}
            className="
            block p-5 rounded-xl transition shadow
            bg-dashboard-sidebar-light
            dark:bg-dashboard-sidebar-dark
            border border-dashboard-border-light
            dark:border-dashboard-border-dark
            hover:border-dashboard-muted-light
            dark:hover:border-dashboard-muted-dark
          "
          >
            <h2
              className="
              text-lg font-semibold mb-2
              text-dashboard-text-light
              dark:text-dashboard-text-dark
            "
            >
              {doc.title}
            </h2>

            <p
              className="
              text-sm leading-relaxed
              text-dashboard-muted-light
              dark:text-dashboard-muted-dark
            "
            >
              {doc.description}
            </p>
          </Link>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <p
          className="
          text-center text-sm mt-10 italic
          text-dashboard-muted-light
          dark:text-dashboard-muted-dark
        "
        >
          No documents found for your search.
        </p>
      )}
    </div>
  );
}

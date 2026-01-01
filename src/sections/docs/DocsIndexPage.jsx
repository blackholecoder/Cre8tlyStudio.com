import React, { useState } from "react";
import { Search, ShieldQuestionMark } from "lucide-react";
import { Link } from "react-router-dom";

export default function DocsIndexPage() {
  const [query, setQuery] = useState("");

  const docs = [
    {
      id: "lead-magnets",
      title: "How to Create a Lead Magnet",
      description:
        "Learn how to generate, design, and publish a complete lead magnet using Cre8tly Studio Lead Magnet.",
      path: "/docs/lead-magnets",
    },
    {
      id: "pro-documents",
      title: "How to Create Pro Documents",
      description:
        "Build professional ebooks, long-form guides, and publication-ready documents using Cre8tly Studio Pro Document.",
      path: "/docs/pro-documents",
    },
    {
      id: "smartprompt",
      title: "Smart Prompt Builder",
      description:
        "Use the Smart Prompt Builder to instantly generate high-quality prompts by answering four simple questions.",
      path: "/docs/smartprompt",
    },
    {
      id: "canvas-editor",
      title: "Canvas Editor",
      description:
        "Design pages visually: add shapes, text, images, gradients, shadows, and full layouts using the drag-and-drop editor.",
      path: "/docs/canvas-editor",
    },
    {
      id: "settings-page",
      title: "Settings Page",
      description:
        "Manage your profile, avatar, Two-Factor Authentication, Passkeys, Stripe payouts, brand identity file, and your default CTA message.",
      path: "/docs/settings",
    },
    {
      id: "prompt-memory",
      title: "Prompt Memory",
      description:
        "Save prompts, reuse them, organize them, and accelerate your workflow.",
      path: "",
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
        "Connect your own domain to Cre8tly, verify ownership, and host landing pages under your brand.",
      path: "/docs/custom-domain",
    },
  ];

  const filteredDocs = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-6 text-silver">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-silver flex items-center gap-3 mb-2 normal-case">
          <ShieldQuestionMark className="w-8 h-8 text-green" />
          Documentation
        </h1>
        <p className="text-sm text-gray-400">
          Search or browse through all Cre8tly Studio help guides, tutorials,
          and feature overviews.
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: "50px" }}
          className="w-full pl-14 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-silver focus:ring-2 focus:ring-green focus:outline-none"
        />
      </div>

      {/* Docs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => (
          <Link
            to={doc.path}
            key={doc.id}
            className="block p-5 rounded-xl bg-[#0d1117] border border-gray-800 hover:border-gray-600 hover:bg-gray-900 transition shadow"
          >
            <h2 className="text-lg font-semibold mb-2 text-silver">
              {doc.title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {doc.description}
            </p>
          </Link>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-10">
          No documents found for your search.
        </p>
      )}
    </div>
  );
}

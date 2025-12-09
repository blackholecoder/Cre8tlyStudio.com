import React from "react";
import {
  BookOpen,
  FileText,
  CreditCard,
  Mail,
  HelpCircle,
  Users,
  Sparkles,
} from "lucide-react";

export default function SellerDashboardDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "overview", label: "Dashboard Overview" },
    { id: "earnings", label: "Earnings & Payouts" },
    { id: "orders", label: "Customer Orders" },
    { id: "emails", label: "AI Email Templates" },
    { id: "stripe", label: "Stripe Express Integration" },
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
              Seller Dashboard Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Learn how to track sales, payouts, customers, and send emails using
            your built-in Seller Dashboard.
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
              <FileText className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  Seller Dashboard
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Track your sales, payouts, customers, and follow-up emails
                  directly inside Cre8tly Studio.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated Learning Time, under 2 minutes
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-green" />
                Best For, creators selling digital products
              </span>
            </div>
          </header>

          {/* INTRO */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              The Seller Dashboard is where you manage your entire sales system.
              Any PDF purchased from your Cre8tly landing pages appears here
              instantly, including customer details, the product purchased, and
              payout information from Stripe Express.
            </p>
            <p className="text-sm text-gray-300">
              It mirrors key Stripe Express information while adding
              creator-specific tools like customer emails, PDF titles purchased,
              time and date of purchase, and AI-generated templates.
            </p>
          </section>

          {/* OVERVIEW */}
          <section id="overview" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. Dashboard Overview
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Your Seller Dashboard gives you a quick snapshot of your business
              performance, including:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Pending Balance</li>
              <li>Available Balance</li>
              <li>Total revenue earned</li>
              <li>Recent Payouts</li>
              <li>Most recent customer purchases</li>
              <li>Top-selling PDFs</li>
            </ul>

            <p className="text-sm text-gray-300 mt-3">
              Everything updates in real time based on purchases made through
              your landing pages.
            </p>
          </section>

          {/* EARNINGS */}
          <section id="earnings" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              3. Earnings & Payouts{" "}
              <CreditCard className="w-4 h-4 text-gray-400" />
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              All revenue you earn is paid out through your Stripe Express
              account. Inside Cre8tly, you can view:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Total earnings</li>
              <li>Payouts already completed</li>
              <li>Upcoming payout amounts</li>
              <li>Estimated payout dates</li>
            </ul>

            <p className="text-sm text-gray-300">
              Tax documents, bank details, and payout history are fully managed
              inside Stripe Express.
            </p>
          </section>

          {/* CUSTOMER ORDERS */}
          <section id="orders" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              4. Customer Orders <Users className="w-4 h-4 text-gray-400" />
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              Every completed purchase through your Stripe Checkout Block
              appears in your Orders list. You can view:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-3">
              <li>Customer email address</li>
              <li>Which PDF they purchased</li>
              <li>Sale price</li>
              <li>Date of purchase</li>
              <li>Download status</li>
            </ul>

            <p className="text-sm text-gray-300">
              This replaces the need to dig through Stripe manually, everything
              is visible right inside your dashboard.
            </p>
          </section>

          {/* AI EMAILS */}
          <section id="emails" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              5. AI Email Templates <Mail className="w-4 h-4 text-gray-400" />
            </h2>

            <p className="text-sm text-gray-300 mb-4">
              You can send emails directly from the Seller Dashboard using
              AI-generated templates. These are automatically personalized
              using:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>The customer’s name (when available)</li>
              <li>The product they purchased</li>
              <li>Your saved CTA or brand tone</li>
              <li>Your next-step offer or resource</li>
            </ul>

            <p className="text-sm text-gray-300 mt-3">
              Perfect for thank-you messages, upsells, follow-ups, or support
              replies, all without leaving your dashboard.
            </p>
          </section>

          {/* STRIPE EXPRESS */}
          <section id="stripe" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              6. Stripe Express Integration
            </h2>

            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              Stripe Express powers your payouts. Cre8tly handles the delivery
              experience, customer details, and sales tracking, but Stripe
              handles:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Identity verification</li>
              <li>Bank transfers</li>
              <li>Payout scheduling</li>
              <li>Tax forms (1099, etc.)</li>
            </ul>

            <p className="text-sm text-gray-300 mt-3">
              After a successful purchase:
            </p>

            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
              <li>Stripe processes the payment</li>
              <li>
                You receive the revenue (minus Stripe and Cre8tly Studio
                Platform fees)
              </li>
              <li>The customer is redirected to your Thank You page</li>
              <li>The PDF is delivered instantly</li>
              <li>The order appears inside your dashboard</li>
            </ol>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver flex items-center gap-2">
              7. Troubleshooting{" "}
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  My payout is missing
                </h3>
                <p className="text-sm text-gray-300">
                  Check your Stripe Express dashboard, payout timing is fully
                  controlled by Stripe.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">
                  A customer didn’t receive their PDF
                </h3>
                <p className="text-sm text-gray-300">
                  Contact support if your customer did not receive their
                  download after purchase.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

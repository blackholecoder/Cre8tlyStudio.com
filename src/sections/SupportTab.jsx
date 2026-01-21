import { MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SupportTab() {
  const [open, setOpen] = useState(false);

  const faqs = [
    {
      q: "What is a lead magnet in Cre8tly Studio?",
      a: "A lead magnet is a downloadable PDF you create to capture emails or deliver value to your audience. Cre8tly Studio generates a fully designed, ready-to-use PDF based on your prompt, theme, and branding.",
    },
    {
      q: "How do I create a lead magnet?",
      a: "Enter your prompt, choose a theme, optionally upload a logo or link, and click Generate. Cre8tly Studio builds your PDF automatically and saves it to your dashboard.",
    },
    {
      q: "How long does it take to generate a PDF?",
      a: "Most lead magnets are generated within 5–15 seconds, depending on content length and selected design options.",
    },
    {
      q: "Where can I find my generated PDFs?",
      a: "All completed PDFs are stored in your dashboard under My Lead Magnets. From there you can view, download, or attach them to landing pages.",
    },
    {
      q: "Can I create multiple lead magnets?",
      a: "Yes. You can create multiple lead magnets as long as you have available slots or credits on your plan.",
    },
    {
      q: "Can I regenerate an existing PDF?",
      a: "No. Each lead magnet slot is intended for one finalized PDF. This prevents abuse and ensures consistent system performance. To make changes, you’ll need to generate a new lead magnet using a new slot.",
    },
    {
      q: "Can I use my own branding?",
      a: "Yes. You can upload your logo and add your own links. Themes automatically adapt to your branding for a consistent look.",
    },
    {
      q: "What are Pro Covers?",
      a: "Pro Covers lets you upload a custom cover image that becomes the first page of your PDF. It also includes access to thousands of royalty-free Unsplash images you can use as covers or backgrounds. This feature is available only with the Business Basic and Business Builder plan.",
    },
    {
      q: "What happens if I reach my plan limit?",
      a: "If you hit your limit, you’ll be prompted to upgrade or purchase additional credits. Your existing PDFs remain accessible at all times.",
    },
    {
      q: "Can I upgrade my plan later?",
      a: "Yes. You can upgrade your plan or buy more credits directly from your dashboard at any time.",
    },
    {
      q: "Do you offer refunds?",
      a: "Because Cre8tly Studio delivers instant, custom-generated digital content, refunds are not available after generation. If you encounter a technical issue or duplicate charge, contact support and we’ll help resolve it.",
    },
    {
      q: "How do I contact support?",
      a: "You can reach our support team through the Contact page. Responses typically arrive within 24–48 hours, Monday through Friday.",
    },
  ];

  return (
    <>
      {/* Floating Tab Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-green text-black font-semibold px-2 py-2 rounded-full shadow-lg hover:opacity-90 transition-all z-50 design-text text-sm"
      >
        <MessageCircleQuestion size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          {/* FAQ Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white p-8 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl relative max-h-[80vh] overflow-y-auto"
          >
            {/* Close buttons (left + right for accessibility) */}
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-red-400 text-xl"
              >
                ✕
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-green">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5 text-gray-300">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-white">{faq.q}</h3>
                  <p className="text-sm mt-1 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/docs"
                className="text-green font-medium hover:underline"
              >
                Need more help? Visit our Docs →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";

export default function SupportTab() {
  const [open, setOpen] = useState(false);

  const faqs = [
    {
      q: "How do I generate a lead magnet?",
      a: "Fill out your prompt, upload a logo, add your link, select a theme, and click “Generate.” Your PDF will be automatically created and ready to download.",
    },
    {
      q: "How long does it take?",
      a: "Most PDFs take between 5–15 seconds to generate, depending on the number of pages and theme you select.",
    },
    {
      q: "Where can I find my generated PDFs?",
      a: "All completed lead magnets are available in your dashboard under “My Lead Magnets.” You can view, download, or regenerate them anytime.",
    },
    {
      q: "Can I generate more than one lead magnet?",
      a: "Yes! You can create as many as you want. Simply open the Lead Magnet Creator and repeat the process with a new prompt or design.",
    },
    {
      q: "Can I use my own branding?",
      a: "Absolutely. You can upload your own logo and link to your website or product page. Themes adjust automatically to fit your brand look.",
    },
    {
      q: "What are Pro Covers?",
      a: "Pro Covers is an exclusive upgrade that lets you upload custom cover images for your lead magnets. Your uploaded cover appears as the first page of your PDF, giving your content a professional, branded presentation. Available only for users with the Pro Covers plan.",
    },
    {
      q: "Can I edit or regenerate an existing PDF?",
      a: "No. Each slot is designed for a single finalized PDF to ensure fair usage and prevent system abuse. Allowing unlimited regenerations could cause performance issues and disrupt other users’ workflows. If you’d like to create a new version, please start a new lead magnet using a fresh slot.",
    },

    {
      q: "Do you offer refunds?",
      a: "Since Cre8tly Studio is a digital service that instantly generates custom content, we do not offer refunds after delivery. However, if you experience a technical issue or duplicate charge, please reach out, we’ll make it right.",
    },
    {
      q: "Can I upgrade my plan or buy more credits?",
      a: "Yes. Additional credits and premium plans are available directly from your account dashboard.",
    },
    {
      q: "What if I reach my limit?",
      a: "If you’ve hit your plan limit, you’ll see a message prompting you to upgrade or purchase more credits. You’ll never lose access to past PDFs.",
    },
    {
      q: "How do I contact support?",
      a: "You can reach out anytime on our Contact Us page Our team typically responds within 24-48 hours, Monday–Friday.",
    },
  ];

  return (
    <>
      {/* Floating Tab Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-green text-black font-semibold px-5 py-3 rounded-full shadow-lg hover:opacity-90 transition-all z-50 design-text text-xl"
      >
        💬 Support
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
                to="/contact"
                className="text-green font-medium hover:underline"
              >
                Need more help? Contact Support →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

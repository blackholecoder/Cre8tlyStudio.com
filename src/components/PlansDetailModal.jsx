import { X } from "lucide-react";
import { useEffect } from "react";

export default function PlanDetailsModal({ plan, onClose }) {
  if (!plan) return null;

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const descriptions = {
    basic: {
      title: "Basic Creator",
      content: `
The Basic Creator Plan gives you 5 Lead Magnet Slots to design professional, conversion-ready lead magnets using Cre8tly’s AI tools. Access standard templates, custom branding, and editable layouts so you can attract new subscribers and showcase your expertise with ease.`,
    },
    business_basic_builder: {
      title: "Business Basic Builder",
      content: `
The Business Basic Builder plan is designed for creators and entrepreneurs who want to start selling without the full Pro commitment.

This plan includes:
• 7 Lead Magnet Slots  
• Sell directly on your landing pages  
• No platform fees: keep what you make  
• Pro Covers for books and lead magnets  
• Prompt Memory for consistent AI writing  
• Access to millions of royalty-free Unsplash images  
• Built-in email capture for lead generation  

Business Basic gives you everything you need to launch, validate, and grow without advanced analytics or custom landing page features. Upgrade anytime when you're ready to scale.`,
    },
    author: {
      title: "Author’s Assistant",
      content: `
Transform your writing with intelligent support, not automation.
Author’s Assistant is a complete book creation and publishing system designed for serious writers. It helps you plan structure, develop chapters, revise with intention, and move deliberately from draft to finished work. Write and edit up to 750 pages with full control over revisions, section locking, and finalization. When your book is ready, combine all chapters into a single publishable EPUB, compatible with Kindle and major ebook platforms. Your voice stays intact, your thinking stays clear, and your work ends as a finished, authoritative book, not an endless draft.
`,
    },

    business_builder_pack: {
      title: "Pro Business Builder Pack",
      content: `
The Pro Business Builder Pack is the ultimate growth suite for creators, entrepreneurs, and marketers who want to look professional, build trust, and scale with confidence.

It gives you everything you need to build high-converting landing pages, capture leads automatically, and sell digital products under your own brand using The Messy Attic’s advanced tools.

Features include:
• High-converting landing pages and lead forms  
• Mini Offers for quick digital sales and upsells  
• Animated sections and scroll effects for premium page engagement  
• Custom domain support (use your own branded domain)  
• Built-in analytics to track performance and conversions  
• No platform fees, keep what you make  
• AI-powered email content generator  
• Premium conversion-optimized templates  
• Priority support and one-year updates  

This plan is designed for creators who want full brand control, higher trust, and the ability to scale their digital business without limitations.`,
    },
  };

  const { title, content } = descriptions[plan] || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-6">
      {/* MODAL SHELL */}
      <div className="bg-[#141414] border border-gray-700 rounded-2xl w-full max-w-lg relative max-h-[90vh] flex flex-col shadow-2xl shadow-black/40 mt-6 sm:mt-0">
        {/* CLOSE BUTTON (always visible) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <X size={22} />
        </button>

        {/* HEADER */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-bold text-center text-white">{title}</h2>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="px-8 pb-6 overflow-y-auto text-gray-300 whitespace-pre-line leading-relaxed">
          {content}
        </div>

        {/* FOOTER */}
        <div className="px-8 pb-6 pt-4 text-center border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue rounded-lg font-semibold hover:opacity-90 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

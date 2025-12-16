import { X } from "lucide-react";

export default function PlanDetailsModal({ plan, onClose }) {
  if (!plan) return null;

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
• Keep 80% of every sale  
• Pro Covers for books and lead magnets  
• Prompt Memory for consistent AI writing  
• Access to millions of royalty-free Unsplash images  
• Built-in email capture for lead generation  

Business Basic gives you everything you need to launch, validate, and grow without advanced analytics or custom landing page features. Upgrade anytime when you're ready to scale.`,
    },

    pro: {
      title: "Pro Covers",
      content: `
The Pro Covers Plan includes everything in Basic, plus unlimited custom cover uploads for both books and lead magnets. Personalize your visuals with full creative control—upload, test, and update covers that match your unique style and brand. You’ll also gain access to thousands of royalty-free Unsplash images, making it easy to design stunning, professional-quality covers in seconds without worrying about licensing or costs.`,
    },
    author: {
      title: "Author’s Assistant",
      content: `
Transform your writing with intelligent support, not automation.
The Author’s Assistant is your creative co-writer, an AI partner that helps you plan your story structure, build rich scenes, and craft powerful chapters without losing your authentic voice. Generate up to 750 pages with built-in editing tools that perfect your tone, pacing, and style. Plus, enjoy unlimited custom cover uploads to bring your book to life with a professional finish.`,
    },
    bundle: {
      title: "All-In-One Bundle",
      content: `
The All-In-One Bundle gives you everything in a single discounted package:  
• 5 Lead Magnet Slots to grow your audience  
• Pro Covers for both books and lead magnets  
• 1 Author’s Assistant Book Slot (750 pages + editor)  
A full creative suite that lets you write, design, and publish with complete control from start to finish.`,
    },
    prompt_memory: {
      title: "Prompt Memory Subscription",
      content: `
The Prompt Memory Plan gives you a persistent AI memory across your entire Cre8tly Studio experience.
It learns your tone, writing style, and preferences, letting you generate faster, more accurate, and
on-brand results every time. Cancel anytime, no contracts.`,
    },
    business_builder_pack: {
      title: "Pro Business Builder Pack",
      content: `
The Pro Business Builder Pack is the ultimate growth suite for creators, entrepreneurs, and marketers.
It gives you unlimited access to build landing pages, capture leads automatically, and send high-converting emails using Cre8tly Studio’s advanced automation tools.

Features include:
• Unlimited landing pages and lead forms  
• Custom domains and analytics tracking  
• AI-powered email content generator  
• Premium conversion templates  
• Priority support and one-year updates

This plan helps you automate your lead generation and sales process from start to finish—everything you need to scale your digital business.`,
    },
  };

  const { title, content } = descriptions[plan] || {};

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-lg w-full text-white relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-gray-300 whitespace-pre-line leading-relaxed">
          {content}
        </p>
        <div className="text-center mt-8">
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

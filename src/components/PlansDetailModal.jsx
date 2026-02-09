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
The Basic Creator plan gives you free access to The Messy Attic community.

Publish posts and short fragments, join discussions, and connect with other writers in a focused, algorithm-free environment. This plan is ideal for writers who want to share their work, build visibility, and participate in the community without any pressure to monetize.

Upgrade anytime when you’re ready to enable paid subscriptions or sell your work professionally.`,
    },
    business_basic_builder: {
      title: "Business Basic Builder",
      content: `
The Business Basic Builder plan is designed for writers who are ready to monetize their work and establish a professional presence.

This plan includes:
• Free access to the community  
• Set your own subscription prices  
• Monthly, annual, and VIP Founder tiers  
• Subscriber-only posts and fragments  
• Direct relationship with your readers  
• Landing page builder to sell books and writing  
• Custom domain support  

Business Basic gives you the tools to sell your work, grow a paid audience, and own your platform without unnecessary complexity. Upgrade anytime when you’re ready to scale further.`,
    },
    author: {
      title: "Author’s Assistant",
      content: `
Transform your writing with intelligent support, not automation.
Author’s Assistant is a complete book creation and publishing system designed for serious writers. It helps you plan structure, develop chapters, revise with intention, and move deliberately from draft to finished work. Write and edit up to 750 pages, per book, with full control over revisions, section locking, and finalization. When your book is ready, combine all chapters into a single publishable EPUB, compatible with Kindle and major ebook platforms. Your voice stays intact, your thinking stays clear, and your work ends as a finished, authoritative book, not an endless draft.
`,
    },

    business_builder_pack: {
      title: "Pro Business Builder Pack",
      content: `
The Pro Business Builder Pack is built for writers and creators who want full control over how their work is presented, sold, and scaled.

This plan includes:
• Everything in Business Basic Builder  
• Unlimited paid subscribers  
• Advanced landing page layouts and themes  
• Custom domains and professional branding  
• Deeper analytics and engagement insights  
• Priority support  

The Business Builder Pack is designed for creators running their writing as a serious business, offering maximum flexibility, ownership, and room to grow without platform limitations.`,
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How is Cre8tly Studio AI different from ChatGPT?",
    a: "ChatGPT is a general writing tool. Cre8tly Studio is a product building system. It uses your brand identity, past content, and preferences to create consistent, ready to publish digital assets that actually match how you speak.",
  },
  {
    q: "What is Cre8tly Studio?",
    a: "Cre8tly Studio is an all-in-one, AI powered platform that lets you create digital products, landing pages, PDFs, and sell them instantly from one place.\n\n And when we say all-in-one, we mean it. With Cre8tly Studio, you have all the tools you need to create, market, and sell professional digital products from the same dashboard — no messy integrations or prior tech skills required.",
  },
  {
    q: "Why choose Cre8tly Studio?",
    a: "Cre8tly Studio is built for creators, coaches, freelancers, entrepreneurs, and small businesses who want to launch and sell faster.\n\n That means you can expect constant platform enhancements and best-in-class customer support as you build and scale your business.\n\n And if you’re not so great at the tech side of things, you’re in the right place. Cre8tly Studio was created specifically for non-techie people to help them achieve entrepreneurial success online.",
  },
  {
    q: "How does Cre8tly Studio help me build my business?",
    a: "Cre8tly Studio gives you everything you need to create, sell, and grow your digital business, with guidance and support built in every step of the way.\n\n You never start from scratch. Cre8tly includes detailed docs, digital product preset prompt templates, and intuitive design tools that let you quickly create professional digital products, landing pages, audio products, and lead magnets, all without technical experience.\n\n On top of that, Cre8tly brings it all together with built in analytics, sales tracking, and product delivery, so you can manage, launch, and scale your business from one powerful platform.",
  },
  {
    q: "What can I create with Cre8tly Studio?",
    a: "You can create eBooks, lead magnets, landing pages, audio products, PDFs, full books, and full digital offers.",
  },
  {
    q: "Can I sell my products directly on the platform?",
    a: "Yes. Cre8tly Studio includes checkout, delivery, and analytics so you can sell instantly without extra tools.\n\nYou can also create your own custom landing pages to showcase your products and drive conversions, all from the same dashboard.",
  },
  {
    q: "Does Cre8tly Studio support audio products?",
    a: "Yes. You can upload audio files, preview them, and sell full tracks or collections.\n\nWe allow audio files up to 3 hours long.",
  },
  {
    q: "How does Cre8tly Studio compare with other knowledge commerce platforms?",
    a: "Cre8tly Studio stands out by giving you all the tools you need in one place, creation, design, marketing, checkout, delivery, and analytics, without needing extra integrations.\n\nUnlike many other platforms that limit what you can build or charge extra for essential features, Cre8tly lets you create digital products, landing pages, audio products, PDFs, and more from a single dashboard, with powerful support and intuitive tools designed for creators of all skill levels.",
  },
  {
    q: "Does Cre8tly Studio take a cut of my revenue?",
    a: "No. Cre8tly Studio does not take a percentage of your sales.\n\nYou keep full control of your revenue. Like all platforms that process payments, standard payment processing fees apply based on your stripe payment provider.\n\nCre8tly supports modern checkout experiences and flexible payment options, helping you convert more customers while keeping your costs transparent and predictable.",
  },
  {
    q: "Can I use Cre8tly Studio on mobile devices?",
    a: "Yes. Cre8tly Studio is fully mobile friendly and works seamlessly on phones and tablets through the browser.\n\nCreators can manage products, build landing pages, track sales, and monitor analytics from any device, while customers can easily view landing pages, purchase products, and access digital content on mobile.\n\nWhile Cre8tly does not currently offer a standalone mobile app, everything is designed to work smoothly on mobile so you can run and grow your business from anywhere.",
  },
  {
    q: "What is Author’s Assistant?",
    a: "Author’s Assistant is an AI powered writing companion designed to help authors refine, edit, and expand their own work. It remembers your story, tone, and progress to provide consistent, context aware suggestions.\n\nIt does not write books for you. Instead, it enhances clarity, flow, and structure while preserving your voice. Built for serious fiction and nonfiction authors who want a smarter way to polish and publish their work.",
  },

  {
    q: "Does Author’s Assistant write my book for me?",
    a: "No. Author’s Assistant does not write books for you. It works with what you write, refining and enhancing your text while preserving your voice.\n\nFor fiction, it helps improve flow, clarity, and cinematic pacing without changing your story. For nonfiction, it stays grounded in your material and does not invent characters, places, or events.\n\nAuthor’s Assistant is built for serious authors who want a smarter editing and refinement tool, not an auto-writing system.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className=" w-full max-w-4xl mx-auto px-6 py-24">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-gray-900">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-gray-900"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold">{item.q}</span>

                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <Plus className="h-10 w-10" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-900/80 whitespace-pre-line">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How is The Messy Attic AI different from ChatGPT?",
    a: "ChatGPT is a general writing tool. The Messy Attic is a product building system. It uses your brand identity, past content, and preferences to create consistent, ready to publish digital assets that actually match how you speak.",
  },
  {
    q: "Is your site safe to use?",
    a: "Yes. The Messy Attic is built with security as a priority. We use encrypted connections, modern authentication methods including passwordless login and two factor authentication, and industry standard safeguards to protect user data.",
  },
  {
    q: "What is The Messy Attic?",
    a: "The Messy Attic is an all-in-one, AI powered platform that lets you create digital products, landing pages, PDFs, and sell them instantly from one place.\n\n And when we say all-in-one, we mean it. With The Messy Attic, you have all the tools you need to create, market, and sell professional digital products from the same dashboard — no messy integrations or prior tech skills required.",
  },
  {
    q: "Why choose The Messy Attic?",
    a: "The Messy Attic is built for creators, coaches, freelancers, entrepreneurs, and small businesses who want to launch and sell faster.\n\n That means you can expect constant platform enhancements and best-in-class customer support as you build and scale your business.\n\n And if you’re not so great at the tech side of things, you’re in the right place. The Messy Attic was created specifically for non-techie people to help them achieve entrepreneurial success online.",
  },
  {
    q: "How does The Messy Attic help me build my business?",
    a: "The Messy Attic gives you everything you need to create, sell, and grow your digital business, with guidance and support built in every step of the way.\n\n You never start from scratch. Cre8tly includes detailed docs, digital product preset prompt templates, and intuitive design tools that let you quickly create professional digital products, landing pages, audio products, and lead magnets, all without technical experience.\n\n On top of that, Cre8tly brings it all together with built in analytics, sales tracking, and product delivery, so you can manage, launch, and scale your business from one powerful platform.",
  },
  {
    q: "What can I create with The Messy Attic?",
    a: "You can create eBooks, lead magnets, landing pages, audio products, PDFs, full books, and full digital offers.",
  },
  {
    q: "Can I sell my products directly on the platform?",
    a: "Yes. The Messy Attic includes checkout, delivery, and analytics so you can sell instantly without extra tools.\n\nYou can also create your own custom landing pages to showcase your products and drive conversions, all from the same dashboard.",
  },
  {
    q: "Does The Messy Attic support audio products?",
    a: "Yes. You can upload audio files, preview them, and sell full tracks or collections.\n\nWe allow audio files up to 3 hours long.",
  },
  {
    q: "How does The Messy Attic compare with other knowledge commerce platforms?",
    a: "The Messy Attic stands out by giving you all the tools you need in one place, creation, design, marketing, checkout, delivery, and analytics, without needing extra integrations.\n\nUnlike many other platforms that limit what you can build or charge extra for essential features, Cre8tly lets you create digital products, landing pages, audio products, PDFs, and more from a single dashboard, with powerful support and intuitive tools designed for creators of all skill levels.",
  },
  {
    q: "Does The Messy Attic take a cut of my revenue?",
    a: "No. The Messy Attic does not take a percentage of your sales.\n\nYou keep full control of your revenue. Like all platforms that process payments, standard payment processing fees apply based on your stripe payment provider.\n\nCre8tly supports modern checkout experiences and flexible payment options, helping you convert more customers while keeping your costs transparent and predictable.",
  },
  {
    q: "Can I use The Messy Attic on mobile devices?",
    a: "Yes. The Messy Attic is fully mobile friendly and works seamlessly on phones and tablets through the browser.\n\nCreators can manage products, build landing pages, track sales, and monitor analytics from any device, while customers can easily view landing pages, purchase products, and access digital content on mobile.\n\nWhile Cre8tly does not currently offer a standalone mobile app, everything is designed to work smoothly on mobile so you can run and grow your business from anywhere.",
  },
  {
    q: "What is Author’s Assistant?",
    a: "Author’s Assistant is a structured writing and publishing system designed to help authors plan, write, revise, and finish full-length books across fiction, nonfiction, and educational projects. It supports section-based writing, long-form context awareness, and intentional editing, while preserving your voice and creative control.\n\nIt does not write books for you. Instead, it helps you think clearly, refine your work, and move deliberately from draft to finalized manuscript. When your book is complete, you can lock your chapters and publish a single EPUB ready for Kindle and major ebook platforms. Built for serious creators who want to finish and publish real work, not generate disposable content.",
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

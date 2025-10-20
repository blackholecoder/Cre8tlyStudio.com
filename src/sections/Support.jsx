import React, { useState } from "react";


const faqs = [
  {
  question: "How do I become a Verified Creator on Phlokk?",
  answer: "Message Customer Support at support@phlokk.com for all questions related to Verification.",
},
  {
    question: "What’s included with verification?",
    answer: "Verified Creators get increased visibility, a verified badge, and access to VIP phone support.",
  },
  {
    question: "Can I recover a deleted account?",
    answer: "If you requested account deletion, you have 30 days to reactivate it before it is permanently removed. After 30 days, you will no longer have access to your old account or any of its data.",
},
  {
    question: "Where can I report bugs or abusive content?",
    answer: "Use the in-app report tools, or email support@phlokk.com.",
  },
  {
    question: "How do I reset my password?",
    answer: "Go to the login screen, tap 'Forgot Password?', and follow the instructions sent to your email.",
  },
  {
    question: "What are Circles?",
    answer: "Circles are private groups where members can post, chat, and share content with a trusted community.",
  },
  {
    question: "How do I upload a video?",
    answer: "Tap the camera icon button on the main profile screen or main feed of app, record or upload a video, then edit, tag, and post it.",
  },
  {
    question: "How do I earn money on Phlokk?",
    answer: "Monetization coming soon!",
  },
];

const SupportPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 overflow-y-auto">
      <div className="w-full max-w-3xl bg-bioModal p-8 rounded-2xl shadow-lg border border-gray-800 flex flex-col items-center">

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Phlokk Support
        </h1>

        <p className="text-gray-400 mb-6 text-center max-w-lg">
          Need help or have questions? Our team is here to support you.
        </p>

        {/* Phone Support */}
        <div className="mb-8 w-full">
          <h2 className="text-xl font-semibold text-white mb-1">Phone Support</h2>
          <p className="text-gray-300 leading-relaxed">
            Verified Creators can call us at <strong className="text-white">1 (888) 332-0774</strong><br />
            Monday–Friday: 9am–5pm ET<br />
            Saturday: 11am–5pm ET
          </p>
        </div>

        {/* Email Support */}
        <div className="mb-10 w-full">
          <h2 className="text-xl font-semibold text-white mb-1">📧 Email Support</h2>
          <p className="text-gray-300">
            Email us at{" "}
            <a
              href="mailto:support@phlokk.com"
              className="text-blue-500 underline"
            >
              support@phlokk.com
            </a>
          </p>
        </div>

        {/* FAQ Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-700 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-4 py-3 bg-bioModal text-white font-medium hover:bg-gray-800 transition flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <span className="ml-2">{openIndex === index ? "−" : "+"}</span>
                </button>
                {openIndex === index && (
                  <div className="px-4 py-3 text-gray-400 border-t border-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { webPDF } from "../assets/images";

export default function FreePDFSection() {
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://themessyattic.com/api/pdf/free-pdf", { email })
      .then(() => {
        setPdfSuccess(true);
        setPdfError("");
        setEmail("");

        setTimeout(() => {
          setPdfSuccess(false);
          setEmail("");
        }, 8000);
      })
      .catch((err) => {
        console.error("Error sending PDF:", err);
        if (err.response && err.response.status === 409) {
          setPdfError(
            "You’ve already downloaded this guide, check your inbox 📩",
          );
        } else {
          setPdfError("Something went wrong. Please try again later.");
        }
        setTimeout(() => setPdfError(""), 8000);
      });
  };

  return (
    <section
      id="free-pdf"
      className="relative bg-[#0b0f1a] py-24 px-6 mt-20 mb-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Ebook image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={webPDF}
              alt="The Secret Formula to Grow Your Email List"
              className="rounded-xl shadow-2xl w-72 sm:w-80 md:w-96 border border-white/10"
            />
          </div>

          {/* Right: Content */}
          <div className="text-center lg:text-left lg:pl-6">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 heading-text bg-white bg-clip-text text-transparent">
              The <span className="text-headerGreen">Secret Formula</span> to
              Grow Your Email List
            </h2>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed heading-text">
              Unlock the exact strategy used by top creators and businesses to
              build loyal audiences, convert followers into subscribers, and
              grow a powerful email list that drives revenue on autopilot.
            </p>

            <ul className="text-gray-400 mb-8 space-y-3 text-sm sm:text-base heading-text">
              <li>📈 Proven steps to grow your email list organically</li>
              <li>
                🎯 Smart lead magnet formulas that attract real subscribers
              </li>
              <li>💡 How to craft irresistible opt-in offers</li>
              <li>⚙️ Tools and automations to scale your growth</li>
            </ul>

            {/* Email Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 max-w-md mx-auto lg:mx-0"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-royalPurple text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
              >
                Get the Free Guide
              </button>
            </form>

            {/* Error Alert */}
            {pdfError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500 text-red-300 rounded-2xl shadow-xl p-6 mt-6 max-w-xl mx-auto lg:mx-0"
              >
                <h3 className="text-xl font-bold mb-2 text-red-400">
                  ⚠️ Oops!
                </h3>
                <p className="text-sm leading-relaxed text-red-200 heading-text">
                  {pdfError}
                </p>
              </motion.div>
            )}

            {/* Success Alert */}
            {pdfSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-600/20 border border-green-400 text-green-300 rounded-2xl shadow-xl p-6 mt-6 max-w-xl mx-auto lg:mx-0"
              >
                <h3 className="text-xl font-bold mb-2">✅ Success!</h3>
                <p className="text-sm leading-relaxed text-green-200 heading-text">
                  Check your inbox for{" "}
                  <strong>“The Secret Formula to Grow Your Email List.”</strong>{" "}
                  If you don’t see it, check your{" "}
                  <strong>spam/junk folder</strong> and mark the email as safe
                  to ensure future tips reach you. 💌
                </p>
              </motion.div>
            )}

            <p className="text-sm text-gray-500 mt-4">
              Your privacy is safe with us — no spam, ever. You’ll only receive
              helpful insights to grow your business and brand.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

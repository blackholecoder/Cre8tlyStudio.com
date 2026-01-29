import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import axiosInstance from "../api/axios";
import { headerLogo } from "../assets/images";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/support/contact", form);
      toast.success("✅ Message sent! We'll get back to you soon.", {
        position: "top-center",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong. Please try again later.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always restore scrolling when this page mounts
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";

    return () => {
      // Ensure scroll is restored if you navigate away and come back
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <section className="flex flex-col justify-center items-center flex-grow px-6 py-20">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="flex items-center gap-1 mb-5">
              <img
                src={headerLogo}
                alt="The Messy Attic"
                className="h-12 w-12 object-contain"
              />

              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold text-gray-900">
                  The Messy Attic
                </span>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-900">
              Contact Support
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Have questions or need help? Our support team typically responds
              within 24 to 48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="
              w-full h-[48px] px-4 py-3 rounded-lg
              bg-white
              border border-gray-300
              text-gray-900
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black
            "
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="
              w-full h-[48px] px-4 py-3 rounded-lg
              bg-white
              border border-gray-300
              text-gray-900
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black
            "
            />

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject (optional)"
              className="
              w-full h-[48px] px-4 py-3 rounded-lg
              bg-white
              border border-gray-300
              text-gray-900
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black
            "
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={5}
              required
              className="
              w-full px-4 py-3 rounded-lg resize-none
              bg-white
              border border-gray-300
              text-gray-900
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black
            "
            />

            <button
              type="submit"
              disabled={loading}
              className="
              w-full bg-black text-white
              font-semibold py-3 rounded-lg
              hover:opacity-90 transition
            "
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

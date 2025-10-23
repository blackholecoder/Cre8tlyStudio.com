import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "./Footer";
import CustomCursor from "../components/CustomCursor";
import AnimatedLogo from "../components/animation/AnimatedLogo";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("https://cre8tlystudio.com/api/support/contact", form);
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

  return (
    <>
    <section className="min-h-screen text-white flex items-center justify-center px-6 py-20">
      <CustomCursor />
      <div className="max-w-2xl w-full bg-metalBlack p-8 rounded-2xl border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-center text-center">
  <AnimatedLogo />
</div>
        
        
        <h1 className="text-3xl font-bold text-green text-center mb-6">Contact Support</h1>
        <p className="text-gray-300 text-center mb-8">
          Have questions or need help? Fill out the form below and our support team will respond within 24–48 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email associated with your account"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
          />
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject (optional)"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message..."
            rows={6}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
     <Footer />
    </>
  );
}

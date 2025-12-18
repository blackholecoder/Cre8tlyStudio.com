import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import AnimatedLogo from "../components/animation/AnimatedLogo";
import { Footer } from "../sections";

export default function Careers() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    experience: "",
    message: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/careers/apply", form);

      toast.success("🎉 Application submitted! We will contact you soon.", {
        position: "top-center",
      });

      setForm({
        name: "",
        email: "",
        position: "",
        experience: "",
        message: "",
        website: "",
      });
    } catch (err) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(`❌ ${backendMessage}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Centered Content */}
        <div className="flex-grow flex items-center justify-center px-6 py-10">
          <div className="max-h-[90vh] overflow-y-auto w-full flex justify-center">
            <div className="max-w-2xl w-full bg-metalBlack p-8 rounded-2xl border border-gray-700 shadow-2xl">
              <div className="flex items-center justify-center text-center mb-4">
                <AnimatedLogo />
              </div>

              <h1 className="text-3xl font-bold text-green text-center mb-2">
                Join the Cre8tly Team
              </h1>

              <p className="text-gray-300 text-center mb-8">
                Apply to become part of the fastest-growing creator platform.
                <br /> We're hiring independent contractors.
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green text-white"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green text-white"
                />

                <input
                  type="text"
                  name="website" // name MUST look legit to bots
                  value={form.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex="-1"
                  className="hidden"
                />

                <div className="relative">
                  <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    required
                    className="
      w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 
      focus:border-green text-white appearance-none
    "
                  >
                    <option value="">Select Position</option>
                    <option value="sales_rep">Independent Contractor</option>
                  </select>

                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>

                <textarea
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Briefly describe any experience you have..."
                  rows={2}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green text-white resize-y"
                ></textarea>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Why do you want to join Cre8tly?"
                  rows={2}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green text-white resize-y"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer stays at bottom without pushing scroll */}
        <Footer />
      </div>
    </>
  );
}

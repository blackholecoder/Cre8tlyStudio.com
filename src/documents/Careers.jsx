import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

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
      <main className="w-full bg-white pt-[72px] pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
            <h1 className="text-3xl font-bold text-gray-700 text-center mb-6 leading-tight">
              Apply to Work
              <span className="block mt-1 text-gray-900">
                With Cre8tly Studio
              </span>
            </h1>

            <p className="text-gray-600 text-center mb-8">
              We’re looking for motivated independent contractors to help
              creators grow.
              <span className="block mt-1 text-gray-900">
                Tell us a bit about yourself.
              </span>
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
                className="
                  w-full h-[48px] px-4 rounded-lg
                  bg-white
                  border border-gray-300
                  text-gray-900
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2 focus:ring-black/10
                  focus:border-black
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
                  w-full h-[48px] px-4 rounded-lg
                  bg-white
                  border border-gray-300
                  text-gray-900
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2 focus:ring-black/10
                  focus:border-black
                "
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
                    w-full h-[48px] px-4 rounded-lg
                    bg-white
                    border border-gray-300
                    text-gray-900
                    focus:outline-none
                    focus:ring-2 focus:ring-black/10
                    focus:border-black
                    appearance-none
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
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white
                  border border-gray-300
                  text-gray-900
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2 focus:ring-black/10
                  focus:border-black
                  resize-y
                "
              ></textarea>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Why do you want to join Cre8tly Studio?"
                rows={2}
                required
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white
                  border border-gray-300
                  text-gray-900
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2 focus:ring-black/10
                  focus:border-black
                  resize-y
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
                {loading ? "Submitting Application..." : "Apply Now"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

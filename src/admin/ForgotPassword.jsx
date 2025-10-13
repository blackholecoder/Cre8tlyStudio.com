import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import Footer from "../sections/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address.");

    setLoading(true);
    try {
      console.log("sending email:", email);
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      setEmail("");

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(err.response?.data?.message || "Error sending reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#030712",
        isolation: "isolate",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <section className="flex flex-col justify-center items-center flex-grow text-white px-6 py-20">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <h1 className="text-3xl font-bold text-green text-center mb-6">
            Forgot Password
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Enter your email below and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* 🔹 Back to Login */}
          <p className="text-sm text-gray-400 text-center mt-6">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-green hover:underline"
            >
              Back to Login
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { headerLogo } from "../assets/images";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.width = "";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent");

      setEmail("");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <section className="flex flex-col justify-center items-center flex-grow px-6 py-20">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <img
              src={headerLogo}
              alt="Cre8tly Studio"
              className="h-12 w-12 object-contain"
            />
            <span className="text-lg font-semibold text-gray-900">
              Cre8tly Studio
            </span>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot your password?
          </h2>

          <p className="text-sm text-gray-600 mb-6">
            Enter your email and we’ll send you a reset link.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="
                w-full h-[48px] px-4 rounded-lg
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
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

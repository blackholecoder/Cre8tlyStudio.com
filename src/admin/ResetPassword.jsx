import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axios.jsx";
import { toast } from "react-toastify";
import { headerLogo } from "../assets/images/index.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword)
      return toast.error("Please enter and confirm your new password.");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match.");

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful!");
      setSuccess(true);

      // Auto redirect after short delay
      setTimeout(() => navigate("/login"), 3500);
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <section className="flex flex-col justify-center items-center flex-grow px-6 py-20">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl"
            >
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
                Reset your password
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                Enter a new password for your account.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
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

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
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
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>

              {/* Back */}
              <p className="text-sm text-gray-600 text-center mt-6">
                Remembered your password?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-semibold hover:underline"
                >
                  Back to Login
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Password updated
              </h2>

              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="
                  w-full bg-black text-white
                  font-semibold py-3 rounded-lg
                  hover:opacity-90 transition
                "
              >
                Go to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

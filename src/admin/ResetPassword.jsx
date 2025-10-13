import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axios.jsx";
import { toast } from "react-toastify";
import Footer from "../sections/Footer.jsx";

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
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl"
            >
              <h1 className="text-3xl font-bold text-green text-center mb-6">
                Reset Password
              </h1>
              <p className="text-gray-300 text-center mb-8">
                Enter your new password below to reset your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="text-sm text-gray-400 text-center mt-6">
                <a href="/login" className="text-green hover:underline">
                  Back to Login
                </a>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl text-center"
            >
              <h1 className="text-3xl font-bold text-green mb-6">
                Password Reset Successful
              </h1>
              <p className="text-gray-300 mb-6">
                Your password has been updated successfully. You can now log in
                with your new password.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-green text-black font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-all"
                >
                  Go to Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../admin/AuthContext.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { headerLogo } from "../assets/images/index.js";

export default function SignupCommunity() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const refSlug = searchParams.get("ref");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = refSlug ? { ...formData, refSlug } : formData;

      const res = await axios.post(
        "https://cre8tlystudio.com/api/auth/signup-community",
        payload
      );

      if (res.status === 201) {
        await login(formData.email, formData.password);
        navigate("/community");
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please try again later.");
      }
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
    <div className="min-h-screen flex flex-col bg-white">
      <section className="flex flex-col justify-center items-center flex-grow px-6 py-20">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-1 mb-5">
            <img
              src={headerLogo}
              alt="Cre8tly Studio"
              className="h-12 w-12 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-gray-900">
                Cre8tly Studio
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-5">
            <h3 className="text-3xl font-bold text-gray-900">
              Join the community
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Already have an account?{" "}
              <a href="/login" className="font-semibold hover:underline">
                Log in
              </a>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full h-[48px] px-4 rounded-lg border border-gray-300"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full h-[48px] px-4 rounded-lg border border-gray-300"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full h-[48px] px-4 pr-12 rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3 rounded-lg"
            >
              {loading ? "Joining Community..." : "Join the Community"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

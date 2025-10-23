import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Footer from "../sections/Footer.jsx";
import CustomCursor from "../components/CustomCursor.jsx";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fade, setFade] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setFade(false);
      const fadeTimer = setTimeout(() => setFade(true), 4000);
      const clearTimer = setTimeout(() => setError(""), 5000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [error]);

  return (
    <div
      style={{
        isolation: "isolate",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <section className="flex flex-col justify-center items-center flex-grow text-white px-6 py-20">
        <CustomCursor />
        <div className="w-full max-w-md bg-metalBlack p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <h1 className="text-3xl font-bold text-green text-center mb-6">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Log in to your account to continue creating and managing your
            digital products.
          </p>

          {error && (
            <div
              className={`bg-red-900/60 border border-red-500 text-red-200 text-sm rounded-lg p-3 mb-4 text-center transition-opacity duration-1000 ${
                fade ? "opacity-0" : "opacity-100"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-4">
            <a href="/forgot-password" className="text-green hover:underline">
              Forgot Password?
            </a>
          </p>

          <p className="text-sm text-gray-400 text-center mt-6">
            Don’t have an account?{" "}
            <a href="/sign-up" className="text-green hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

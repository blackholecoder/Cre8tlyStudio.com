import { useState, useEffect } from "react";
import { useAuth } from "../admin/AuthContext.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Footer from "../sections/Footer.jsx";
import CustomCursor from "../components/CustomCursor.jsx";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
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
const refEmployee = searchParams.get("ref_employee");


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
      // ✅ Send refEmployee only if present
      const payload = refEmployee
        ? { ...formData, refEmployee }
        : formData;

      const res = await axios.post(
        "https://cre8tlystudio.com/api/auth/signup",
        payload
      );

      if (res.status === 201) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
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
    <div
      style={{
        isolation: "isolate",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomCursor />
      <section className="flex flex-col justify-center items-center flex-grow text-white px-6 py-20">
        <div className="w-full max-w-md bg-metalBlack p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <h1 className="text-3xl font-bold text-green text-center mb-6">
            Create Your Account
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Join Cre8tly Studio and start creating digital products instantly.
          </p>

          {error && (
            <div className="bg-red-900/60 border border-red-500 text-red-200 text-sm rounded-lg p-3 mb-4 text-center transition-opacity duration-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-green hover:underline">
              Log In
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

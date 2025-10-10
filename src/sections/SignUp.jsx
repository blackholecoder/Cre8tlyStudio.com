import { useState } from "react";
import { useAuth } from "../admin/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../sections/Footer.jsx";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://cre8tlystudio.com/api/auth/signup", formData);
      if (res.status === 201) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed. Please check your information.");
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
            Create Your Account
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Join Cre8tly Studio and start creating digital lead magnets instantly.
          </p>

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
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green text-white"
            />
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

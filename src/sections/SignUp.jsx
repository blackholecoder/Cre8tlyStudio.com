import { useState } from "react";
import { useAuth } from "../admin/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://cre8tlystudio.com/api/auth/signup", formData);

      if (res.status === 201) {
        // 👇 auto-login with the same credentials
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-gray to-neo p-6">
      <div className="bg-charcoal rounded-2xl shadow-xl p-8 max-w-md w-full border border-mutedGrey">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-neo text-white border border-mutedGrey focus:ring-2 focus:ring-green outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-neo text-white border border-mutedGrey focus:ring-2 focus:ring-green outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-neo text-white border border-mutedGrey focus:ring-2 focus:ring-green outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green to-royalPurple 
                       text-white font-bold py-3 rounded-lg 
                       hover:opacity-90 transition shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-silver text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

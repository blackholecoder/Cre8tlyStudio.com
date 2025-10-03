import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx"; // adjust path if needed

export default function LoginPage() {
    const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard"); // ✅ client-side navigation
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Invalid credentials");
      } else {
        console.error("Login error:", err.message);
        alert("Network error, please try again");
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-dark-gray to-neo min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-charcoal p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Log In</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 rounded mb-3 bg-neo text-white border border-mutedGrey"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 rounded mb-3 bg-neo text-white border border-mutedGrey"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded bg-gradient-to-r from-green to-royalPurple text-white font-bold hover:opacity-90"
        >
          Log In
        </button>
        <p className="text-center text-sm text-silver mt-3">
          🔒 Secure Login
        </p>
      </form>
      
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Footer from "../sections/Footer.jsx";
import CustomCursor from "../components/CustomCursor.jsx";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../api/axios";

export default function LoginPage() {
  const { login, saveAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fade, setFade] = useState(false);

  // 🔐 2FA step
  const [show2FA, setShow2FA] = useState(false);
  const [twofaCode, setTwofaCode] = useState("");
  const [twofaToken, setTwofaToken] = useState("");
  const [verifying, setVerifying] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(form.email, form.password);

      // 🔹 If the backend says 2FA is required, show the code prompt
      if (result?.requires2FA) {
        setTwofaToken(result.twofaToken);
        setShow2FA(true);
        setLoading(false);
        return;
      }

      // ✅ Normal login flow
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

  function encodeBase64URL(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

  const handlePasskeyLogin = async () => {
  try {
    const { email } = form;
    if (!email) {
      setError("Enter your email first to use Passkey login.");
      return;
    }

    // 1️⃣ Get challenge + credential request options
    const { data: options } = await axiosInstance.post("/auth/webauthn/login-options", { email });

    // 2️⃣ Ask browser for credential
    const credential = await navigator.credentials.get({
      publicKey: {
        ...options,
        challenge: Uint8Array.from(atob(options.challenge.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)),
        allowCredentials: options.allowCredentials.map(c => ({
          ...c,
          id: Uint8Array.from(atob(c.id.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)),
        })),
      },
    });

    // 3️⃣ Send response back to server
   const { data } = await axiosInstance.post("/auth/webauthn/login-verify", {
  email,
  assertionResp: {
    id: credential.id,
    rawId: encodeBase64URL(credential.rawId),
    type: credential.type,
    response: {
      authenticatorData: encodeBase64URL(credential.response.authenticatorData),
      clientDataJSON: encodeBase64URL(credential.response.clientDataJSON),
      signature: encodeBase64URL(credential.response.signature),
      userHandle: credential.response.userHandle
        ? encodeBase64URL(credential.response.userHandle)
        : null,
    },
  },
});

    if (data.success) {
      saveAuth(data.user, data.accessToken, data.refreshToken);
      navigate("/dashboard");
    } else {
      setError("Passkey login failed. Try again.");
    }
  } catch (err) {
    console.error("Passkey login error:", err);
    setError("Passkey login failed.");
  }
};


  const handleVerify2FA = async () => {
    if (!twofaCode.trim()) {
      setError("Enter the 6-digit code first.");
      return;
    }

    setVerifying(true);
    setError("");

    try {
      const res = await axiosInstance.post(
        "https://cre8tlystudio.com/api/auth/user/verify-login-2fa",
        {
          token: twofaCode,
          twofaToken,
        }
      );

      if (res.data.success) {
        // ✅ Use AuthContext's saveAuth so everything syncs
        saveAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
        navigate("/dashboard");
      } else {
        setError("Invalid 2FA code. Try again.");
      }
    } catch (err) {
      console.error("2FA verify error:", err);
      setError("Invalid or expired 2FA code.");
    } finally {
      setVerifying(false);
    }
  };

  // Fade-out error after 5s
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

          {!show2FA ? (
            // 🔹 Normal login form
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
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
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
              <button
                type="button"
                onClick={handlePasskeyLogin}
                className="w-full mt-2 bg-blue text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
              >
                Sign in with Passkey
              </button>
            </form>
          ) : (
            // 🔹 2FA verification screen
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-3 text-white">
                Two-Factor Authentication
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Enter the 6-digit code from your Authenticator app.
              </p>

              <input
                type="text"
                value={twofaCode}
                onChange={(e) => setTwofaCode(e.target.value)}
                placeholder="123456"
                maxLength="6"
                className="w-32 text-center py-2 px-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-green outline-none mb-4"
              />

              <button
                onClick={handleVerify2FA}
                disabled={verifying}
                className="w-full bg-green text-black font-semibold py-2 rounded-lg hover:opacity-90 transition"
              >
                {verifying ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          )}

          {!show2FA && (
            <>
              <p className="text-sm text-gray-400 text-center mt-4">
                <a
                  href="/forgot-password"
                  className="text-green hover:underline"
                >
                  Forgot Password?
                </a>
              </p>
              <p className="text-sm text-gray-400 text-center mt-6">
                Don’t have an account?{" "}
                <a href="/sign-up" className="text-green hover:underline">
                  Sign Up
                </a>
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

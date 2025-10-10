import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EntryRouter() {
  const navigate = useNavigate();
  const isTauri = Boolean(window.__TAURI__);

  useEffect(() => {
    // Wait until app is fully loaded before navigating
    const timer = setTimeout(() => {
      const token = localStorage.getItem("accessToken");

      if (isTauri) {
        console.log("🖥️ Running in Tauri environment");
        if (token) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } else {
        console.log("🌐 Running in browser environment");
        navigate("/home", { replace: true });
      }
    }, 250); // small delay ensures React Router is mounted

    return () => clearTimeout(timer);
  }, [navigate, isTauri]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#030712] text-white text-xl font-semibold">
      Loading Cre8tly Studio...
    </div>
  );
}

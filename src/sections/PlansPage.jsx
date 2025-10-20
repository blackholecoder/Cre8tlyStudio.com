// import { useState } from "react";
// import { toast } from "react-toastify";
// import api from "../api/axios";
// import { useAuth } from "../admin/AuthContext";

// export default function PlansPage() {
//   const [loadingPlan, setLoadingPlan] = useState(null);
//   const { user } = useAuth();

//  const handleSelectPlan = async (planType) => {
//   if (!user || !user.id) {
//     toast.error("Please sign in before selecting a plan");
//     return;
//   }

//   try {
//     setLoadingPlan(planType);
//     const token = localStorage.getItem("accessToken");

//     const res = await api.post(
//       "/checkout",
//       {
//         userId: user.id,
//         productType: planType === "pro" ? "pro_covers" : "basic",
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     window.location.href = res.data.url;
//   } catch (err) {
//     console.error("Checkout error:", err);
//     toast.error("Failed to start checkout session");
//     setLoadingPlan(null);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-16">
//       <h1 className="text-5xl font-extrabold mb-12 tracking-tight text-center">
//         Choose Your Plan
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
//         {/* ---------- Basic Plan ---------- */}
//         <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:shadow-[0_0_45px_rgba(147,51,234,0.7)] transition-all duration-500">
//           <div className="rounded-3xl bg-gradient-to-b from-gray-900 to-gray-800 p-10 flex flex-col justify-between min-h-[460px] text-center">
//             <div>
//               <h2 className="text-2xl font-semibold mb-3 text-white lead-text">
//                 Basic Creator
//               </h2>
//               <p className="text-gray-400 mb-4 text-sm leading-relaxed">
//                 Includes <span className="text-white font-medium lead-text">5 lead magnet slots </span> 
//                 and access to all standard lead magnet templates.
//               </p>
//               <p className="text-4xl font-extrabold mb-6 text-white lead-text">$47</p>
//             </div>

//             <button
//               onClick={() => handleSelectPlan("basic")}
//               disabled={loadingPlan === "basic"}
//               className={`mt-auto py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg ${
//                 loadingPlan === "basic"
//                   ? "opacity-50 cursor-not-allowed bg-gray-700"
//                   : "bg-royalPurple hover:bg-purple-800 hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] text-white"
//               }`}
//             >
//               {loadingPlan === "basic" ? "Redirecting..." : "Select Basic Plan"}
//             </button>
//           </div>
//         </div>

//         {/* ---------- Pro Covers ---------- */}
//         <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 shadow-[0_0_25px_rgba(0,255,153,0.3)] hover:shadow-[0_0_45px_rgba(0,255,153,0.6)] transition-all duration-500">
//           <div className="rounded-3xl bg-gradient-to-b from-gray-900 to-gray-800 p-10 flex flex-col justify-between min-h-[460px] text-center">
//             <div>
//               <h2 className="text-2xl font-semibold mb-3 text-green-400 lead-text">
//                 Pro Covers
//               </h2>
//               <p className="text-gray-300 mb-4 text-sm leading-relaxed lead-text">
//                 Everything in Basic plus 
//                 <span className="text-white font-medium lead-text"> unlimited custom cover uploads </span> 
//                 for your lead magnets.
//               </p>
//               <p className="text-4xl font-extrabold mb-6 text-green lead-text">
//                 $120 One-Time
//               </p>
//             </div>

//             <button
//               onClick={() => handleSelectPlan("pro")}
//               disabled={loadingPlan === "pro"}
//               className={`mt-auto py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg ${
//                 loadingPlan === "pro"
//                   ? "opacity-50 cursor-not-allowed bg-gray-700"
//                   : "bg-headerGreen hover:bg-green-700 hover:shadow-[0_0_25px_rgba(0,255,153,0.6)] text-white lead-text"
//               }`}
//             >
//               {loadingPlan === "pro" ? "Redirecting..." : "Upgrade to Pro Covers"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <p className="text-gray-500 text-sm mt-10 text-center">
//         🔒 Secure Checkout 
//       </p>
//     </div>
//   );
// }
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../admin/AuthContext";
import PlanDetailsModal from "../components/PlansDetailModal";
import CustomCursor from "../components/CustomCursor";


export default function PlansPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();

  const handleSelectPlan = async (planType) => {
    if (!user || !user.id) {
      toast.error("Please sign in before selecting a plan");
      return;
    }

    try {
      setLoadingPlan(planType);
      const token = localStorage.getItem("accessToken");

      const res = await api.post(
        "/checkout",
        {
          userId: user.id,
          productType: planType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout session");
      setLoadingPlan(null);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-16">
      <CustomCursor />
      <h1 className="text-5xl font-extrabold mb-12 tracking-tight text-center">
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* ---------- Basic Plan ---------- */}
        <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:shadow-[0_0_45px_rgba(147,51,234,0.7)] transition-all duration-500">
          <div className="rounded-3xl bg-gradient-to-b from-gray-900 to-gray-800 p-10 flex flex-col justify-between min-h-[460px] text-center">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-white">Basic Creator</h2>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                Includes <span className="text-white font-medium">5 lead magnet slots</span> and access to all standard templates.
                Turn ideas into irresistible lead magnets fast.
              </p>
              <button
                onClick={() => setSelectedPlan("basic")}
                className="text-blue-400 text-sm hover:underline mb-3"
              >
                Learn More
              </button>
              <p className="text-4xl font-extrabold mb-6 text-white">$47</p>
            </div>

            <button
              onClick={() => handleSelectPlan("basic")}
              disabled={loadingPlan === "basic"}
              className={`mt-auto py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                loadingPlan === "basic"
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "bg-royalPurple hover:bg-purple-800 hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] text-white"
              }`}
            >
              {loadingPlan === "basic" ? "Redirecting..." : "Select Basic Plan"}
            </button>
          </div>
        </div>

        {/* ---------- Pro Covers ---------- */}
        <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 shadow-[0_0_25px_rgba(0,255,153,0.3)] hover:shadow-[0_0_45px_rgba(0,255,153,0.6)] transition-all duration-500">
          <div className="rounded-3xl bg-gradient-to-b from-gray-900 to-gray-800 p-10 flex flex-col justify-between min-h-[460px] text-center">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-green-400">Pro Covers</h2>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Everything in Basic plus <span className="text-white font-medium">unlimited custom cover uploads</span> for your lead magnets. Single purchase unlocks pro covers for lifetime.
              </p>
              <button
                onClick={() => setSelectedPlan("pro")}
                className="text-green-400 text-sm hover:underline mb-3"
              >
                Learn More
              </button>
              <p className="text-4xl font-extrabold mb-6 text-green-400">$150 One-Time</p>
            </div>

            <button
              onClick={() => handleSelectPlan("pro")}
              disabled={loadingPlan === "pro"}
              className={`mt-auto py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                loadingPlan === "pro"
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "bg-headerGreen hover:bg-green-700 hover:shadow-[0_0_25px_rgba(0,255,153,0.6)] text-white"
              }`}
            >
              {loadingPlan === "pro" ? "Redirecting..." : "Upgrade to Pro Covers"}
            </button>
          </div>
        </div>

        {/* ---------- Author’s Assistant ---------- */}
        <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 shadow-[0_0_25px_rgba(255,105,180,0.3)] hover:shadow-[0_0_45px_rgba(255,105,180,0.6)] transition-all duration-500">
          <div className="rounded-3xl bg-gradient-to-b from-gray-900 to-gray-800 p-10 flex flex-col justify-between min-h-[460px] text-center">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-pink-400">Author’s Assistant</h2>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                AI-powered co-writer that helps you structure, write, and edit up to 750 pages while keeping your unique voice.
              </p>
              <button
                onClick={() => setSelectedPlan("author")}
                className="text-pink-400 text-sm hover:underline mb-3"
              >
                Learn More
              </button>
              <p className="text-4xl font-extrabold mb-6 text-pink-400">$850 One-Book</p>
            </div>

            <button
              onClick={() => handleSelectPlan("author")}
              disabled={loadingPlan === "author"}
              className={`mt-auto py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                loadingPlan === "author"
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "bg-pink-600 hover:bg-pink-700 hover:shadow-[0_0_25px_rgba(255,105,180,0.6)] text-white"
              }`}
            >
              {loadingPlan === "author" ? "Redirecting..." : "Select Author’s Assistant"}
            </button>
          </div>
        </div>

        {/* ---------- All-In-One Bundle ---------- */}
        <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:shadow-[0_0_45px_rgba(255,215,0,0.6)] transition-all duration-500">
          <div className="rounded-3xl bg-gradient-to-b from-gray-900 to-gray-800 p-10 flex flex-col justify-between min-h-[460px] text-center">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-yellow-300">
                All-In-One Bundle
              </h2>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Includes <span className="text-white font-medium">Basic, Pro Covers, and Author’s Assistant</span> in one discounted package.
              </p>
              <button
                onClick={() => setSelectedPlan("bundle")}
                className="text-yellow-300 text-sm hover:underline mb-3"
              >
                Learn More
              </button>
              <p className="text-4xl font-extrabold mb-6 text-yellow-300">$999</p>
            </div>

            <button
              onClick={() => handleSelectPlan("bundle")}
              disabled={loadingPlan === "bundle"}
              className={`mt-auto py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                loadingPlan === "bundle"
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "bg-yellow hover:bg-yellow hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] text-black font-bold"
              }`}
            >
              {loadingPlan === "bundle" ? "Redirecting..." : "Get the Full Bundle"}
            </button>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PlanDetailsModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}

      <p className="text-gray-500 text-sm mt-10 text-center">🔒 Secure Checkout</p>
    </div>
  );
}

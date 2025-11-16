import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "../../admin/AuthContext";
import axiosInstance from "../../api/axios";
import DashboardLayout from "../../components/layouts/DashboardLayout";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.stripe_connect_account_id) {
      setLoading(false);
      return;
    }

    const fetchSellerData = async () => {
      try {
        const [balanceRes, payoutsRes] = await Promise.all([
          axiosInstance.get(
            `https://cre8tlystudio.com/api/seller/balance/${user.stripe_connect_account_id}`
          ),
          axiosInstance.get(
            `https://cre8tlystudio.com/api/seller/payouts/${user.stripe_connect_account_id}`
          ),
        ]);

        setBalance(balanceRes.data.balance);
        setPayouts(payoutsRes.data.payouts || []);
      } catch (err) {
        console.error("❌ Error fetching seller data:", err);
        toast.error("Failed to load seller info.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user?.stripe_connect_account_id]);

  const handleOpenStripeDashboard = async () => {
    try {
      const res = await axiosInstance.post(
        "https://cre8tlystudio.com/api/seller/stripe-dashboard",
        { accountId: user.stripe_connect_account_id }
      );
      window.open(res.data.url, "_blank");
    } catch (err) {
      console.error("Stripe Dashboard Error:", err);
      toast.error("Unable to open Stripe dashboard.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading seller data...
      </div>
      </DashboardLayout>
    );
  }

  if (!user?.stripe_connect_account_id) {
    return (
      <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-300">
        <h1 className="text-2xl font-bold mb-3">No Stripe Account Connected</h1>
        <p className="text-gray-400 text-center mb-6 max-w-md">
          You need to connect your Stripe account in{" "}
          <span className="text-green font-semibold">Settings</span> to view
          your seller dashboard and payouts.
        </p>
        <button
          onClick={() => (window.location.href = "/settings")}
          className="px-6 py-3 rounded-lg bg-green text-black font-semibold hover:opacity-90 transition"
        >
          Go to Settings
        </button>
      </div>
      </DashboardLayout>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 text-white"
    >
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {/* 💰 Balance Overview */}
      {balance ? (
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-400 text-sm mb-1">Available Balance</h3>
            <p className="text-2xl font-bold text-green">
              ${(balance.available / 100 || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-400 text-sm mb-1">Pending Balance</h3>
            <p className="text-2xl font-bold text-yellow-400">
              ${(balance.pending / 100 || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 shadow-lg flex items-center justify-center">
            <button
              onClick={handleOpenStripeDashboard}
              className="px-6 py-2 bg-green text-black font-semibold rounded-lg hover:opacity-90 transition"
            >
              Open Stripe Dashboard
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mb-6">
          No balance data found for this account.
        </p>
      )}

      {/* 📅 Payout History */}
      <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Payouts
        </h2>
        {payouts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Arrival</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-800 hover:bg-gray-800/30"
                  >
                    <td className="py-2 px-3">
                      {new Date(p.created * 1000).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 font-semibold">
                      ${(p.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          p.status === "paid"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {new Date(p.arrival_date * 1000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No payouts have been made yet.
          </p>
        )}
      </div>
    </motion.div>
  );
}

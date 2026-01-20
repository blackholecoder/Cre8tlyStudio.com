import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "../../admin/AuthContext";
import axiosInstance from "../../api/axios";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ThankYouModal from "../../components/seller/ThankYouModal";
import { Check, Landmark } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [thankYouMessage, setThankYouMessage] = useState("");
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    if (!user?.stripe_connect_account_id) {
      setLoading(false);
      return;
    }

    const fetchSellerData = async () => {
      try {
        const [balanceRes, payoutsRes, salesRes] = await Promise.all([
          axiosInstance.get(
            `/seller/balance/${user.stripe_connect_account_id}`
          ),
          axiosInstance.get(
            `/seller/payouts/${user.stripe_connect_account_id}`
          ),
          axiosInstance.get(`/seller/sales/${user.id}?page=${page}&limit=20`),
        ]);

        setBalance(balanceRes.data.balance);
        setPayouts(payoutsRes.data.payouts || []);
        setPages(salesRes.data.pages || 1);
        setSales(salesRes.data.sales || []);
      } catch (err) {
        console.error("❌ Error fetching seller data:", err);
        toast.error("Failed to load seller info.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user?.stripe_connect_account_id, page]);

  const handleOpenStripeDashboard = async () => {
    try {
      const res = await axiosInstance.post("/seller/stripe-dashboard", {
        accountId: user.stripe_connect_account_id,
      });
      window.open(res.data.url, "_blank");
    } catch (err) {
      console.error("Stripe Dashboard Error:", err);
      toast.error("Unable to open Stripe dashboard.");
    }
  };

  const handleGenerateThankYou = async (sale) => {
    try {
      setLoadingMessage(true);
      setShowThankYouModal(true);
      setCurrentSaleId(sale.id);

      const res = await axiosInstance.post("/seller/generate-thank-you", {
        saleId: sale.id,
        buyerEmail: sale.buyer_email,
        productName: sale.product_name,
      });

      if (res.data.success) {
        setThankYouMessage(res.data.message); // FIXED
      } else {
        setThankYouMessage("AI could not generate a message."); // FIXED
      }
    } catch (err) {
      console.error(err);
      setThankYouMessage("AI generation failed."); // FIXED
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleMarkThankYouSent = async (saleId) => {
    try {
      const res = await axiosInstance.post("/seller/mark-thank-you-sent", {
        saleId,
      });

      if (res.data.success) {
        // update UI without refresh
        setSales((prev) =>
          prev.map((s) => (s.id === saleId ? { ...s, thank_you_sent: 1 } : s))
        );

        toast.success("Thank-you marked as sent");
        setShowThankYouModal(false);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("❌ Error marking thank-you sent:", err);
      toast.error("Server error");
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
        <div className="flex flex-col items-center justify-center min-h-screen text-dashboard-text-light dark:text-dashboard-text-dark">
          <h1 className="text-2xl font-bold mb-3">
            No Stripe Account Connected
          </h1>
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
      className="
      p-8
      text-dashboard-text-light
      dark:text-dashboard-text-dark
      bg-dashboard-bg-light
      dark:bg-dashboard-bg-dark
  "
    >
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold normal-case">Seller Dashboard</h1>
        <Landmark
          size={22}
          className="
        text-dashboard-muted-light
        dark:text-green
  "
        />
      </div>
      {/* 💰 Balance Overview */}
      {balance ? (
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div
            className="bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg"
          >
            <h3
              className="text-dashboard-muted-light
            dark:text-dashboard-muted-dark text-sm mb-1"
            >
              Available Balance
            </h3>
            <p className="text-2xl font-bold text-green">
              ${(balance.available / 100 || 0).toFixed(2)}
            </p>
          </div>
          <div
            className="bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg"
          >
            <h3
              className="text-dashboard-muted-light
            dark:text-dashboard-muted-dark text-sm mb-1"
            >
              Pending Balance
            </h3>
            <p className="text-2xl font-bold text-yellow-400">
              ${(balance.pending / 100 || 0).toFixed(2)}
            </p>
          </div>
          <div
            className="bg-dashboard-sidebar-light
          dark:bg-dashboard-sidebar-dark
          border border-dashboard-border-light
          dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg flex items-center justify-center"
          >
            <button
              onClick={handleOpenStripeDashboard}
              className="px-6 py-2 bg-green text-black font-semibold rounded-lg hover:opacity-90 transition"
            >
              Open Stripe Dashboard
            </button>
          </div>
        </div>
      ) : (
        <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark mb-6">
          No balance data found for this account.
        </p>
      )}

      {/* 📅 Payout History */}
      <div
        className="bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light
      dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-dashboard-text-light dark:text-dashboard-text-dark mb-4">
          Recent Payouts
        </h2>
        {payouts.length > 0 ? (
          <>
            {/* ✅ Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table
                className="min-w-full text-sm text-left text-dashboard-text-light
                dark:text-dashboard-text-dark"
              >
                <thead>
                  <tr
                    className="border-b border-gray-700 text-dashboard-muted-light
                  dark:text-dashboard-muted-dark uppercase text-xs"
                  >
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
                      className="border-b border-gray-800 hover:bg-dashboard-hover-light
                      dark:hover:bg-dashboard-hover-dark"
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

            {/* ✅ Mobile cards */}
            <div className="md:hidden space-y-4">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark
                rounded-xl p-4 shadow-md"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      Date
                    </span>
                    <span>
                      {new Date(p.created * 1000).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      Amount
                    </span>
                    <span className="font-semibold">
                      ${(p.amount / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      Status
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        p.status === "paid"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-dashboard-muted-light dark:text-dashboard-muted-dark">
                      Arrival
                    </span>
                    <span>
                      {new Date(p.arrival_date * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-sm">
            No payouts have been made yet.
          </p>
        )}
      </div>
      <div
        className="bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light
      dark:border-dashboard-border-dark rounded-xl p-6 shadow-lg mt-10"
      >
        <h2 className="text-xl font-semibold text-dashboard-text-light dark:text-dashboard-text-dark mb-4">
          Recent Sales
        </h2>

        {sales.length > 0 ? (
          <>
            {/* ✅ Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table
                className="min-w-full text-sm text-left text-dashboard-text-light
                dark:text-dashboard-text-dark"
              >
                <thead>
                  <tr
                    className="border-b border-gray-700 text-dashboard-muted-light
                    dark:text-dashboard-muted-dark uppercase text-xs"
                  >
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3">Buyer Email</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Email Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-800 hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
                    >
                      <td className="py-2 px-3 font-semibold">
                        {s.product_name}
                      </td>
                      <td className="py-2 px-3">{s.buyer_email}</td>
                      <td className="py-2 px-3">
                        {new Date(s.delivered_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-3">
                        {s.thank_you_sent ? (
                          <Check className="w-5 h-5 text-green" />
                        ) : (
                          <button
                            onClick={() => handleGenerateThankYou(s)}
                            className="text-green hover:text-green/70 underline"
                          >
                            Auto-Gen Thank You
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Mobile cards */}
            <div className="md:hidden space-y-4">
              {sales.map((s) => (
                <div
                  key={s.id}
                  className="bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border border-dashboard-border-light
                dark:border-dashboard-border-dark rounded-xl p-4 shadow-md"
                >
                  <div className="mb-2">
                    <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
                      Product
                    </p>
                    <p className="text-sm font-semibold text-dashboard-text-light dark:text-dashboard-text-dark">
                      {s.product_name}
                    </p>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
                      Buyer
                    </p>
                    <p className="text-sm text-dashboard-text-light dark:text-dashboard-text-dark break-all">
                      {s.buyer_email}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
                      Date
                    </p>
                    <p className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark mb-1">
                      {new Date(s.delivered_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-dashboard-border-light dark:border-dashboard-border-dark">
                    <span className="text-xs text-gray-400">Thank You</span>

                    {s.thank_you_sent ? (
                      <span className="flex items-center gap-1 text-green text-sm font-semibold">
                        <Check className="w-4 h-4" />
                        Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleGenerateThankYou(s)}
                        className="text-green text-sm font-semibold hover:text-green/70 underline"
                      >
                        Auto-Gen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-sm">
            No sales yet.
          </p>
        )}
      </div>
      {sales.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-6">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-dashboard-muted-light dark:text-dashboard-muted-dark cursor-not-allowed"
                : "bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark text-dashboard-text-light dark:text-dashboard-text-dark hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            }`}
          >
            Prev
          </button>

          {/* Page status */}
          <span className="text-dashboard-text-light dark:text-dashboard-text-dark text-sm">
            Page {page} of {pages}
          </span>

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className={`px-4 py-2 rounded-lg ${
              page === pages
                ? "bg-dashboard-hover-light dark:bg-dashboard-hover-dark text-dashboard-muted-light dark:text-dashboard-muted-dark cursor-not-allowed"
                : "bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark text-dashboard-text-light dark:text-dashboard-text-dark hover:bg-dashboard-hover-light dark:hover:bg-dashboard-hover-dark"
            }`}
          >
            Next
          </button>
        </div>
      )}

      <ThankYouModal
        visible={showThankYouModal}
        message={thankYouMessage}
        setMessage={setThankYouMessage}
        onClose={() => setShowThankYouModal(false)}
        loading={loadingMessage}
        onMarkSent={() => handleMarkThankYouSent(currentSaleId)}
      />
    </motion.div>
  );
}

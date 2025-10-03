import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../admin/AuthContext";

const PricingSection = () => {
  const { user, accessToken } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      // 🚨 Redirect to signup/login if not logged in
      window.location.href = "/sign-up";
      return;
    }

    try {
      const { data } = await axios.post(
        "https://cre8tlystudio.com/api/checkout",
        {
          userId: user.id, // ✅ safe because we know user exists
          priceId: "price_1SDdfNAZ83PYnpjWaf6rukfU",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // optional
        }
      );
      window.location.href = data.url; // ✅ send to Stripe Checkout
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed");
    }
  };

  return (
    <section id="pricing" className="px-6 py-24 text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-4xl mb-10 lead-text">Simple Pricing</h3>

        <motion.div
          className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-xl max-w-md mx-auto p-10 border border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue to-purple-500 bg-clip-text text-white">
            $47
          </p>
          <p className="text-gray-400 mb-8 lead-text">
            One-time payment for 5 lead magnet slots
          </p>

          <button
            onClick={handleCheckout}
            className="w-full bg-royalPurple 
                       text-white text-lg font-semibold py-4 rounded-xl 
                       hover:opacity-90 hover:shadow-[0_0_20px_rgba(123,237,159,0.6)] 
                       transition shadow-lg lead-text"
          >
            {user ? "Pay & Generate PDF" : "Sign Up to Purchase"}
          </button>
        </motion.div>

        <p className="text-center text-sm text-silver mt-3">
          🔒 Secure checkout
        </p>
      </div>
    </section>
  );
};

export default PricingSection;

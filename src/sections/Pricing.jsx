import { motion } from "framer-motion";
import { useAuth } from "../admin/AuthContext";

const PricingSection = () => {
  const { user } = useAuth();

  const handleSignUpRedirect = () => {
    // ✅ Always send users to /plans instead of Stripe
    window.location.href = "/sign-up";
  };

  return (
    <section id="pricing" className="px-6 py-24 text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-4xl mb-10 lead-text">Simple Pricing</h3>

        <motion.div
          className="relative rounded-2xl max-w-md mx-auto overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* animated pulsing border */}
          <div
            className="absolute inset-0 p-[2px] rounded-2xl 
              bg-[linear-gradient(90deg,#00ff99,#7bed9f,#00ff99)] 
              bg-[length:200%_200%] 
              animate-gradientPulse"
          >
            <div className="w-full h-full rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800" />
          </div>

          {/* card content */}
          <div className="relative z-10 p-10 border border-transparent rounded-2xl shadow-xl">
            <p className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue to-purple-500 bg-clip-text text-white">
              $47
            </p>
            <p className="text-gray-400 mb-8 lead-text">
              One-time payment for 5 lead magnet slots
            </p>

            <button
              onClick={handleSignUpRedirect}
              className="w-full bg-royalPurple 
                text-white text-lg font-semibold py-4 rounded-xl 
                hover:opacity-90 hover:shadow-[0_0_20px_rgba(123,237,159,0.6)] 
                transition shadow-lg lead-text"
            >
              {user ? "Sign Up Now" : "Sign Up Now"}
            </button>
          </div>
        </motion.div>

        <p className="text-center text-sm text-silver mt-3">
          🔒 Secure checkout
        </p>
      </div>
    </section>
  );
};

export default PricingSection;

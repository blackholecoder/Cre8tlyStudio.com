import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../admin/AuthContext";
import OutOfSlotsModal from "../components/dashboard/OutOfSlotModal";

const PricingSection = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleSignUpRedirect = () => {
    const refSlug = localStorage.getItem("ref_slug"); // read the slug correctly

    if (refSlug) {
      window.location.href = `/sign-up?ref=${refSlug}`;
    } else {
      window.location.href = "/sign-up";
    }
  };

  const handleUpgradeRedirect = () => {
    window.location.href = "/plans";
  };

  const isFreeTier =
    user?.has_free_magnet === 1 &&
    user?.magnet_slots === 1 &&
    !user?.has_magnet;

  return (
    <section id="pricing" className="px-6 py-24 text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-4xl mb-10 design-text">
          Start Free, Upgrade When You're Ready
        </h3>

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
            <div className="w-full h-full rounded-2xl bg-[#0d0d0d]" />
          </div>

          {/* card content */}
          <div className="relative z-10 p-10 border border-transparent rounded-2xl shadow-xl">
            {/* --- Free Trial Section --- */}
            {!user || isFreeTier ? (
              <>
                <p className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-green to-royalPurple bg-clip-text text-transparent design-text">
                  Start Free
                  <br />
                </p>

                <p className="text-gray-300 text-lg font-medium mb-6">
                  Try Cre8tly Studio free for 7 days — includes 1 lead magnet
                  slot (up to 5 pages).
                </p>

                <button
                  onClick={handleSignUpRedirect}
                  className="w-full bg-gradient-to-r from-green to-royalPurple
                    text-black text-xl font-semibold py-4 rounded-xl 
                    hover:opacity-90 hover:shadow-[0_0_25px_rgba(0,255,170,0.4)]
                    transition shadow-lg design-text"
                >
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                </button>

                <div className="border-t border-gray-800 my-8"></div>
              </>
            ) : null}

            {/* --- Paid Upgrade Section --- */}
            <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue to-purple-400 bg-clip-text text-transparent design-text">
              Unlock Full Access
            </p>

            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Unlock every tool inside Cre8tly Studio, advanced design,
              automation, selling features, and complete creative freedom for
              your brand.
            </p>

            <button
              onClick={handleUpgradeRedirect}
              className="w-full bg-gray-800 border border-green text-green font-semibold py-3 rounded-xl hover:bg-green hover:text-black transition"
            >
              See Pricing
            </button>
          </div>
        </motion.div>

        <p className="text-center text-sm text-gray-700 mt-3">
          🔒 Secure checkout · No credit card required for free trial
        </p>
      </div>

      <OutOfSlotsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        isFirstTime={!user || !user.slot_count || user.slot_count === 0}
      />
    </section>
  );
};

export default PricingSection;

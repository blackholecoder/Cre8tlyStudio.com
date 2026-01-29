import { motion } from "framer-motion";
import {
  Zap,
  CreditCard,
  Banknote,
  ShieldCheck,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ======================
   Motion Variants
====================== */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const floatSlow = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function StripePayments() {
  const navigate = useNavigate();

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  return (
    <main className="relative w-full min-h-screen bg-white pt-32 pb-32 px-6">
      {/* background glow */}
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-green/10 blur-3xl pointer-events-none"
        variants={floatSlow}
        animate="animate"
      />

      {/* ======================
          HERO
      ====================== */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto text-center mb-32"
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black design-text mb-6"
        >
          Accept payments instantly with Stripe
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="max-w-2xl mx-auto text-black/80 text-lg mb-10"
        >
          The Messy Attic connects Stripe directly to your products so you can
          get paid without friction.
        </motion.p>

        <motion.button
          onClick={() => navigateWithReferral("/plans")}
          variants={fadeUp}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-black text-white font-semibold text-lg shadow-lg"
        >
          Start selling with Stripe
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </motion.section>

      {/* ======================
          FEATURES GRID
      ====================== */}
      <section className="relative max-w-6xl mx-auto mb-40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green/10 via-transparent to-transparent blur-3xl rounded-[40px]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap />,
              title: "Launch faster",
              text: "Create an offer and start accepting payments the same day.",
              accent: "from-green to-emerald-400",
            },
            {
              icon: <CreditCard />,
              title: "Checkout that converts",
              text: "Stripe Checkout is trusted worldwide and optimized for sales.",
              accent: "from-indigo-500 to-purple-500",
            },
            {
              icon: <Banknote />,
              title: "Automatic payouts",
              text: "Funds are deposited directly into your bank account.",
              accent: "from-emerald-400 to-green",
            },
            {
              icon: <ShieldCheck />,
              title: "Enterprise security",
              text: "Fraud protection and compliance handled by Stripe.",
              accent: "from-slate-600 to-slate-800",
            },
            {
              icon: <Globe />,
              title: "Sell globally",
              text: "Accept payments worldwide without extra setup.",
              accent: "from-cyan-500 to-blue-600",
            },
            {
              icon: <Zap />,
              title: "Instant delivery",
              text: "Products are delivered automatically after purchase.",
              accent: "from-green to-lime-400",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-[28px] p-[1px] overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-40 group-hover:opacity-100 transition`}
              />

              <div className="relative h-full rounded-[27px] bg-black text-white p-8 flex flex-col justify-between">
                <motion.div
                  className="flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 text-green mb-6"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  {item.icon}
                </motion.div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.text}</p>
                </div>

                <div className="mt-8 h-[2px] w-0 bg-green group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======================
          HOW IT WORKS
      ====================== */}
      <section className="relative max-w-6xl mx-auto mb-40">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-green/10 blur-3xl rounded-full -z-10" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-extrabold text-black mb-4"
          >
            Create an offer. Connect Stripe. Get paid.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-3xl mx-auto text-lg text-black/70"
          >
            Build your offer, add it to your landing page, connect Stripe
            Express, and start accepting payments in minutes.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {[
            {
              step: "01",
              title: "Create your offer",
              text: "Set pricing, upload content, and define what buyers receive.",
            },
            {
              step: "02",
              title: "Add it to your page",
              text: "Drop the offer onto your landing page instantly.",
            },
            {
              step: "03",
              title: "Connect Stripe Express",
              text: "Fast onboarding with secure identity and bank setup.",
            },
            {
              step: "04",
              title: "Get paid automatically",
              text: "Stripe processes payments and deposits funds directly.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl p-[1px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green via-emerald-400 to-lime-300 opacity-30 group-hover:opacity-60 transition" />

              <div className="relative h-full rounded-[22px] bg-white p-8 text-left shadow-md hover:shadow-xl transition">
                <div className="text-sm font-bold text-gray-400 mb-3">
                  STEP {item.step}
                </div>

                <h3 className="text-2xl font-bold text-black mb-3">
                  {item.title}
                </h3>

                <p className="text-black/70 leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 text-center">
          <p className="text-lg text-black/80 mb-4">
            Your money never sits in The Messy Attic
          </p>

          <p className="max-w-2xl mx-auto text-black/60">
            Stripe handles payments and deposits funds directly to your bank.
            Standard payouts arrive in 2 to 3 business days.
          </p>
        </div>
      </section>

      {/* ======================
          FINAL CTA
      ====================== */}
      <section className="max-w-6xl mx-auto text-center">
        <div className="rounded-3xl bg-black text-white px-10 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to start getting paid
          </h2>

          <p className="max-w-xl mx-auto text-white/80 mb-10">
            Connect Stripe once and sell every product you create inside Cre8tly
            Studio.
          </p>

          <motion.button
            onClick={() => navigateWithReferral("/plans")}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 0 rgba(0,0,0,0)",
                "0 0 30px rgba(34,197,94,0.6)",
                "0 0 0 rgba(0,0,0,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-green text-black font-semibold text-lg"
          >
            Get started for free
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </section>
    </main>
  );
}

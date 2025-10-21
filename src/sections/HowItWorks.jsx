import { Bot, Download, SquareTerminal} from "lucide-react";
import { motion } from "framer-motion";
import PricingSection from "./Pricing";



const steps = [
  {
    icon: (
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <SquareTerminal className="w-10 h-10 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
      </motion.div>
    ),
    title: "1. Add Your Prompt",
    desc: "Describe your audience, product, or idea in one line, our AI expands it into full content instantly.",
  },
  {
    icon: (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
      >
        <Bot className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(103,15,231,0.6)]" />
      </motion.div>
    ),
    title: "2. AI Creates Your Digital Product",
    desc: "We generate up to 50 full A4 pages with examples, insights, and structure, styled with professional themes.",
  },
  {
    icon: (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <Download className="w-10 h-10 text-green drop-shadow-[0_0_8px_rgba(123,237,159,0.6)]" />
      </motion.div>
    ),
    title: "3. Download & Launch",
    desc: "Receive a polished PDF ready to use instantly, perfect for selling, sharing, or capturing new leads.",
  },
];


export default function HowItWorks() {
  return (
    <section id="how" className="px-6 py-24 text-center bg-metalBlack relative overflow-hidden rounded-2xl">
      {/* Faint animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0b0f1a] via-[#111827] to-[#0b0f1a] opacity-40"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <h3 className="text-4xl mb-16 text-white font-semibold design-text">How It Works</h3>

        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-xl overflow-hidden"
            >
              {/* Glowing animated border */}
              <div
                className="absolute inset-0 rounded-xl p-[2px] 
                bg-[linear-gradient(270deg,#7bed9f,#670fe7,#7bed9f)] 
                bg-[length:300%_300%] animate-shine"
              >
                <div className="w-full h-full rounded-xl bg-[#0d0d0d]" />
              </div>

              {/* Card content */}
              <div className="relative z-10 p-8 rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6 mx-auto shadow-[0_0_20px_rgba(100,255,200,0.25)]">
                  {step.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white lead-text">{step.title}</h4>
                <p className="text-gray-300 leading-relaxed lead-text">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <PricingSection />
      </div>
    </section>
  );
}

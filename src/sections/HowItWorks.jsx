import { Edit3, FileOutput, ArrowDownCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Edit3 className="w-10 h-10 text-whote" />,
    title: "1. Add Your Prompt",
    desc: "Describe your audience or offer in one line.",
  },
  {
    icon: <FileOutput className="w-10 h-10 text-white" />,
    title: "2. We Generate PDF",
    desc: "Our AI creates a polished lead magnet instantly.",
  },
  {
    icon: <ArrowDownCircle className="w-10 h-10 text-green" />,
    title: "3. Download & Sell",
    desc: "Get your file and start capturing leads today.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.3, ease: "linear" },
  },
};

export default function HowItWorks() {
  return (
    <section id="how" className="px-6 py-24 text-center bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-4xl mb-16 text-white lead-text">How It Works</h3>

        <motion.div
          className="grid gap-10 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="p-8 bg-gradient-to-b from-green via-royalPurple to-dark-gray 
rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition"
              variants={card}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6 mx-auto">
                {step.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3 text-white lead-text">
                {step.title}
              </h4>
              <p className="text-gray-300 leading-relaxed lead-text">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

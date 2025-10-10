import { Edit3, FileOutput, ArrowDownCircle } from "lucide-react";

const steps = [
  {
    icon: <Edit3 className="w-10 h-10 text-white" />,
    title: "1. Add Your Prompt",
    desc: "Describe your audience, product, or idea in one line, our AI is built to expand it into full content.",
  },
  {
    icon: <FileOutput className="w-10 h-10 text-white" />,
    title: "2. AI Creates Your Lead Magnet",
    desc: "We generate up to 25 full A4 pages with examples, insights, and structure, styled with professional themes.",
  },
  {
    icon: <ArrowDownCircle className="w-10 h-10 text-green" />,
    title: "3. Download & Launch",
    desc: "Receive a polished PDF ready to use instantly, perfect for selling, sharing, or capturing new leads.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="px-6 py-24 text-center bg-[#0b0f1a]
"
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="text-4xl mb-16 text-white lead-text">How It Works</h3>

        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden">
              {/* Animated green/yellow border */}
              <div
                className="absolute inset-0 rounded-xl p-[2px] 
                  bg-[linear-gradient(270deg,#7bed9f,#670fe7,#7bed9f)] 
                  bg-[length:300%_300%] animate-shine"
              >
                <div className="w-full h-full rounded-xl bg-[#0d0d0d]" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6 mx-auto">
                  {step.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white lead-text">
                  {step.title}
                </h4>
                <p className="text-gray-300 leading-relaxed lead-text">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  brandIdentity,
  smartPrompt,
  smartPromptBlank,
  editPrompt,
  docType,
  unsplash,
  customLogo,
  themes,
  fonts,
  ctaCard,
  promptMemory,
  presets,
  liveEdit,
  designCanvas,
} from "../../assets/images";
import { motion } from "framer-motion";

export default function SmartPromptPage() {
  const navigate = useNavigate();

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  const textVariant = (isEven) => ({
    hidden: {
      opacity: 0,
      x: isEven ? 60 : -60,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  });

  const imageVariant = (isEven) => ({
    hidden: {
      opacity: 0,
      x: isEven ? -60 : 60,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  });

  const steps = [
    {
      title: "Start With a Simple Idea",
      description:
        "Begin with a rough idea or goal. Smart Prompt helps you turn vague thoughts into structured, actionable prompts.",
      image: smartPromptBlank,
    },
    {
      title: "Define the Outcome",
      description:
        "Clarify what you want to achieve. Smart Prompt focuses the intent so every output serves a clear purpose.",
      image: smartPrompt,
    },
    {
      title: "Apply Brand Voice",
      description:
        "Tone, style, and formatting align with your brand automatically.",
      image: brandIdentity,
    },
    {
      title: "Structure the Prompt",
      description:
        "Your idea is broken into sections, instructions, and constraints for consistent results.",
      image: editPrompt,
    },
    {
      title: "Optimize for Content Type",
      description:
        "Smart Prompt adapts based on whether you are creating pro documents to high-converting lead magnets offers.",
      image: docType,
    },
    {
      title: "Never Worry About Image Licensing",
      description:
        "Access over 5 million Unsplash images that are copyright free and approved for commercial use, built directly into your workflow.",
      image: unsplash,
    },
    {
      title: "Apply Custom Branding Automatically",
      description:
        "Add your logo, brand colors, and styling directly to your PDF so every document looks polished, professional, and on brand.",
      image: customLogo,
    },

    {
      title: "Design With Your Own Style",
      description:
        "Control background colors and themes so your content always looks intentional and on brand.",
      image: themes,
    },
    {
      title: "Typography That Matches Your Brand",
      description:
        "Use custom fonts to give your content a professional, recognizable look across every asset.",
      image: fonts,
    },

    {
      title: "Guide Readers With a Built In Call To Action",
      description:
        "Save your call to action in settings and automatically include it in every PDF you create.",
      image: ctaCard,
    },
    {
      title: "Never Lose a Prompt",
      description:
        "Every prompt you create is saved, making it easy to reuse proven prompts across future projects.",
      image: promptMemory,
    },

    {
      title: "Generate Faster",
      description:
        "Spend less time rewriting prompts and more time creating and selling.",
      image: presets,
    },
    {
      title: "Refine PDFs Without Recreating Them",
      description:
        "Quickly edit existing PDFs to make improvements without rebuilding the entire document.",
      image: liveEdit,
    },
    {
      title: "Customize Every Detail of Your PDF",
      description:
        "Use the design canvas to add text, shapes, and images so your PDF looks exactly how you want.",
      image: designCanvas,
    },
  ];

  return (
    <main className="w-full bg-white pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Vertical connecting line */}
        <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gray-300 hidden lg:block" />

        <div className="flex flex-col gap-32">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;

            return (
              <motion.div
                key={index}
                className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                {/* Connector dot */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold z-10 hidden lg:flex"
                >
                  {index + 1}
                </motion.div>

                {/* Text */}
                <motion.div
                  variants={textVariant(isEven)}
                  className={`flex flex-col ${
                    isEven ? "lg:col-start-2" : "lg:col-start-1"
                  }`}
                >
                  <motion.h2 className="text-3xl font-bold text-black mb-4">
                    {step.title}
                  </motion.h2>

                  <motion.p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                    {step.description}
                  </motion.p>
                </motion.div>

                {/* Image */}
                <motion.div
                  variants={imageVariant(isEven)}
                  className={`w-full ${
                    isEven ? "lg:col-start-1" : "lg:col-start-2"
                  }`}
                >
                  <div className="bg-gray-100 aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
                    <img
                      loading="eager"
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* CTA */}
      <section className="mt-40 px-6">
        <div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
      max-w-4xl mx-auto
      rounded-2xl sm:rounded-3xl
      bg-white
      border border-gray-200
      px-8 sm:px-10
      py-14 sm:py-16
      text-center
      shadow-lg
    "
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-4">
            Ready to turn prompts into products?
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto mb-10 text-lg">
            Start creating, designing, and selling with Cre8tly Studio in
            minutes.
          </p>

          <button
            type="button"
            onClick={() => navigateWithReferral("/plans")}
            className="
    relative overflow-hidden
    inline-flex items-center justify-center gap-2
    px-10 py-4
    rounded-xl
    bg-green
    text-black
    font-bold text-lg
    transition-transform duration-200
    hover:scale-[1.07]
    active:scale-[0.95]
  "
          >
            {/* Horizontal glide shimmer */}
            <span
              className="
      pointer-events-none
      absolute top-0 left-[-40%]
      w-[180%] h-full
      bg-gradient-to-r
      from-transparent
      via-[rgba(240,255,245,0.55)]
      to-transparent
      animate-button-glide
    "
            />

            <span className="relative z-10">Get started for free</span>
          </button>
        </div>
      </section>
    </main>
  );
}

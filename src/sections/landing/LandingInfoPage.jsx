import {
  landing,
  blocks,
  downLoadFeature,
  stripeCheckout,
  leadCapture,
  versions,
  containers,
  offer,
  freeOffer,
  customBranding,
  landingPreview,
  blockFeatures,
  blockConversion,
  secureCheckout,
  audioPlayer,
  freeSubDomain,
  tools,
  aiCopy,
} from "../../assets/images";
import { motion } from "framer-motion";

export default function LandingInfoPage() {
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

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const steps = [
    {
      title: "Build and Publish Landing Pages Instantly",
      description:
        "Create high-converting landing pages in minutes and publish them instantly with a free Cre8tly Studio subdomain you can share anywhere.",
      image: landing,
    },
    {
      title: "Drag, Drop, and Design With Ease",
      description:
        "Use a flexible block based builder to structure your page exactly how you want, sections, content blocks, offers, and calls to action.",
      image: blocks,
    },
    {
      title: "Sell Digital Products Instantly",
      description:
        "Turn landing pages into revenue generators by selling PDFs, guides, audio, and digital downloads directly from your page.",
      image: downLoadFeature,
    },
    {
      title: "Built In Checkout and Payments",
      description:
        "Accept payments through secure Stripe Express checkout and receive weekly payouts with no extra setup.",
      image: stripeCheckout,
    },
    {
      title: "Capture Leads Automatically",
      description:
        "Collect emails and leads directly from your landing pages and build your audience with every visit.",
      image: leadCapture,
    },
    {
      title: "AI Powered Content Creation",
      description:
        "Generate headlines, descriptions, offers, buttons, and full landing page copy using built-in AI inside your landing page blocks.",
      image: aiCopy,
    },
    {
      title: "Save Versions and Iterate Without Risk",
      description:
        "Automatically save versions of your landing page so you can experiment, refine, and improve without losing previous work.",
      image: versions,
    },
    {
      title: "Stay Organized With Section Containers",
      description:
        "Group content into containers to keep your landing page clean, structured, and easy to manage as it grows.",
      image: containers,
    },
    {
      title: "Offer PDFs You’ve Already Created",
      description:
        "Attach any PDF created inside Cre8tly Studio directly to your landing page and turn it into a downloadable or sellable offer.",
      image: offer,
    },
    {
      title: "Built-In Free Download Offers",
      description:
        "Create free download offers to capture emails and deliver PDFs instantly without extra tools or integrations.",
      image: freeOffer,
    },
    {
      title: "Fully Custom Brand Control",
      description:
        "Apply your brand logo, background themes, font styles, and text colors so every landing page matches your identity perfectly.",
      image: customBranding,
    },
    {
      title: "Real-Time Landing Page Preview",
      description:
        "Preview your landing page live as you build so you always know exactly how it will look before publishing.",
      image: landingPreview,
    },
    {
      title: "Flexible Block-Based Builder",
      description:
        "Design pages using powerful content blocks including headings, text, images, videos, dividers, FAQs, testimonials, countdown timers, and more.",
      image: blockFeatures,
    },
    {
      title: "Conversion-Focused Offer Blocks",
      description:
        "Highlight offers with banners, pricing grids, verified reviews, and feature sections designed to increase trust and conversions.",
      image: blockConversion,
    },
    {
      title: "Secure Checkout and Payments",
      description:
        "Accept payments with secure Stripe checkout blocks so customers can purchase directly from your landing page with confidence.",
      image: secureCheckout,
    },
    {
      title: "Built-In Media and Interactive Blocks",
      description:
        "Add videos, audio players, social links, calendars, and countdown timers to create engaging, interactive experiences.",
      image: audioPlayer,
    },
    {
      title: "Referral and Growth Tools",
      description:
        "Use shareable links to encourage word-of-mouth growth and expand your reach organically.",
      image: freeSubDomain,
    },
    {
      title: "One Dashboard, Everything Connected",
      description:
        "Design, publish, track, and update your landing pages from one dashboard without switching between multiple tools..",
      image: tools,
    },
  ];

  return (
    <main className="w-full bg-white pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gray-300 hidden lg:block" />

        {/* Steps */}
        <div className="flex flex-col gap-32">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;

            return (
              <motion.div
                key={index}
                className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
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
                      loading="lazy"
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

        {/* Preview CTA */}
        <motion.section
          className="mt-48"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={fadeUp}
              className="
              relative overflow-hidden
              rounded-3xl
              bg-gradient-to-br from-black via-gray-900 to-black
              px-10 py-16
              shadow-2xl
            "
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl font-bold text-white mb-4"
                >
                  Preview a Real Landing Page
                </motion.h2>

                <motion.p
                  variants={fadeUp}
                  className="text-lg text-gray-300 max-w-2xl mb-10"
                >
                  Explore a fully built, live landing page created with Cre8tly
                  Studio. See the design, flow, and conversion structure in
                  action.
                </motion.p>

                <motion.button
                  variants={fadeUp}
                  type="button"
                  onClick={() =>
                    window.open(
                      "https://theinspirecollective.cre8tlystudio.com/",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="
                  group inline-flex items-center gap-3
                  rounded-full
                  bg-white text-black
                  px-10 py-5
                  text-lg font-semibold
                  shadow-xl
                  transition-all duration-300
                  hover:shadow-2xl
                  hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black
                "
                >
                  View Live Landing Page
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>

                <motion.span
                  variants={fadeUp}
                  className="mt-4 text-sm text-gray-400"
                >
                  Opens a live example in a new tab
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

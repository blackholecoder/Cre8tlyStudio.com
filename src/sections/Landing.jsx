import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PenTool,
  MessageSquare,
  Lock,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-white text-black flex flex-col font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-36 relative">
        <motion.h1
          className="
           header-landing-font
            text-[36px] sm:text-[48px] md:text-[64px]
            font-semibold
            tracking-tight
            leading-[1.15]
          "
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          A quiet place for writers <br />
          to grow together
        </motion.h1>

        <motion.p
          style={{ fontFamily: '"PT Serif", serif' }}
          className="
            mt-8
            text-lg sm:text-xl
            text-gray-700
            max-w-2xl
            leading-relaxed
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The Messy Attic is a supportive writing community where drafts are
          welcomed, feedback is honest, and writers help each other improve.
          Share your work, read thoughtfully, and grow without algorithms or
          noise.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-12 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => navigateWithReferral("/signup-community")}
            className="
            px-8 py-4
            rounded-xl
            bg-black text-white
            text-sm font-medium
            hover:bg-gray-900
            transition
          "
          >
            Join the community
          </button>

          <button
            onClick={() => navigate("/community-feature")}
            className="
            px-8 py-4
            rounded-xl
            border border-gray-300
            text-sm font-medium
            hover:bg-gray-50
            transition
          "
          >
            Read how it works
          </button>
        </motion.div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight header-landing-font">
            What is The Messy Attic?
          </h2>

          <p
            style={{ fontFamily: '"PT Serif", serif' }}
            className="mt-6 text-lg text-gray-700 leading-relaxed"
          >
            The Messy Attic is a quiet, supportive writing community where
            writers share work, exchange thoughtful feedback, and grow together.
            There are no social feeds, and visibility is earned through real
            reader engagement.
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: PenTool,
              title: "Write without pressure",
              desc: "Share drafts, ideas, and finished pieces in a space designed for honest feedback, not performance.",
            },
            {
              icon: MessageSquare,
              title: "Real discussion",
              desc: "Comments and replies are the heart of the community. Readers engage thoughtfully and writers respond.",
            },
            {
              icon: Lock,
              title: "Intentional access",
              desc: "Membership is subscription-based, keeping the space focused, respectful, and free from noise.",
            },
            {
              icon: TrendingUp,
              title: "Earned visibility",
              desc: "Writing rises through thoughtful discussion and genuine reader interest, not popularity contests.",
            },
            {
              icon: FileText,
              title: "Long-form friendly",
              desc: "A clean editor built for serious writing, not short posts, trends, or distractions.",
            },
            {
              icon: Users,
              title: "Built for writers",
              desc: "This isn’t social media. It’s a place to write, read deeply, and improve together.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
          transition
          hover:-translate-y-1
        "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
              flex h-10 w-10 items-center justify-center
              rounded-md
              border border-gray-200
              text-gray-700
            "
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold">{title}</h3>
              </div>

              <p className="mt-4 text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;

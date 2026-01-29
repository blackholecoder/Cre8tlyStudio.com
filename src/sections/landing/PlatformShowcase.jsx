import { useNavigate } from "react-router-dom";
import { showcase } from "../../assets/images";

const PlatformShowcase = () => {
  const navigate = useNavigate();

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  return (
    <section className="w-full bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1
          className="text-[34px] sm:text-[44px] md:text-[64px] lg:text-[80px]
          font-extrabold tracking-tight text-black leading-[1.05]"
        >
          ONE PLATFORM.
          <br />
          FROM IDEA TO INCOME.
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
          Stop stitching tools together. The Messy Attic brings creation,
          design, publishing, and selling into one seamless workflow.
        </p>

        {/* Feature Pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {[
            "Lead Magnets",
            "Landing Pages",
            "Digital Products",
            "Audio",
            "Analytics",
            "Payments",
          ].map((item) => (
            <span
              key={item}
              className="px-5 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-800"
            >
              {item}
            </span>
          ))}
        </div>

        {/* BIG IMAGE PLACEHOLDER */}
        <div className="mt-20 w-full rounded-3xl bg-gray-100 overflow-hidden shadow-xl relative">
          {/* Media container */}
          <div className="aspect-[16/9] w-full">
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium">
              <img
                src={showcase}
                alt="The Messy Attic platform preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* PLAY BUTTON OVERLAY */}
            <button
              type="button"
              onClick={() => navigateWithReferral("/smart-prompt")}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play preview"
            >
              <div
                className="w-20 h-20 rounded-full bg-black/80 backdrop-blur-sm
                      flex items-center justify-center
                      hover:bg-black transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <button
            onClick={() => navigateWithReferral("/smart-prompt")}
            className="relative overflow-hidden px-10 py-4 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900 transition"
          >
            {/* Horizontal glide layer */}
            <span
              className="
              pointer-events-none
              absolute top-0 left-[-40%]
              w-[180%] h-full
              bg-gradient-to-r
              from-transparent
              via-white/25
              to-transparent
              animate-button-glide
            "
            />
            <span className="relative z-10">Explore the Platform →</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlatformShowcase;

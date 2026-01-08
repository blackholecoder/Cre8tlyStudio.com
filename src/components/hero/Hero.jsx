import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#faf9f7]">
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-48 text-center">
        {/* Headline */}
        <h1
          className="text-[34px] sm:text-[44px] md:text-[64px] lg:text-[80px]
          font-extrabold tracking-tight text-black leading-[1.05]"
        >
          TURN YOUR IDEA INTO A
          <br />
          SELLABLE DIGITAL PRODUCT.
        </h1>

        {/* Subhead */}
        <p
          className="mt-8 text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: '"PT Serif", serif' }}
        >
          Cre8tly Studio helps creators Create smarter. Launch faster. Sell
          more.
        </p>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => navigate("/plans")}
            className="
    relative overflow-hidden
    px-10 py-4 rounded-full
    bg-black text-white text-sm font-semibold
    hover:bg-gray-900 transition-all duration-200
  "
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

            <span className="relative z-10">View Plans →</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

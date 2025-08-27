import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { dramaImg } from "../assets/images/index";

function Bio() {
  return (
    <main className="min-h-screen text-white">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-50">
        <Link
          to="/"
          className="px-4 py-2 text-sm font-semibold text-white"
        >
          ← Back to Home
        </Link>
        <h1 className="text-lg font-bold">Artist Bio</h1>
      </nav>
    <section className="mx-auto max-w-6xl px-6 py-16 text-white">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          About the Artist
        </h1>
        <p className="mt-3 text-white/75 max-w-2xl mx-auto">
          Country rap with real stories and emotional hooks,
          <br /> music that’s honest, lasting, and timeless
        </p>
      </motion.div>

      {/* Grid */}
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-5">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55 }}
          className="md:col-span-2"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <img
              src={dramaImg}
              alt="Artist portrait"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Bio copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="md:col-span-3"
        >
          <h2 className="text-2xl font-bold">Biography</h2>
          <p className="mt-4 leading-relaxed text-white/85">
            Drama blends the heart of country with the pulse of rap. Based in Tennessee and raised on storytelling, his music is steeped in real life, carrying grit, hope, and gratitude. Every track is built to lift people up, move a crowd, and remind listeners that they can keep going.
          </p>
          <p className="mt-4 leading-relaxed text-white/85">
            After years of writing and producing behind the scenes, Drama stepped into the spotlight with a string of singles that built steady momentum. In the studio, the focus is warmth and punch; off stage, the focus is family and faith. Now, working alongside a renowned producer on his upcoming album The Broken, Drama is shaping a body of work that feels raw, honest, and alive.
          </p>
          <p className="mt-4 leading-relaxed text-white/85">
            Music has been at the core of Drama’s life since he was 16. Though record labels came calling, he turned them down to stay true to his morals and values. His mission has always been to bring back real music, music that connects to the soul. His path wasn’t easy: he endured childhood abuse, faced hardship, got caught up in the streets, and spent time incarcerated. Those struggles reshaped him, teaching him what truly matters. Out of that transformation, Drama became a voice for survivors of domestic violence, abused children, and anyone fighting through adversity. With a powerful story and an even more powerful sound, he now uses his art to inspire change, bring hope, and touch lives with every record.
          </p>

          {/* Quick facts card */}
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-lg font-semibold">Quick facts</h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-white/80">
              <li>Based in Nashville TN</li>
              <li>Country rap, pop rap, storytelling</li>
              <li>For fans of Jelly Roll, Struggle Jennings, Jason Aldean, Ryan Upchurch</li>
              <li>Open to features, sync, and co writing</li>
            </ul>
          </div>

          {/* Pull quote */}
          <blockquote className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-white/90 text-lg leading-relaxed">
              “Raw emotion, clear purpose, and a voice built to carry a room.”
            </p>
            <footer className="mt-2 text-sm text-white/60">Indie Press</footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
     </main>
  );
}

export default Bio;

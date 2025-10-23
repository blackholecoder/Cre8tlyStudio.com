import { banner, headerLogo } from "../assets/images";

import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaAt,
  FaPatreon,
} from "react-icons/fa";

export const navLinks = [
  { href: "/", label: "Home"},
  { href: "sign-up", label: "Sign Up"},
  { href: "contact", label: "Contact Us"},
  { href: "shop", label: "Shop"},
  { href: "login", label: "Login"},

];

export const footerLinks2 = [
  {
    title: "Legal",
    links: [
      {
        name: "Terms of Service",
        link: "/terms",
      },
      {
        name: "Privacy Policy",
        link: "/privacy-policy",
      },
      {
        name: "Cookie Policy",
        link: "/cookie-policy",
      },
      {
        name: "Refunds Policy",
        link: "/refund-policy",
      },
    ],
  },
];

export const brand = {
  name: "Cre8tly Studio",
  tagline: "The fastest way to turn your idea into a sellable digital product.",
  bgHero: banner, // or a hosted video poster
  brandLogo: headerLogo,
  latestSingle: {
    title: "Better Off Alone",
    // cover: betterOffAlone,
    link: "https://open.spotify.com/artist/3KwC4ieT6gVeOeGTpBkEn7?si=7j84UbKYSoOc48ZcjdXcsg",
  },
  ctas: {
    listen:
      "https://open.spotify.com/artist/3KwC4ieT6gVeOeGTpBkEn7?si=7j84UbKYSoOc48ZcjdXcsg",
    youtube: "https://buy.stripe.com/5kQeVc8Yp1dnc1L7GrdfG00",
    patreon: "https://www.patreon.com/dramamusic",
  },
  socials: [
    { name: "instagram", href: "https://instagram.com/itsdramamusic" },
    { name: "facebook", href: "https://facebook.com/dramamusicofficial" },
    { name: "patreon", href: "https://www.patreon.com/dramamusic" },
  ],
};

export const links = [
  {
    href: "https://youtube.com/@DramaMusicTV",
    icon: <FaYoutube className="w-6 h-6" />,
    label: "YouTube",
    color: "#FF0000",
  },
  {
    href: "https://facebook.com/dramamusicofficial",
    icon: <FaFacebook className="w-6 h-6" />,
    label: "Facebook",
    color: "#1877F2",
  },
  {
    href: "https://instagram.com/itsdramamusic",
    icon: <FaInstagram className="w-6 h-6" />,
    label: "Instagram",
    color: "#E1306C",
  },
  {
    href: "https://www.threads.net/@itsdramamusic",
    icon: <FaAt className="w-6 h-6" />,
    label: "Threads",
    color: "#FFD700",
  },
  {
    href: "https://www.patreon.com/DramaMusic",
    icon: <FaPatreon className="w-6 h-6" />,
    label: "Patreon",
    color: "#ffffff",
  },
];

export const cannedPrompts = {
  beginner: [
    {
      label: "🎯 Social Media Growth Guide",
      text: "Write a 5-page lead magnet teaching small business owners how to grow their social media following with organic content, engagement, and consistency strategies.",
    },
    {
      label: "💰 Email Marketing Mastery",
      text: "Create a detailed guide on building and nurturing an email list that converts leads into loyal customers with proven automation techniques.",
    },
    {
      label: "📈 Personal Branding Blueprint",
      text: "Write a 5-page blueprint showing entrepreneurs how to define their brand identity, build authority online, and attract ideal clients.",
    },
    {
      label: "🎨 Design Secrets for Non-Designers",
      text: "Generate a lead magnet teaching beginners how to design professional graphics using free tools like Canva, including typography and color tips.",
    },
    {
      label: "🎤 Content Creation Starter Pack",
      text: "Write a detailed guide helping creators build a content calendar, repurpose videos, and plan content for multiple platforms efficiently.",
    },
    {
      label: "📚 The Beginner’s Guide to Digital Products",
      text: "Create a 5-page guide explaining how to turn skills into profitable digital products like eBooks, courses, or templates.",
    },
    {
      label: "🧠 Productivity Hacks for Creators",
      text: "Generate a guide full of time-saving systems, tools, and automation tricks that help creators stay consistent and organized.",
    },
    {
      label: "🚀 7 Steps to Launch Your Online Business",
      text: "Write a step-by-step roadmap for beginners to start an online business, from idea validation to first sale.",
    },
    {
      label: "💡 The Ultimate AI Prompt Guide",
      text: "Create a 5-page lead magnet showing users how to craft better AI prompts for marketing, writing, and design workflows.",
    },
    {
      label: "🎵 Monetize Your Music Online",
      text: "Write a guide showing independent musicians how to sell music, build fanbases, and create recurring revenue from digital content.",
    },
  ],

  professional: [
    {
      label: "🏗️ Build Your First Website",
      text: "Create a simple 5-page beginner guide teaching small businesses how to plan, design, and launch their first website using modern no-code tools.",
    },
    {
      label: "📦 Create & Sell Digital Templates",
      text: "Write a guide explaining how to design and sell Canva, Notion, or Google Docs templates that bring consistent passive income.",
    },
    {
      label: "🎬 Mastering Video Marketing",
      text: "Generate a 5-page lead magnet teaching creators how to plan, shoot, and promote short-form videos that build trust and conversions.",
    },
    {
      label: "🪄 Branding Psychology 101",
      text: "Write a lead magnet breaking down the psychology of color, typography, and emotion in brand design.",
    },
    {
      label: "💼 Freelancer Success Playbook",
      text: "Create a guide showing freelancers how to price their services, close clients, and scale into an agency model.",
    },
    {
      label: "🧭 The Digital Marketing Roadmap",
      text: "Write a complete 5-step roadmap for entrepreneurs to master content, SEO, ads, and email marketing for consistent traffic.",
    },
    {
      label: "🖋️ Copywriting for Conversions",
      text: "Generate a guide that teaches beginners the art of persuasive writing — from headlines to calls-to-action.",
    },
    {
      label: "🧩 Funnel Building Simplified",
      text: "Write a 5-page walkthrough on building high-converting funnels using lead magnets, tripwires, and upsells.",
    },
    {
      label: "⚙️ Automate Your Business",
      text: "Create a guide showing small business owners how to automate repetitive tasks using Zapier, AI, and scheduling tools.",
    },
    {
      label: "📊 Data-Driven Marketing",
      text: "Write a beginner-friendly guide teaching business owners how to track analytics, interpret data, and improve conversions.",
    },
  ],

  expert: [
    {
      label: "📚 The Psychology of Persuasion in Marketing",
      text: "Write a 5-page academic-style guide exploring how cognitive biases, emotional triggers, and storytelling affect consumer decision-making in marketing and branding.",
    },
    {
      label: "🧬 The Science of Habit-Building for Creators",
      text: "Develop a 5-page guide teaching creators how to build long-term consistency by applying behavioral science and habit-formation frameworks to their creative routines.",
    },
    {
      label: "🏛️ The Economics of Attention",
      text: "Write a thought-provoking lead magnet analyzing how attention has become a modern currency, explaining scarcity, virality, and monetization in the digital economy.",
    },
    {
      label: "🧠 Design Thinking for Business Innovation",
      text: "Generate a 5-page teaching resource showing entrepreneurs how to use design thinking methodology to solve business problems and create user-centered products.",
    },
    {
      label: "🎯 Strategic Positioning for Small Brands",
      text: "Write an MBA-level breakdown of how to position a brand within competitive markets using differentiation, value perception, and storytelling.",
    },
    {
      label: "📖 The Art of Thought Leadership",
      text: "Create a guide for experts on how to transform knowledge into influence by publishing insights, frameworks, and educational content that attract authority.",
    },
    {
      label: "🧩 The Systems of Scale",
      text: "Write a detailed 5-page framework teaching small teams how to transition from chaos to structure using documented workflows, automation, and SOPs.",
    },
    {
      label: "🧮 Pricing Psychology & Value Perception",
      text: "Develop a lead magnet explaining how anchoring, decoy pricing, and perceived value shape buyer decisions — with real-world examples and ethical applications.",
    },
    {
      label: "💡 The Future of AI in Creative Work",
      text: "Write an educational report exploring how AI tools are transforming creative industries, ethics, and productivity — with actionable guidance for adaptation.",
    },
    {
      label: "🌐 Web Design Principles That Convert",
      text: "Generate a professional-level guide that breaks down visual hierarchy, white space, and conversion-driven design for modern web experiences.",
    },
    {
      label: "🧭 The Strategic Content Framework",
      text: "Write a 5-page plan teaching creators how to map content pillars, storytelling arcs, and audience journeys for consistent long-term growth.",
    },
    {
      label: "📜 The History of Branding — and What It Teaches Modern Creators",
      text: "Develop a mini-course-style lead magnet that compares legacy branding (Coca-Cola, Nike, Apple) with modern personal branding on social platforms.",
    },
    {
      label: "⚖️ Ethics & Authenticity in Digital Marketing",
      text: "Write a reflective guide on maintaining authenticity, transparency, and trust in a world of automation, influencer deals, and AI content.",
    },
    {
      label: "🧭 Business Models for the Digital Age",
      text: "Create a 5-page breakdown of proven online business models — subscription, affiliate, info-products, SaaS — including their pros, cons, and margins.",
    },
    {
      label: "📚 The Creator’s Intellectual Property Handbook",
      text: "Write a guide explaining copyright, licensing, and how creators can protect their work legally when distributing digital products and media.",
    },
    {
      label: "💬 Storytelling Frameworks That Sell",
      text: "Generate a 5-page educational guide unpacking narrative structures like the Hero’s Journey, PAS, and StoryBrand for use in sales pages and videos.",
    },
    {
      label: "🔬 The Analytics of Growth",
      text: "Teach business owners how to interpret engagement metrics, user cohorts, and conversion funnels like a data scientist to make smarter creative decisions.",
    },
    {
      label: "🧱 Building Community-Driven Brands",
      text: "Write a 5-page resource on fostering belonging, trust, and shared identity around a brand or product using modern community platforms.",
    },
    {
      label: "🏗️ The Architecture of Influence",
      text: "Develop a high-level guide mapping how influence spreads through networks, social proof, and credibility — with tactics for ethical persuasion.",
    },
    {
      label: "🎓 The Modern Creative MBA",
      text: "Write a 5-page masterclass that condenses key principles of marketing, finance, operations, and leadership for modern digital creators running personal brands.",
    },
  ],
};

export const themes = [
  {
    label: "Modern Minimal",
    value: "modern",
    preview: "linear-gradient(135deg, #00E07A 0%, #670fe7 100%)", // matches linkGradient
    textColor: "#ffffff",
    bg: "#fefefe",
  },
  {
    label: "Classic Elegant",
    value: "classic",
    preview: "linear-gradient(135deg, #000000 0%, #000000 100%)",
    textColor: "#FFD700", // bright gold text for contrast
    bg: "#000000",
  },
  {
    label: "Bold Creative",
    value: "bold",
    preview: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
    textColor: "#fff",
    bg: "#0f0f0f",
  },
];

export const themeStyles = {
  modern: {
    background: "linear-gradient(90deg, #00E07A 0%, #670fe7 100%)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  classic: {
    background: "#000",
    color: "#FFD700",
    border: "1px solid #FFD700",
  },
  bold: {
    background: "linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
  },
};

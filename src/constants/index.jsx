import { banner, headerLogo } from "../assets/images";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sign-up", label: "Sign Up" },
  { href: "/contact", label: "Contact Us" },
  { href: "/shop", label: "Shop" },
  { href: "/login", label: "Login" },
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
  name: "The Messy Attic",
  tagline:
    "a supportive writing community where writers come together to share work, encourage one another, and grow through honest feedback and connection.",
  bgHero: banner, // or a hosted video poster
  brandLogo: headerLogo,
};

export const themes = [
  {
    label: "Modern Minimal",
    value: "modern", // matches linkGradient
    textColor: "#ffffff",
    bg: "#fefefe",
  },
  {
    label: "Classic Elegant",
    value: "classic",
    textColor: "#ffffff", // bright gold text for contrast
    bg: "#000000",
  },
  {
    label: "Bold Creative",
    value: "bold",
    textColor: "#fff",
    bg: "#0f0f0f",
  },
];

export const themeStyles = [];

export const colorThemes = [
  // 🤍 Neutrals / Whites / Grays
  { name: "ivory", label: "Ivory", preview: "#fefce8" },
  { name: "cream", label: "Cream", preview: "#fef9c3" },
  { name: "classic", label: "Classic", preview: "#fffaf5" },
  { name: "platinum", label: "Platinum", preview: "#f3f4f6" },
  { name: "modern", label: "Modern", preview: "#e2e8f0" },
  { name: "fog", label: "Fog", preview: "#cbd5e1" },
  { name: "stone", label: "Stone", preview: "#d6d3d1" },
  { name: "smoke", label: "Smoke", preview: "#737373" },
  { name: "storm", label: "Storm", preview: "#64748b" },
  { name: "steel", label: "Steel", preview: "#475569" },
  { name: "slate", label: "Slate", preview: "#334155" },
  { name: "graphite", label: "Graphite", preview: "#1f2937" },
  { name: "midnight", label: "Midnight", preview: "#1e293b" },
  { name: "carbon", label: "Carbon", preview: "#1e293b" },
  { name: "charcoal", label: "Charcoal", preview: "#111827" },
  { name: "onyx", label: "Onyx", preview: "#0f172a" },
  { name: "shadow", label: "Shadow", preview: "#171717" },
  { name: "jet", label: "Jet", preview: "#0a0a0a" },
  { name: "dark", label: "Dark", preview: "#030712" },

  // 💙 Blues
  { name: "ice", label: "Ice", preview: "#e0f2fe" },
  { name: "arcticBlue", label: "Arctic Blue", preview: "#7dd3fc" },
  { name: "ocean", label: "Ocean", preview: "#bae6fd" },
  { name: "arctic", label: "Arctic", preview: "#bae6fd" },
  { name: "sky", label: "Sky", preview: "#60a5fa" },
  { name: "aqua", label: "Aqua", preview: "#0ea5e9" },
  { name: "periwinkle", label: "Periwinkle", preview: "#a5b4fc" },
  { name: "iris", label: "Iris", preview: "#6366f1" },
  { name: "denim", label: "Denim", preview: "#1d4ed8" },
  { name: "navy", label: "Navy", preview: "#1e3a8a" },

  // 💜 Purples / Violets
  { name: "bold", label: "Bold", preview: "#f9e8ff" },
  { name: "orchid", label: "Orchid", preview: "#d8b4fe" },
  { name: "lavender", label: "Lavender", preview: "#c084fc" },
  { name: "berry", label: "Berry", preview: "#7e22ce" },
  { name: "ultraviolet", label: "Ultraviolet", preview: "#6d28d9" },
  { name: "velvet", label: "Velvet", preview: "#581c87" },
  { name: "royal", label: "Royal", preview: "#2E026D" },

  // 🌸 Pinks / Reds
  { name: "rose", label: "Rose", preview: "#fce7f3" },
  { name: "blush", label: "Blush", preview: "#fecdd3" },
  { name: "coral", label: "Coral", preview: "#fb7185" },
  { name: "candy", label: "Candy", preview: "#ec4899" },
  { name: "ruby", label: "Ruby", preview: "#be123c" },
  { name: "cherry", label: "Cherry", preview: "#991b1b" },
  { name: "wine", label: "Wine", preview: "#7f1d1d" },
  { name: "rosewood", label: "Rosewood", preview: "#4a0404" },

  // 🍊 Oranges / Yellows / Golds
  { name: "sand", label: "Sand", preview: "#fcd34d" },
  { name: "honey", label: "Honey", preview: "#facc15" },
  { name: "amber", label: "Amber", preview: "#fbbf24" },
  { name: "gold", label: "Gold", preview: "#f59e0b" },
  { name: "sunrise", label: "Sunrise", preview: "#fed7aa" },
  { name: "sunset", label: "Sunset", preview: "#fb923c" },
  { name: "peach", label: "Peach", preview: "#f97316" },
  { name: "tangerine", label: "Tangerine", preview: "#f97316" },
  { name: "copper", label: "Copper", preview: "#b45309" },
  { name: "bronze", label: "Bronze", preview: "#78350f" },
  { name: "wineGold", label: "Wine Gold", preview: "#854d0e" },

  // 🌿 Greens / Teals
  { name: "mintCream", label: "Mint Cream", preview: "#dcfce7" },
  { name: "mint", label: "Mint", preview: "#d1fae5" },
  { name: "opal", label: "Opal", preview: "#a7f3d0" },
  { name: "emerald", label: "Emerald", preview: "#10b981" },
  { name: "teal", label: "Teal", preview: "#0d9488" },
  { name: "forest", label: "Forest", preview: "#065f46" },
  { name: "pine", label: "Pine", preview: "#064e3b" },
  { name: "moss", label: "Moss", preview: "#14532d" },

  // ☕ Browns
  { name: "coffee", label: "Coffee", preview: "#6b4f4f" },
  { name: "mocha", label: "Mocha", preview: "#78350f" },
];

export const gradientThemes = [
  // 🤍 Neutrals / Whites / Grays
  {
    name: "gradientIvory",
    label: "Gradient Ivory",
    preview: "linear-gradient(135deg, #fefce8, #fef9c3)",
  },
  {
    name: "gradientCream",
    label: "Gradient Cream",
    preview: "linear-gradient(135deg, #fef9c3, #fde68a)",
  },
  {
    name: "gradientClassic",
    label: "Gradient Classic",
    preview: "linear-gradient(135deg, #fffaf5, #fde68a)",
  },
  {
    name: "gradientPlatinum",
    label: "Gradient Platinum",
    preview: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
  },
  {
    name: "gradientModern",
    label: "Gradient Modern",
    preview: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
  },
  {
    name: "gradientFog",
    label: "Gradient Fog",
    preview: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
  },
  {
    name: "gradientStone",
    label: "Gradient Stone",
    preview: "linear-gradient(135deg, #d6d3d1, #e7e5e4)",
  },
  {
    name: "gradientSmoke",
    label: "Gradient Smoke",
    preview: "linear-gradient(135deg, #737373, #a3a3a3)",
  },
  {
    name: "gradientStorm",
    label: "Gradient Storm",
    preview: "linear-gradient(135deg, #64748b, #475569)",
  },
  {
    name: "gradientSteel",
    label: "Gradient Steel",
    preview: "linear-gradient(135deg, #475569, #94a3b8)",
  },
  {
    name: "gradientSlate",
    label: "Gradient Slate",
    preview: "linear-gradient(135deg, #334155, #475569)",
  },
  {
    name: "gradientGraphite",
    label: "Gradient Graphite",
    preview: "linear-gradient(135deg, #1f2937, #4b5563)",
  },
  {
    name: "gradientCarbon",
    label: "Gradient Carbon",
    preview: "linear-gradient(135deg, #1e293b, #334155)",
  },
  {
    name: "gradientMidnight",
    label: "Gradient Midnight",
    preview: "linear-gradient(135deg, #1e293b, #0f172a)",
  },
  {
    name: "gradientCharcoal",
    label: "Gradient Charcoal",
    preview: "linear-gradient(135deg, #111827, #1f2937)",
  },
  {
    name: "gradientOnyx",
    label: "Gradient Onyx",
    preview: "linear-gradient(135deg, #0f172a, #1e293b)",
  },
  {
    name: "gradientShadow",
    label: "Gradient Shadow",
    preview: "linear-gradient(135deg, #171717, #262626)",
  },
  {
    name: "gradientJet",
    label: "Gradient Jet",
    preview: "linear-gradient(135deg, #0a0a0a, #171717)",
  },
  {
    name: "gradientDark",
    label: "Gradient Dark",
    preview: "linear-gradient(135deg, #030712, #1e293b)",
  },

  // 💙 Blues
  {
    name: "gradientIce",
    label: "Gradient Ice",
    preview: "linear-gradient(135deg, #e0f2fe, #7dd3fc)",
  },
  {
    name: "gradientArctic",
    label: "Gradient Arctic",
    preview: "linear-gradient(135deg, #bae6fd, #7dd3fc)",
  },
  {
    name: "gradientArcticBlue",
    label: "Gradient Arctic Blue",
    preview: "linear-gradient(135deg, #7dd3fc, #38bdf8)",
  },
  {
    name: "gradientOcean",
    label: "Gradient Ocean",
    preview: "linear-gradient(135deg, #bae6fd, #0ea5e9)",
  },
  {
    name: "gradientSky",
    label: "Gradient Sky",
    preview: "linear-gradient(135deg, #60a5fa, #3b82f6)",
  },
  {
    name: "gradientAqua",
    label: "Gradient Aqua",
    preview: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
  },
  {
    name: "gradientSapphire",
    label: "Gradient Sapphire",
    preview: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  },
  {
    name: "gradientDenim",
    label: "Gradient Denim",
    preview: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
  },
  {
    name: "gradientNavy",
    label: "Gradient Navy",
    preview: "linear-gradient(135deg, #1e3a8a, #2563eb)",
  },

  // 💜 Purples / Violets
  {
    name: "gradientBold",
    label: "Gradient Bold",
    preview: "linear-gradient(135deg, #f9e8ff, #e879f9)",
  },
  {
    name: "gradientOrchid",
    label: "Gradient Orchid",
    preview: "linear-gradient(135deg, #d8b4fe, #c084fc)",
  },
  {
    name: "gradientLavender",
    label: "Gradient Lavender",
    preview: "linear-gradient(135deg, #c084fc, #a855f7)",
  },
  {
    name: "gradientPeriwinkle",
    label: "Gradient Periwinkle",
    preview: "linear-gradient(135deg, #a5b4fc, #c7d2fe)",
  },
  {
    name: "gradientIris",
    label: "Gradient Iris",
    preview: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
  {
    name: "gradientBerry",
    label: "Gradient Berry",
    preview: "linear-gradient(135deg, #7e22ce, #a855f7)",
  },
  {
    name: "gradientUltraviolet",
    label: "Gradient Ultraviolet",
    preview: "linear-gradient(135deg, #6d28d9, #7c3aed)",
  },
  {
    name: "gradientVelvet",
    label: "Gradient Velvet",
    preview: "linear-gradient(135deg, #581c87, #7e22ce)",
  },
  {
    name: "gradientRoyal",
    label: "Gradient Royal",
    preview: "linear-gradient(135deg, #2E026D, #9333ea)",
  },

  // 🌸 Pinks / Reds
  {
    name: "gradientRose",
    label: "Gradient Rose",
    preview: "linear-gradient(135deg, #fce7f3, #ec4899)",
  },
  {
    name: "gradientBlush",
    label: "Gradient Blush",
    preview: "linear-gradient(135deg, #fecdd3, #fda4af)",
  },
  {
    name: "gradientCoral",
    label: "Gradient Coral",
    preview: "linear-gradient(135deg, #fb7185, #f43f5e)",
  },
  {
    name: "gradientCandy",
    label: "Gradient Candy",
    preview: "linear-gradient(135deg, #ec4899, #f472b6)",
  },
  {
    name: "gradientRuby",
    label: "Gradient Ruby",
    preview: "linear-gradient(135deg, #be123c, #e11d48)",
  },
  {
    name: "gradientCherry",
    label: "Gradient Cherry",
    preview: "linear-gradient(135deg, #991b1b, #dc2626)",
  },
  {
    name: "gradientWine",
    label: "Gradient Wine",
    preview: "linear-gradient(135deg, #7f1d1d, #991b1b)",
  },
  {
    name: "gradientRosewood",
    label: "Gradient Rosewood",
    preview: "linear-gradient(135deg, #4a0404, #7f1d1d)",
  },

  // 🍊 Oranges / Yellows / Golds
  {
    name: "gradientSand",
    label: "Gradient Sand",
    preview: "linear-gradient(135deg, #fcd34d, #fbbf24)",
  },
  {
    name: "gradientHoney",
    label: "Gradient Honey",
    preview: "linear-gradient(135deg, #facc15, #fbbf24)",
  },
  {
    name: "gradientAmber",
    label: "Gradient Amber",
    preview: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  },
  {
    name: "gradientGold",
    label: "Gradient Gold",
    preview: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  },
  {
    name: "gradientSunrise",
    label: "Gradient Sunrise",
    preview: "linear-gradient(135deg, #fed7aa, #fb923c)",
  },
  {
    name: "gradientSunset",
    label: "Gradient Sunset",
    preview: "linear-gradient(135deg, #fb923c, #f97316)",
  },
  {
    name: "gradientPeach",
    label: "Gradient Peach",
    preview: "linear-gradient(135deg, #f97316, #fb923c)",
  },
  {
    name: "gradientTangerine",
    label: "Gradient Tangerine",
    preview: "linear-gradient(135deg, #f97316, #fb923c)",
  },
  {
    name: "gradientCopper",
    label: "Gradient Copper",
    preview: "linear-gradient(135deg, #b45309, #f59e0b)",
  },
  {
    name: "gradientBronze",
    label: "Gradient Bronze",
    preview: "linear-gradient(135deg, #78350f, #b45309)",
  },
  {
    name: "gradientMocha",
    label: "Gradient Mocha",
    preview: "linear-gradient(135deg, #78350f, #b45309)",
  },
  {
    name: "gradientWineGold",
    label: "Gradient Wine Gold",
    preview: "linear-gradient(135deg, #854d0e, #f59e0b)",
  },

  // 🌿 Greens / Teals
  {
    name: "gradientMintCream",
    label: "Gradient Mint Cream",
    preview: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
  },
  {
    name: "gradientMint",
    label: "Gradient Mint",
    preview: "linear-gradient(135deg, #d1fae5, #10b981)",
  },
  {
    name: "gradientOpal",
    label: "Gradient Opal",
    preview: "linear-gradient(135deg, #a7f3d0, #6ee7b7)",
  },
  {
    name: "gradientEmerald",
    label: "Gradient Emerald",
    preview: "linear-gradient(135deg, #10b981, #34d399)",
  },
  {
    name: "gradientTeal",
    label: "Gradient Teal",
    preview: "linear-gradient(135deg, #0d9488, #14b8a6)",
  },
  {
    name: "gradientForest",
    label: "Gradient Forest",
    preview: "linear-gradient(135deg, #065f46, #059669)",
  },
  {
    name: "gradientPine",
    label: "Gradient Pine",
    preview: "linear-gradient(135deg, #064e3b, #065f46)",
  },
  {
    name: "gradientMoss",
    label: "Gradient Moss",
    preview: "linear-gradient(135deg, #14532d, #166534)",
  },

  // ☕ Browns
  {
    name: "gradientCoffee",
    label: "Gradient Coffee",
    preview: "linear-gradient(135deg, #6b4f4f, #8b5e5e)",
  },
];

export const fontThemes = [
  { name: "Roboto", label: "Appeal", file: "/fonts/Roboto-Regular.ttf" },

  {
    name: "Academy",
    label: "Academy",
    file: "/fonts/Academy-Engraved LET-Fonts.ttf",
  },

  {
    name: "Aloevera-Regular",
    label: "Big Win",
    file: "/fonts/Aloevera-Regular.ttf",
  },

  {
    name: "ACaslonPro",
    label: "Blissful",
    file: "/fonts/ACaslonPro-Regular.ttf",
  },

  { name: "Baskerville", label: "Brilliance", file: "/fonts/Baskerville.ttf" },

  { name: "Frank", label: "Business", file: "/fonts/frank.ttf" },

  { name: "Butler_Medium", label: "Butler", file: "/fonts/Butler_Medium.ttf" },

  {
    name: "AdobeArabic",
    label: "Classic",
    file: "/fonts/AdobeArabic-Regular.ttf",
  },

  { name: "agencyfb", label: "Dazzle", file: "/fonts/agencyfb-bold.ttf" },

  {
    name: "Aloevera-Thin",
    label: "Excellence",
    file: "/fonts/Aloevera-Thin.ttf",
  },

  { name: "ChopinScript", label: "Fancy", file: "/fonts/ChopinScript.ttf" },

  { name: "Acens", label: "Financial", file: "/fonts/Acens.ttf" },

  { name: "cambriab", label: "Footloose", file: "/fonts/cambriab.ttf" },

  { name: "Archivo", label: "Gorgeous", file: "/fonts/Archivo-Regular.ttf" },

  { name: "Berylium", label: "Guru", file: "/fonts/Berylium.ttf" },

  { name: "Impact", label: "Impactful", file: "/fonts/impact.ttf" },

  { name: "Absalom", label: "Lovely", file: "/fonts/Absalom.ttf" },

  {
    name: "Montserrat",
    label: "Modern",
    file: "/fonts/Montserrat-Regular.ttf",
  },

  {
    name: "Altoysitalic",
    label: "Mountain",
    file: "/fonts/Altoysitalic_personal_only.ttf",
  },

  {
    name: "BigShouldersDisplay",
    label: "Paradise",
    file: "/fonts/BigShouldersDisplay-Regular.ttf",
  },

  { name: "Bodoni_72", label: "Radiance", file: "/fonts/Bodoni_72.ttf" },

  { name: "Alipne", label: "Showcase", file: "/fonts/Alpine.ttf" },

  { name: "cordia", label: "Spontaneous", file: "/fonts/cordia.ttf" },

  {
    name: "Bebas Neue",
    label: "Statement",
    file: "/fonts/BebasNeue-Regular.ttf",
  },

  { name: "Advert", label: "Sunshine", file: "/fonts/Advert.ttf" },

  {
    name: "AdobeNaskh",
    label: "Urgency",
    file: "/fonts/AdobeNaskh-Medium.ttf",
  },

  { name: "Cochin", label: "Wonder", file: "/fonts/Cochin.ttf" },

  { name: "Galvji", label: "Vexar", file: "/fonts/Galvji.ttf" },
];

export const BLOCK_PILL_STYLES = {
  // 🟢 Text & structure
  "Heading (H1)": "text-green border-green bg-green/10",
  "Subheading (H2)": "text-green border-green bg-green/10",
  "Sub-Subheading (H3)": "text-green border-green bg-green/10",
  "List Heading": "text-green border-green bg-green/10",
  Paragraph: "text-green border-green bg-green/10",
  FAQ: "text-green border-green bg-green/10",
  Divider: "text-green border-green bg-green/10",

  // 🔵 Media
  "Pro Image": "text-mediaBlue border-mediaBlue bg-mediaBlue/10",
  Video: "text-mediaBlue border-mediaBlue bg-mediaBlue/10",
  "Audio Player": "text-mediaBlue border-mediaBlue bg-mediaBlue/10",
  "Single Offer": "text-mediaBlue border-mediaBlue bg-mediaBlue/10",
  "Mini Offer": "text-mediaBlue border-mediaBlue bg-mediaBlue/10",
  "Profile Card": "text-mediaBlue border-mediaBlue bg-mediaBlue/10",
  "Scroll Arrow": "text-mediaBlue border-mediaBlue bg-mediaBlue/10",

  // 🟣 Conversion
  "Offer Banner": "text-brightPurple border-brightPurple bg-brightPurple/10",
  "Stripe Checkout": "text-brightPurple border-brightPurple bg-brightPurple/10",
  "Secure Checkout": "text-brightPurple border-brightPurple bg-brightPurple/10",
  "Verified Reviews":
    "text-brightPurple border-brightPurple bg-brightPurple/10",
  "Button Url": "text-brightPurple border-brightPurple bg-brightPurple/10",

  // 🟠 Interaction
  Calendly: "text-newAgeOrange border-newAgeOrange bg-newAgeOrange/15",
  "Countdown Timer": "text-newAgeOrange border-newAgeOrange bg-newAgeOrange/15",
  "Social Links Row":
    "text-newAgeOrange border-newAgeOrange bg-newAgeOrange/15",

  // ⚪ Layout

  "Section Container": "text-white-400 border-white/20 bg-white/5",
  "Referral Button": "text-white-400 border-white/20 bg-white/5",
};

export const BLOCK_TYPE_TO_LABEL = {
  heading: "Heading (H1)",
  subheading: "Subheading (H2)",
  subsubheading: "Sub-Subheading (H3)",
  list_heading: "List Heading",
  paragraph: "Paragraph",
  faq: "FAQ",

  image: "Pro Image",
  profile_card: "Profile Card",
  video: "Video",
  audio_player: "Audio Player",
  single_offer: "Single Offer",
  mini_offer: "Mini Offer",
  scroll_arrow: "Scroll Arrow",

  offer_banner: "Offer Banner",
  stripe_checkout: "Stripe Checkout",
  secure_checkout: "Secure Checkout",
  verified_reviews: "Verified Reviews",
  button_url: "Button Url",

  calendly: "Calendly",
  countdown: "Countdown Timer",
  social_links: "Social Links Row",

  divider: "Divider",
  container: "Section Container",
  referral_button: "Referral Button",
};

export const TRUST_ICONS = [
  { key: "lock", icon: "🔒", label: "Secure" },
  { key: "shield", icon: "🛡️", label: "Protected" },
  { key: "bolt", icon: "⚡", label: "Instant" },
  { key: "download", icon: "⬇️", label: "Download" },
  { key: "check", icon: "✓", label: "Verified" },
  { key: "star", icon: "⭐", label: "Trusted" },
  { key: "card", icon: "💳", label: "Payments" },
];

export const SCROLL_ARROW_STYLES = {
  single: {
    label: "Single Arrow",
    count: 1,
    stagger: 0,
  },
  double: {
    label: "Double Arrow",
    count: 2,
    stagger: 0.15,
  },
  triple: {
    label: "Triple Arrow",
    count: 3,
    stagger: 0.18,
  },
};

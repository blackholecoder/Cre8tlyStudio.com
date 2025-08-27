import { verified, purpleTank, greenTumbler, phlokkOffHatGrey, betterOffAlone, stormyWeather, pleaseForgiveMe, banner, comingSoon } from "../assets/images";
import { facebook, instagram } from "../assets/icons";
import { FaSpotify, FaApple, FaYoutube, FaFacebook, FaInstagram, FaAt, FaAmazon } from "react-icons/fa";
import { CheckOutlined } from "@mui/icons-material";

const className =
  "w-[75%] flex justify-center items-center rounded-full shadow-lg  shadow-grey-400 text-phlokkGreen border-2 border-phlokkGreen m-2 px-32 p-4 cursor-pointer hover:scale-110 ease-in duration-200";

export const navLinks = [
  { href: "#features", label: "Music", class: className },
  { href: "#reviews", label: "Reviews", class: className },
  { href: "#social", label: "Socials", class: className },
  // { href: "#shop", label: "Shop", class: className },
  { href: "#contact", label: "Contact", class: className },
];

export const footerLinks = [
  {
    title: "Menu",
    links: [
      { name: "Music", link: "#features" },
      { name: "Reviews", link: "#reviews" },
    ],
  },
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

export const footerLinks3 = [
  {
    title: "Contact",
    links: [
      { name: "Message Us", link: "https://m.me/phlokk" },
    ]
  },
];

export const merch = [
  {
    imgURL: verified,
    price: "$14.99 /month",
    title: "Platform verification",
    link: "https://buy.stripe.com/eVa6q95m4cah90I6oA",
  },
];

export const shop = [
  {
    imgURL: purpleTank,
    slogan: "Custom designs by Bat",
    title: "Shop our featured collections",
    link: "https://phlokk.printful.me/",
  },
  {
    imgURL: greenTumbler,
    slogan: "25 oz & 40 oz Tumblers",
    title: "Shop our featured collections",
    link: "https://phlokk.printful.me/",
  },
  {
    imgURL: phlokkOffHatGrey,
    slogan: "Phlokk Off Snapback Hat",
    title: "Shop our featured collections",
    link: "https://phlokk.printful.me/",
  },
];

export const statistics = [
  { value: "1k+", label: "On Beta" },
];

export const perks = [
  {
    // imgURL: truckFast,
    label: "Instantly Verified",
    subtext:
      "Marketing incentive for future paid sponsorships, instant celebrity status.",
    icon: "verified",
  },
  {
    // imgURL: shieldTick,
    label: "Instant Follows",
    subtext:
      "Founding Members will instantly follow each other on the Phlokk platform.",
    icon: "users",
  },
  {
    // imgURL: support,
    label: "Go Live & Gifts",
    subtext:
      "Founding Members will be able to Go Live and receive gifts on the first day the app is released to the public.",
    icon: "cam",
  },
];

// add this to stripe payment links for after Check out
// https://therealdrama.com/thank-you?session_id={CHECKOUT_SESSION_ID}
export const features = [
  {
    name: (
      <>
        <span className="bold">Better Off Alone</span>
      </>
    ),
    title:
      "Better Off Alone is a powerful anthem raising awareness for domestic violence, giving strength to survivors and hope to those still fighting. Share the message, spread the light, and stand united.",
    icon: "music",
    imgURL: betterOffAlone, 
    previewUrl: "https://therealdrama.nyc3.cdn.digitaloceanspaces.com/Music-Downloads/Better%20Off%20Alone%20Short.mp3", 
    priceId: "price_1S08NwA3LinCYcoDs733er6U",
    buyLink: "https://buy.stripe.com/5kQeVc8Yp1dnc1L7GrdfG00"

  },
  {
     name: (
      <>
        <span className="bold">Stormy Weather</span>
      </>
    ),
    title:
      "Stormy Weather reflects the battles and pain we all endure, yet it shines with the promise of peace. A moving track that uplifts, heals, and inspires us to keep going forward.",
    icon: "music",
    imgURL: stormyWeather, 
    previewUrl: "https://therealdrama.nyc3.cdn.digitaloceanspaces.com/Music-Downloads/Stormy%20Weather%20Short.mp3",
    priceId: "prod_Sw0XtrWJDdcG4y",
    buyLink: "https://buy.stripe.com/14A7sKcaBg8hfdX9OzdfG01"
  },
  {
     name: (
      <>
        <span className="bold">Please Forgive Me</span>
      </>
    ),
    title:
      "This redemption track tells the story of brokenness turned to hope, as a voice seeks forgiveness and healing. An emotional anthem for anyone who’s ever longed for a new beginning.",
    icon: "music",
    imgURL: pleaseForgiveMe, 
    previewUrl: "https://therealdrama.nyc3.cdn.digitaloceanspaces.com/Music-Downloads/Please%20Forgive%20Me%20Short.mp3",
    priceId: "prod_Sw0YRZwr5dRxsS",
    buyLink: "https://buy.stripe.com/5kQdR8a2t2hr5DnaSDdfG02"
  },
  {
    name: (
      <>
        <span className="bold">Wild Horses</span>
      </>
    ),
    title:
      "Wild Horses is a summer anthem of youth, bonfires, and creekside nights, where laughter was loud, dogs ran free, and every moment felt endless. Wild Horses takes you back to the good days",
    icon: "music",
    previewUrl: null,
    imgURL: comingSoon, 
    buyLink: ""
  },
  {
    name: (
      <>
        <span className="bold">Life Goes On</span>
      </>
    ),
    title:
      "Life Goes On tells the story of life’s battles — the work, the storms, the little time we have — yet it’s a song of hope, showing how we press forward and raise our kids strong.",
    icon: "music",
    imgURL: comingSoon, 
    previewUrl: null,
    buyLink: ""
  },

  {
    name: (
      <>
        <span className="bold">Love was never enough</span>
      </>
    ),
    title:
      "Love Was Never Enough tells the story of a woman trapped in a broken relationship, where trust was missing and love faded away. A raw, emotional song about heartbreak and seeing the truth.",
    icon: "music",
    imgURL: comingSoon, 
    previewUrl: null,
    buyLink: ""
  },
];

export const socialMedia = [
  { src: facebook, alt: "facebook logo", href: "https://facebook.com/dramamusicofficial" },
  {
    src: instagram,
    alt: "instagram logo",
    href: "https://instagram.com/itsdramamusic",
  },
  // { src: patreon, alt: "patreon logo", href: "https://patreon.com/Phlokk" },
];

export const artist = {
  name: "Drama Music",
  tagline: "Country rap with real stories and unforgettable emotional hooks",
  bgHero: banner, // or a hosted video poster
  latestSingle: {
    title: "Better Off Alone",
    cover: betterOffAlone,
    link: "https://open.spotify.com/artist/3KwC4ieT6gVeOeGTpBkEn7?si=7j84UbKYSoOc48ZcjdXcsg",
  },
  ctas: {
    listen: "https://open.spotify.com/artist/3KwC4ieT6gVeOeGTpBkEn7?si=7j84UbKYSoOc48ZcjdXcsg",
    youtube: "https://www.youtube.com/@DramaMusicTV",
  },
  socials: [
    { name: "instagram", href: "https://instagram.com/itsdramamusic" },
    { name: "facebook", href: "https://facebook.com/dramamusicofficial" },
  ],
};

export const links = [
    { href: "https://open.spotify.com/artist/3KwC4ieT6gVeOeGTpBkEn7?si=7j84UbKYSoOc48ZcjdXcsg", icon: <FaSpotify className="w-6 h-6" />, label: "Spotify", color: "#1DB954"},
    { href: "https://music.apple.com/us/artist/drama/1568568029", icon: <FaApple className="w-6 h-6" />, label: "Apple Music", color: "#FA243C" },
    { href: "https://youtube.com/@DramaMusicTV", icon: <FaYoutube className="w-6 h-6" />, label: "YouTube", color: "#FF0000" },
    { href: "https://facebook.com/dramamusicofficial", icon: <FaFacebook className="w-6 h-6" />, label: "Facebook", color: "#1877F2"  },
    { href: "https://instagram.com/itsdramamusic", icon: <FaInstagram className="w-6 h-6" />, label: "Instagram", color: "#E1306C" },
    { href: "https://www.threads.net/@itsdramamusic", icon: <FaAt className="w-6 h-6" />, label: "Threads", color: "#FFD700" },
    { href: "https://music.amazon.com/tracks/B0FL63BXBL", icon: <FaAmazon className="w-6 h-6" />, label: "Amazon Music", color: "#FF9900" }
  ];

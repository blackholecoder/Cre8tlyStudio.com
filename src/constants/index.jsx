import { betterOffAlone, stormyWeather, pleaseForgiveMe, banner, comingSoon, wildHorses } from "../assets/images";
import { facebook, instagram } from "../assets/icons";
import { FaYoutube, FaFacebook, FaInstagram, FaAt, FaPatreon } from "react-icons/fa";

const className =
  "w-[75%] flex justify-center items-center rounded-full shadow-lg  shadow-grey-400 text-phlokkGreen border-2 border-phlokkGreen m-2 px-32 p-4 cursor-pointer hover:scale-110 ease-in duration-200";

export const navLinks = [
  { href: "/drama-bio", label: "Bio", class: className },
  { href: "#features", label: "Music", class: className },
  { href: "#gallery", label: "Gallery", class: className },
  { href: "#reviews", label: "Reviews", class: className },
  { href: "#social", label: "Socials", class: className },
  // { href: "#shop", label: "Shop", class: className },
  { href: "#contact", label: "Contact", class: className },
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
        <span className="bold">Wild Horses</span>
      </>
    ),
    title:
      "Wild Horses is a summer anthem of youth, bonfires, and creekside nights, where laughter was loud, dogs ran free, and every moment felt endless. Wild Horses takes you back to the good days",
    icon: "music",
    imgURL: wildHorses, 
    previewUrl: "https://therealdrama.nyc3.cdn.digitaloceanspaces.com/Music-Downloads/Wild%20Horses%20Short.mp3",
    priceId: "price_1S0x5tA3LinCYcoDirTPBHYF",
    buyLink: "https://buy.stripe.com/14A9AS5Mde094zj8KvdfG03"
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
        <span className="bold">Life Goes On</span>
      </>
    ),
    title:
      "Life Goes On tells the story of life’s battles, the work, the storms, the little time we have, yet it’s a song of hope, showing how we press forward and raise our kids strong.",
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
  {
    name: (
      <>
        <span className="bold">Bullseye</span>
      </>
    ),
    title:
      "Bullseye is a powerful song about losing yourself through years of struggle and searching for a way back. A raw and honest anthem about pain, resilience, and finding light in the darkness.",
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
    { href: "https://youtube.com/@DramaMusicTV", icon: <FaYoutube className="w-6 h-6" />, label: "YouTube", color: "#FF0000" },
    { href: "https://facebook.com/dramamusicofficial", icon: <FaFacebook className="w-6 h-6" />, label: "Facebook", color: "#1877F2"  },
    { href: "https://instagram.com/itsdramamusic", icon: <FaInstagram className="w-6 h-6" />, label: "Instagram", color: "#E1306C" },
    { href: "https://www.threads.net/@itsdramamusic", icon: <FaAt className="w-6 h-6" />, label: "Threads", color: "#FFD700" },
    { href: "https://www.patreon.com/DramaMusic", icon: <FaPatreon className="w-6 h-6" />, label: "Patreon", color: "#ffffff" },
  ];

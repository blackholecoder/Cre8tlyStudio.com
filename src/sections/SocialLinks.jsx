import { links } from "../constants";

const SocialLinks = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 p-6 bg-[#111] rounded-2xl border border-[#1A1A1A] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      
      {links.map((link, i) => (
        <a
          key={i}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center transition hover:scale-110"
        >
          {link.icon && (
            <span style={{ color: link.color }}>
              {link.icon}
            </span>
          )}
          <span className="mt-2 text-sm font-montserrat text-white">{link.label}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;


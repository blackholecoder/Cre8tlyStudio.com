import CustomIcon from "./CustomIcon";
import { PreviewPlayer } from "./Player";

const FeaturesCard = ({ feature }) => {
  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl w-full bg-[#111] border border-[#1A1A1A] shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.7)] transition-all duration-300">
      
      {/* Top Content */}
      <div>
        {feature.imgURL && (
          <img
            src={feature.imgURL}
            alt={feature.name}
            className="w-full h-120 object-cover rounded-xl mb-4"
          />
        )}
        <h3 className="flex items-center text-xl font-bold font-montserrat text-white-400">
          <span className="mr-3 text-mutedGrey">
            <CustomIcon name={feature.icon} />
          </span>
          {feature.name}
        </h3>
        <p className="mt-3 text-silver text-base font-montserrat leading-relaxed">
          {feature.title}
        </p>
        {feature.previewUrl && (
          <PreviewPlayer
            src={feature.previewUrl}
            title={feature.name}
            start={0}
            end={30}
          />
        )}
      </div>

      {/* Bottom Button */}
      {feature.previewUrl && (
      <div className="mt-6">
        <a
          href={feature.buyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-2 rounded-xl bg-green text-white font-montserrat font-semibold text-center hover:opacity-90 transition"
        >
          Buy Single
        </a>
      </div>
      )}
    </div>
  );
};

export default FeaturesCard;

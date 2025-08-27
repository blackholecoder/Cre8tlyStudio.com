import { AiFillStar } from "react-icons/ai";

const ReviewCard = ({ imgURL, customerName, feedback, bio }) => {
  return (
    <div className="flex justify-center items-center flex-col pb-10">
      <div className="flex flex-col items-center justify-center bg-[#0a0a0a] border border-[#333] rounded-2xl p-6 shadow-[0_0_20px_rgba(98,0,238,0.2)] hover:shadow-[0_0_30px_rgba(98,0,238,0.4)] transition-all duration-300 max-w-sm">

        <h3 className="mt-4 text-xl font-semibold text-white text-center tracking-wide">
          {customerName}
        </h3>

        <p className="mt-4 text-center text-gray-300 text-sm leading-relaxed">
          “{feedback}”
        </p>

        <div className="mt-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <AiFillStar
              key={i}
              className="text-yellow-400 text-xl drop-shadow-[0_0_3px_rgba(255,255,0,0.5)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
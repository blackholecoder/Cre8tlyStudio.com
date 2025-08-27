import { AiFillStar } from "react-icons/ai";

const ReviewCard = ({ customerName, feedback, bio }) => {
  return (
    <div className="flex justify-center items-center flex-col pb-10">
      <div className="flex flex-col items-center justify-center bg-[#0a0a0a] border border-[#333] rounded-2xl p-6 shadow-[0_0_20px_rgba(98,0,238,0.2)] hover:shadow-[0_0_30px_rgba(98,0,238,0.4)] transition-all duration-300 max-w-sm">

        <h3 className="mt-4 text-xl font-semibold text-white text-center tracking-wide">
          {customerName}
        </h3>

        <p className="mt-4 text-center text-gray-300 text-sm leading-relaxed">
          “{feedback}”
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
const MerchCard = ({ imgURL, title, price, slogan, link, user }) => {
  const isSubscribed = user?.is_golden || user?.verified_subscription;

  return (
    <div className="flex flex-col items-center bg-[#111] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 max-w-md mx-auto">
      <img
        src={imgURL}
        alt="Merch item"
        className="rounded-full object-cover w-[300px] h-[300px] shadow-2xl shadow-phlokkGreen hover:scale-105 transition-transform duration-300"
      />

      <h3 className="mt-8 text-2xl font-bold text-center text-white drop-shadow-md">
        {title}
      </h3>

      {slogan && (
        <p className="mt-2 text-center text-sm text-gray-400 max-w-xs italic">
          {slogan}
        </p>
      )}

      <p className="mt-4 text-xl font-semibold text-phlokkGreen">{price}</p>

      <div className="mt-6">
        {isSubscribed ? (
          <span className="inline-block text-green-400 font-semibold text-lg">
            Subscription Active
          </span>
        ) : (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-black bg-phlokkGreen hover:bg-green-500 transition-colors duration-300 font-semibold rounded-full text-lg px-6 py-3 shadow-lg hover:shadow-phlokkGreen/50"
          >
            🛒 Subscribe Now
          </a>
        )}
      </div>
    </div>
  );
};

export default MerchCard;

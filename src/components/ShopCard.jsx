

// const ShopCard = ({ imgURL, title, price, slogan, link}) => {
//   return (
//     <div className='flex justify-center items-center flex-col'>
//       <img
//         src={imgURL}
//         alt='Founder icon'
//         className='rounded-full object-cover w-[350px] h-[350px] shadow-2xl shadow-purpleQueen'
//       />
      
      
//       <h3 className='mt-12 max-w-sm text-center merch-text'>
//         {title}
//       </h3>
//       <h3 className='mt-3 max-w-sm text-center merch-text'>
//         {slogan}
//       </h3>
//       <div className='mt-3 flex justify-center items-center gap-2.5'>
//         <p className='text-xl font-montserrat price-text'>{price}</p>
//       </div>
      
//       <h2 className='m-10'>
//   <a
//     href={link}
//     target="_blank"
//     rel="noopener noreferrer"
//     className='text-white bg-phlokkGreen hover:bg-phlokkGreen font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2'
//   >
//     Shop Now
//   </a>
// </h2>
//     </div>
//   );
// };
const ShopCard = ({ imgURL, title, price, slogan, link }) => {
  return (
    <div className='flex justify-center items-center flex-col bg-[#111] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300'>
      <img
        src={imgURL}
        alt='Product'
        className='rounded-full object-cover w-[300px] h-[300px] shadow-2xl shadow-purpleQueen hover:scale-105 transition-transform duration-300'
      />

      <h3 className='mt-8 text-2xl font-bold text-center text-white drop-shadow-md'>
        {title}
      </h3>

      <p className='mt-2 text-center text-sm text-gray-400 max-w-xs italic'>
        {slogan}
      </p>

      <p className='mt-4 text-xl font-semibold text-phlokkGreen'>
        {price}
      </p>

      <div className='mt-6'>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className='text-black bg-phlokkGreen hover:bg-green-500 transition-colors duration-300 font-semibold rounded-full text-lg px-6 py-3 shadow-lg hover:shadow-phlokkGreen/50'
        >
          🛍️ Shop Now
        </a>
      </div>
    </div>
  );
};


export default ShopCard;
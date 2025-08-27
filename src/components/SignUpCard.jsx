// const SignUpCard = ({ sign }) => {
//   return (
//     <div className='flex justify-center items-center flex-col sm:w-[350px] sm:min-w-[350px] w-full rounded-[20px] shadow-3xl px-5 py-5 border-2 border-phlokkGreen'>
//       <img
//         src={sign.imgURL}
//         alt='Verified icon'
//         className='rounded-full object-cover w-[120px] h-[120px]'
//       />
    
//       <p className='mt-6 max-w-sm text-center icon-text'>{sign.feedback}</p>
//       <div className='mt-3 flex justify-center items-center gap-2.5'>
//         <p className='text-xl font-montserrat price-text'>{sign.price}</p>
//       </div>
//       <h2 className='m-10'>
// <a href={sign.link} className='text-white bg-phlokkGreen hover:bg-phlokkGreen font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2'>Get Verified</a>
// </h2>
//     </div>
//   );
// };
const SignUpCard = ({ sign }) => {
  return (
    <div className='flex justify-center items-center flex-col sm:w-[350px] sm:min-w-[350px] w-full rounded-[20px] bg-[#0a0a0a] shadow-[0_0_20px_rgba(98,0,238,0.2)] border border-phlokkGreen hover:shadow-[0_0_30px_rgba(0,255,150,0.4)] transition-all duration-300 px-6 py-8'>

      <img
        src={sign.imgURL}
        alt='Verified icon'
        className='rounded-full object-cover w-[100px] h-[100px] border-4 border-phlokkGreen shadow-lg hover:scale-105 transition-transform duration-300'
      />

      <p className='mt-6 max-w-sm text-center text-gray-300 text-base leading-relaxed'>
        {sign.feedback}
      </p>

      <div className='mt-4 text-xl font-semibold text-phlokkGreen'>
        {sign.price}
      </div>

      <div className='mt-6'>
        <a
          href={sign.link}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-block bg-phlokkGreen text-black text-lg font-bold px-6 py-3 rounded-full hover:bg-green-500 transition-all duration-300 shadow-md hover:shadow-lg'
        >
          ✅ Get Verified
        </a>
      </div>
    </div>
  );
};




export default SignUpCard;
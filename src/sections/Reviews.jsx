import Slider from "../components/Slider";
const Reviews = () => {
    return (
      <section className='max-container'>
        <div className=' flex justify-center items-center'>
      </div>
        <h3 className='font-palanquin text-center text-3xl font-bold text-white'>
          What Drama's Fans Are Saying
        </h3>
        <p className='m-auto mt-4 max-w-lg text-center feedback-text2'>
        Read inspiring stories from Drama's growing fan base
        </p>
  
        <div className='mt-24 flex-1 justify-evenly items-center max-lg:flex-col gap-14'>
          <Slider />
        </div>
      </section>
    );
  };


export default Reviews
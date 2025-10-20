
import Lottie from "lottie-react";
import notFound from '../assets/animations/notFound.json';
import { Link } from "react-router-dom";
const NotFound = () => {
    return (
      <section className='max-xl h-screen bg-gradient-to-r from-black to-silver'>
        

        <div className=' flex justify-center items-center'>
      <Lottie className='w-[500px] h-[500px]' animationData={notFound} loop={true} />
      </div>
        <h3 className='font-palanquin padding-x text-center text-8xl font-bold text-phlokkGreen'>
          4 0 4
        </h3>
        <p className='m-auto mt-4 max-w-lg text-center notFound-text'>
        Page does not exist!
        </p>
  
        <div className='mt-24 flex-1 justify-center items-center text-center text-white max-lg:flex-col gap-14'>
          <h1>Go back to <Link to="/"> <span className="text-phlokkGreen">Homepage</span></Link></h1>

        </div>
      </section>
    );
  };


export default NotFound;
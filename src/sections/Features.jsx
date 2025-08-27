import { features } from "../constants";
import { FeaturesCard } from "../sections";
import { motion } from "framer-motion";



const textVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 2,
    },

    }
  }

  const componentVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 3,
      },
  
      }
    }

const AppFeatures = () => {
  return (
    <section id='features' className='max-container max-sm:mt-12'>
      <motion.div className='flex flex-col justify-start gap-5'
      variants={textVariants}
      initial="hidden"
       whileInView="visible"
      >
        <h2 className='text-3xl font-montserrat font-normal'>
          <span className='text-white-400 font-bold'> Album: </span> <span className='text-white'> The Broken ( 11 songs ) </span>
        </h2>
        
      </motion.div>

      <motion.div className='mt-16 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-14 items-stretch'
       variants={componentVariants}
       initial="hidden"
        whileInView="visible"
      >
        {features.map((feature) => (
          <FeaturesCard key={feature.name} feature={feature} />
        ))}
      </motion.div>
    </section>
  );
};

export default AppFeatures;
// import { shop } from "../constants";
// import { ShopCard } from "../sections";
// import { MdVerified } from "react-icons/md";
// import { motion } from "framer-motion";

// const textVariants = {
//   hidden: {
//     opacity: 0,
//   },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 2,
//     },
//   },
// };

// const Shop = () => {
//   return (
//     <section className="max-container">
//       <motion.div
//         className="flex items-center justify-center"
//         variants={textVariants}
//         initial="hidden"
//         whileInView="visible"
//       >
//         <h3 className="font-palanquin text-center text-white text-4xl font-bold">
//           Phlokk
//           <span className="text-phlokkGreen"> Swag </span>
//         </h3>
//         <MdVerified className="object-contain m-0 verified-icon" />
//       </motion.div>
//       <p className="m-auto mt-6 max-w-lg text-center shop-text"> 
//       Phlokk Swag is more than just platform merch:<br/>it’s a lifestyle. 
//       <br/><br/>Whether you're repping in our signature hoodies, strutting in statement socks, or keeping it fresh with creator-inspired tees, every piece is made to turn heads and speak loud without saying a word.<br/>Shop our featured collection!
//       </p>

//       <div className="mt-24 flex flex-1 justify-evenly items-center max-lg:flex-col gap-14">
//         {shop.map((tees) => (
//           <ShopCard key={tees.title} {...tees} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Shop;
import { shop } from "../constants";
import { ShopCard } from "../sections";
import { MdVerified } from "react-icons/md";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 2 },
  },
};

const Shop = () => {
  return (
    <section className="max-container pt-20 pb-24">
      <motion.div
        className="flex items-center justify-center"
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
      >
        <h3 className="font-palanquin text-center text-white text-4xl font-extrabold tracking-tight">
          Phlokk
          <span className="text-phlokkGreen"> Swag </span>
        </h3>
        <MdVerified className="ml-2 text-phlokkGreen text-3xl drop-shadow-md" />
      </motion.div>

      <p className="m-auto mt-5 max-w-xl text-center text-silver text-lg leading-relaxed">
        Phlokk Swag isn’t just merch — it’s your message.  
        <br />
        Whether you're repping in our signature hoodies, strutting in statement socks, or keeping it fresh with creator-inspired tees, every piece is made to turn heads and speak loud without saying a word.<br/>Shop our featured collection!
      </p>

      <div className="mt-24 flex flex-wrap justify-center items-center gap-14">
        {shop.map((tees) => (
          <ShopCard key={tees.title} {...tees} />
        ))}
      </div>
    </section>
  );
};

export default Shop;

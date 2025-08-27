import { useState } from "react";
import { Button } from "../sections";
import axios from "axios";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const Subscribe = () => {
  const url = "https://phlokk-website-api.phlokk.com/api/subscribe/subscriberData";
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => setEmail("");
  const successMessage = () => setSuccess(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    axios
      .post(url, { email })
      .then(() => {
        successMessage();
        resetForm();
      })
      .catch((e) => {
        console.log("Error in axios call:", e);
      });
  };

  return (
    <section
  id="subscribe"
  className="max-container flex flex-col lg:flex-row justify-between items-center gap-10 py-20 px-6 bg-[#0a0a0a] rounded-3xl"
>
  <motion.div
    className="text-center lg:text-left w-full lg:w-1/2"
    variants={textVariants}
    initial="hidden"
    whileInView="visible"
  >
    <h3 className="text-2xl lg:text-5xl font-palanquin font-extrabold text-white drop-shadow-lg">
      Sign Up for <span className="text-phlokkGreen">Updates</span> & Newsletter
    </h3>
    <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
      Get early access to announcements, merch drops, and exclusive content.
    </p>
  </motion.div>

  <div className="w-full lg:w-1/2 max-w-xl">
  <form
  onSubmit={handleSubmit}
  className="w-full flex flex-col sm:flex-row items-center gap-4 px-4 py-4 rounded-2xl bg-[#111] 
    border border-phlokkGreen sm:rounded-full sm:border sm:px-5 sm:py-3 
    shadow-inner shadow-black hover:shadow-[0_0_15px_rgba(0,255,150,0.3)] 
    transition-all duration-300"
>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 w-full bg-transparent text-white placeholder-gray-500 outline-none px-2 py-2 text-sm"
      />
      <div className="w-full sm:w-auto">
        <Button type="submit" label="Subscribe" fullWidth />
      </div>
    </form>

    {success && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <Alert
          sx={{ borderRadius: 2 }}
          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          severity="success"
        >
          Subscribed!
        </Alert>
      </motion.div>
    )}
  </div>
</section>

  );
};

export default Subscribe;

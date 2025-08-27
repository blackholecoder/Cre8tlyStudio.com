
import { Link } from "react-router-dom";
import { icon } from "../assets/images";
const Login = () => {
  return (
    <section className="flex h-screen items-center bg-gradient-to-r from-black to-silver padding-x">
      <div className="items-center justify-center flex-1">
      <div className="flex justify-center items-center text-center">
        <img
          src={icon}
          alt="Founder icon"
          className="rounded-full object-cover w-[120px] h-[120px]"
        />
      </div>
      <h3 className="font-palanquin padding-x text-center text-xl font-bold text-white">
        <span className="text-white inline-block mt-3">
          Founder Portal
        </span>
      </h3>
      <p className="m-auto mt-4 max-w-xl text-center thankYou-text">
        New Founder Portal coming soon!<br/><br/> Please DM us on Facebook for
        asssitance.{" "}
        <a className="text-phlokkGreen" href="https://m.me/phlokk">
          click here{" "}
        </a>{" "}
        to message us for your convenience.
      </p>
      <div className="mt-24 flex-1 justify-center items-center text-center text-white max-lg:flex-col gap-14">
        <h1 className="text-xl">
          Go back to{" "}
          <Link to="/">
            {" "}
            <span className="text-phlokkGreen">Homepage</span>
          </Link>
        </h1>
      </div>
      </div>
    </section>
  );
};

export default Login;

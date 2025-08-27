import { Link } from "react-router-dom";
import { logo } from "../assets/images";
const DeleteData = () => {
  return (
    <section className="max-xl h-screen bg-gradient-to-r from-black to-black padding-x">
      <div className="flex justify-center items-center pb-24"></div>
      <div className="flex justify-center items-center text-center pb-24">
        <img
          src={logo}
          alt="logo"
          className="rounded-full object-cover w-[120px] h-[120px]"
        />
      </div>
      <h3 className="font-palanquin padding-x text-center text-3xl font-bold text-white">
        <span className="text-darkRed inline-block mt-3">
          Delete your account
        </span>
      </h3>
      <h3 className="font-palanquin padding-x text-center text-xl pb-12 text-white">
        <span className="text-white inline-block mt-3">
          Please read our terms carefully{" "}
        </span>
      </h3>
      <p className="m-auto mt-4 max-w-xl  thankYou-text">
        If you delete your user account you will lose all services stated in our{" "}
        <a className="text-phlokkGreen" href="https://phlokk.com/terms">
          Terms Of Service{" "}
        </a>{" "}
        agreement. We recommend that you download all of your data before
        permanently deleting your account. {"\n"}Your content, links & user
        profile will be unaccessible to other users once you have deleted your
        account. After 90 days of an inactive account, all of your data will no
        longer exist on our servers.
        <br />
        <br />
        Email our legal department to delete your account
        & data permanently from our platform.
      </p>

      <div className="mt-24 flex-1 justify-center items-center text-center text-white max-lg:flex-col gap-14 pb-24">
        <h2 className="m-10">
          <a
            href="mailto:legal@phlokk.com?subject=Phlokk%20Support:%20Delete%20my%20account&body=I%20would%20like%20to%20delete%20all%20of%20my%20data%20on%20your%20platform."
            text
            className="text-white bg-darkRed  hover:bg-darkRed font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2"
          >
            Delete my account
          </a>
        </h2>
      </div>

      <div className="mt-24 flex-1 justify-center items-center text-center text-white max-lg:flex-col gap-14">
        <h1 className="text-xl">
          Go back to{" "}
          <Link to="/">
            {" "}
            <span className="text-phlokkGreen">Homepage</span>
          </Link>
        </h1>
      </div>
    </section>
  );
};

export default DeleteData;

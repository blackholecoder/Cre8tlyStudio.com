import { useNavigate, Outlet, useMatch } from "react-router-dom";
import Nav from "../../components/Nav";

export default function Resources() {
  const navigate = useNavigate();
  const isVideos = useMatch("/resources/videos");

  const navigateWithReferral = (path) => {
    const ref = localStorage.getItem("ref_slug");
    if (ref) return navigate(`${path}?ref=${ref}`);
    return navigate(path);
  };

  return (
    <main className="w-full min-h-screen bg-white pt-32 pb-24 px-6 flex flex-col items-center text-center">
      {!isVideos && (
        <>
          <h1 className="text-4xl font-bold text-black design-text mb-4">
            Cre8tly Studio Resources
          </h1>

          <p className="text-black max-w-2xl mb-16">
            Free training, guides, and tools to help you design, launch, and
            sell digital products faster.
          </p>
        </>
      )}

      {/* Show cards only on /resources */}
      {!isVideos && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
          <button
            type="button"
            onClick={() => navigateWithReferral("videos")}
            className="w-full text-left rounded-2xl border border-gray-800 p-10 hover:border-black transition focus:outline-none focus:ring-2 focus:ring-black"
          >
            <h3 className="text-2xl font-semibold text-black mb-2">
              Training Videos
            </h3>
            <p className="text-black">
              Step by step walkthroughs covering the full Cre8tly Studio
              workflow.
            </p>
          </button>

          <div className="rounded-2xl border border-gray-800 p-10 opacity-40">
            <h3 className="text-2xl font-semibold text-black mb-2">
              Training Courses
            </h3>
            <p className="text-gray-500">Coming soon</p>
          </div>
        </div>
      )}

      {/* Child routes render here */}
      <Outlet />
    </main>
  );
}

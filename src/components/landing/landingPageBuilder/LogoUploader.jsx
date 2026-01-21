import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";

export default function LogoUploader({
  landing,
  setLanding,
  showLogoSection,
  setShowLogoSection,
}) {
  return (
    <div
      className="
      mt-12
      bg-dashboard-sidebar-light dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light dark:border-dashboard-border-dark
      rounded-2xl
      shadow-inner
      p-6
      transition-all
      hover:border-dashboard-muted-light dark:hover:border-dashboard-muted-dark
    "
    >
      {/* HEADER (toggle) */}
      <div
        className="flex items-center justify-between mb-5 cursor-pointer"
        onClick={() => setShowLogoSection((prev) => !prev)}
      >
        <label
          className="text-lg font-semibold tracking-wide
        text-dashboard-text-light dark:text-dashboard-text-dark"
        >
          Brand Logo
        </label>

        <div className="flex items-center gap-3">
          <span
            className="text-xs italic hidden sm:block
            text-dashboard-muted-light dark:text-dashboard-muted-dark"
          >
            Recommended: PNG or SVG · 200×200px+
          </span>

          <span
            className={`text-sm transition-transform duration-300
            text-dashboard-muted-light dark:text-dashboard-muted-dark ${
              showLogoSection ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </div>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showLogoSection ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {!landing.logo_url ? (
          <label
            htmlFor="logoUpload"
            className="
            flex flex-col items-center justify-center
            border-2 border-dashed
            border-dashboard-border-light dark:border-dashboard-border-dark
            hover:border-green
            rounded-xl
            py-10 px-6
            cursor-pointer
            transition-all duration-300
            group
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="
              h-10 w-10
              text-dashboard-muted-light dark:text-dashboard-muted-dark
              group-hover:text-green
              transition
            "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-6-9l-3-3m0 0l-3 3m3-3V15"
              />
            </svg>

            <p
              className="mt-3 text-sm
              text-dashboard-muted-light dark:text-dashboard-muted-dark"
            >
              <span className="text-green font-medium">Click to upload</span> or
              drag your logo
            </p>

            <input
              id="logoUpload"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const previewUrl = URL.createObjectURL(file);
                setLanding({ ...landing, logo_url: previewUrl });

                const formData = new FormData();
                formData.append("logo", file);
                formData.append("landingId", landing.id);

                try {
                  const res = await axiosInstance.post(
                    "/landing/upload-logo",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                  );

                  if (res.data.success) {
                    setLanding({ ...landing, logo_url: res.data.logo_url });
                    URL.revokeObjectURL(previewUrl);
                    toast.success("Logo uploaded successfully!");
                  } else {
                    throw new Error(res.data.message);
                  }
                } catch (err) {
                  toast.error("Error uploading logo");
                  setLanding({ ...landing, logo_url: "" });
                }
              }}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p
              className="text-sm mb-3
text-dashboard-muted-light dark:text-dashboard-muted-dark"
            >
              Current Logo:
            </p>

            <div
              className="
            relative
            bg-dashboard-bg-light dark:bg-dashboard-bg-dark
            border border-dashboard-border-light dark:border-dashboard-border-dark
            rounded-lg
            shadow-md
            p-3
            w-fit
            mx-auto
          "
            >
              <img
                src={landing.logo_url}
                alt="Uploaded Logo"
                className="h-24 object-contain rounded-md mx-auto"
              />
            </div>

            <button
              type="button"
              className="text-xs mt-4
              text-red-500 hover:underline"
              onClick={() => setLanding({ ...landing, logo_url: "" })}
            >
              Remove Logo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

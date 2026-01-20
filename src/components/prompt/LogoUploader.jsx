import { XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useRef } from "react";

export default function LogoUploader({ logoPreview, setLogo, setLogoPreview }) {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be less than 2MB");
      e.target.value = ""; // reset file input
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width > 512 || img.height > 512) {
        toast.warning("Logo too large! Please use up to 512×512 px.");
        e.target.value = ""; // reset file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ resets input
    toast.info("Logo removed");
  };

  return (
    <div
      className="
      bg-dashboard-sidebar-light
      dark:bg-dashboard-sidebar-dark
      border border-dashboard-border-light
      dark:border-dashboard-border-dark
      rounded-xl
      p-4
      space-y-4
    "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <label
          className="text-sm font-semibold
        text-dashboard-text-light
        dark:text-dashboard-text-dark"
        >
          Brand Logo
        </label>

        <span
          className="text-xs
        text-dashboard-muted-light
        dark:text-dashboard-muted-dark"
        >
          Max 512×512 · 2 MB
        </span>
      </div>

      {/* Upload input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleLogoUpload}
        className="
        block w-full text-sm
        text-dashboard-text-light
        dark:text-dashboard-text-dark
        file:mr-4
        file:py-2
        file:px-4
        file:rounded-lg
        file:border-0
        file:font-semibold
        file:bg-bookBtnColor
        file:text-black
        hover:file:opacity-90
        transition
      "
      />

      {/* Preview */}
      {logoPreview && (
        <div className="pt-2 flex justify-center">
          <div className="relative">
            <img
              src={logoPreview}
              alt="Logo preview"
              className="
              w-20
              h-20
              object-contain
              rounded-md
              border
              border-dashboard-border-light
              dark:border-dashboard-border-dark
              
            "
            />

            {/* Remove button */}
            <button
              onClick={handleRemoveLogo}
              type="button"
              title="Remove logo"
              className="
              absolute
              -top-2
              -right-2
              rounded-full
              p-1
              bg-dashboard-hover-light
              dark:bg-dashboard-hover-dark
              hover:opacity-90
              transition
            "
            >
              <XCircle size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div>
      <label className="block text-silver mb-2 font-medium">
        Brand Logo (Max 512×512 – 2 MB)
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleLogoUpload}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:font-semibold
                   file:bg-royalPurple file:text-white hover:file:opacity-80"
      />

      {logoPreview && (
        <div className="mt-4 flex flex-col items-center space-y-3">
          <div className="relative">
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-20 h-20 object-contain border border-gray-700 rounded-md"
            />
            {/* Inline remove button on image corner */}
            <button
              onClick={handleRemoveLogo}
              type="button"
              className="absolute -top-2 -right-2 bg-gray-900 rounded-full p-1 hover:bg-gray-800"
              title="Remove"
            >
              <XCircle size={16} className="text-red-400 hover:text-red-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

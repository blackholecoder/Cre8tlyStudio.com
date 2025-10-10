import { toast } from "react-toastify";

export default function LogoUploader({ logoPreview, setLogo, setLogoPreview }) {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be less than 2MB");
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width > 512 || img.height > 512) {
        toast.warning("Logo too large! Please use up to 512×512 px.");
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

  return (
    <div>
      <label className="block text-silver mb-2 font-medium">Brand Logo (Max 512×512 – 2 MB)</label>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleLogoUpload}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:font-semibold
                   file:bg-royalPurple file:text-white hover:file:opacity-80"
      />
      {logoPreview && <img src={logoPreview} alt="Logo preview" className="mt-3 mx-auto w-16 h-16 object-contain border border-gray-700 rounded-md" />}
    </div>
  );
}

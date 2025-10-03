import { useAuth } from "../admin/AuthContext";
import LoginSuccessToast from "./ToastMessage";


export default function ToastWrapper() {
  const { toastMessage, setToastMessage } = useAuth();

  if (!toastMessage) return null;

  return (
    <LoginSuccessToast
      message={toastMessage}
      onClose={() => setToastMessage("")}
    />
  );
}
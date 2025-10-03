import { useNavigate } from "react-router-dom";
import { AuthProvider as BaseAuthProvider } from "./AuthContext";

export default function AuthProviderWithRouter({ children }) {
  const navigate = useNavigate();
  return <BaseAuthProvider navigate={navigate}>{children}</BaseAuthProvider>;
}
import { Navigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";
import LoadingOverlay from "./LoadingOverlay.jsx";

export default function PrivateRoute({ children, role }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingOverlay />; // 👈 show spinner overlay until restore finishes
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
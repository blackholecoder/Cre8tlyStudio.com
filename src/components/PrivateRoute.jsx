import { Navigate } from "react-router-dom";
import { useAuth } from "../admin/AuthContext.jsx";

export default function PrivateRoute({ children, role }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow one or multiple roles
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

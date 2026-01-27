import { Navigate, Outlet } from "react-router-dom";

export default function RoleRoute({ user, allowedRoles }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 🔑 THIS IS REQUIRED
  return <Outlet />;
}

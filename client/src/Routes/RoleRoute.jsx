import { Navigate, Outlet } from "react-router-dom";

export default function RoleRoute({ user, allowedRoles,loading }) {
  if (loading) {
    return null; // or a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}

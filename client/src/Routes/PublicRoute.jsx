import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ user, loading }) {
  if (loading) return null;

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}

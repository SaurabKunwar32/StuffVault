import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ user, loading }) {
  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

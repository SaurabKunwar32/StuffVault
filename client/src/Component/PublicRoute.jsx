import { Navigate } from "react-router-dom";

export default function PublicRoute({ user, loading, children }) {
  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

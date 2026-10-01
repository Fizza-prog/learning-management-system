/**
 * @file GuestRoute.jsx
 * @description Restricts designated routes to unauthenticated visitors.
 *
 * Responsibilities:
 * - Render guest content when no user is signed in.
 * - Redirect authenticated users to their dashboard.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
/**
 * @file ProtectedRoute.jsx
 * @description Guards routes that require an authenticated user.
 *
 * Responsibilities:
 * - Render protected content for signed-in users.
 * - Redirect unauthenticated users to login.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
function ProtectedRoute() {
  const { user,loading } = useAuth();

  if(loading)
  {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
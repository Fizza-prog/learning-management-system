/**
 * @file RoleGuard.jsx
 * @description Restricts nested routes to a configured set of user roles.
 *
 * Responsibilities:
 * - Check the authenticated user's role.
 * - Render allowed content or redirect unauthorized users.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

function RoleGuard({ allowedRoles }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;
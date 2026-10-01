/**
 * @file DashboardRouter.jsx
 * @description Selects the dashboard view for the authenticated user's role.
 *
 * Responsibilities:
 * - Route users to the appropriate dashboard module.
 * - Handle roles without a matching dashboard view.
 */
import { useAuth } from "../auth/context/AuthContext";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";

function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    return <h1>Unauthorized</h1>;
  }

  switch (user.role) {
    case "super_admin":
      return <SuperAdminDashboard />;

    case "admin":
      return <SchoolAdminDashboard />;

    default:
      return <h1>Unauthorized</h1>;
  }
}

export default DashboardRouter;
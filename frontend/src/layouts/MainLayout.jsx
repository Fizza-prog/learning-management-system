/**
 * @file MainLayout.jsx
 * @description Provides the shared layout for authenticated dashboard routes.
 *
 * Responsibilities:
 * - Render the dashboard navigation and top bar.
 * - Display the active route through an outlet.
 */
import { Outlet } from "react-router-dom";
import Sidebar from "../features/dashboard/components/sidebar/Sidebar";
import Topbar from "../features/dashboard/components/topbar/Topbar";

import { useAuth } from "../features/auth/context/AuthContext";

import { schoolAdminMenu } from "../features/dashboard/config/schoolAdminConfig";
import { superAdminMenu } from "../features/dashboard/config/superAdminConfig";

function MainLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) { 
    return <p>Unauthorized</p>;
  }

  let menu = [];
  let role = "";

  switch (user.role) {
    case "admin":
      menu = schoolAdminMenu;
      role = "School Admin";
      break;

    case "super_admin":
      menu = superAdminMenu;
      role = "Super Admin";
      break;

    default:
      menu = [];
      role = "";
  }

  return (
    <div className="dashboard-layout">
      <Sidebar menu={menu} role={role} />

      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
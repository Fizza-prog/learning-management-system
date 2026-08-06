import { currentUser } from "../../data/currentUser";

import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SchoolAdminDashboard from "./pages/SchoolAdminDashboard";

function DashboardRouter() {
  switch (currentUser.role) {
    case "super_admin":
      return <SuperAdminDashboard />;

    case "admin":
      return <SchoolAdminDashboard />;

    default:
      return <h1>Unauthorized</h1>;
  }
}

export default DashboardRouter;

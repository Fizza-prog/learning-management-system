import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/header/DashboardHeader";
import StatsGrid from "../components/stats/StatsGrid";


import {
  superAdminMenu,
  superAdminStats,
  superAdminRecentSchools,
  superAdminTenantGrowth,
} from "../config/superAdminConfig";
import DashboardBody from "../components/body/DashboardBody";

function SuperAdminDashboard() {
  return (
    <DashboardLayout menu={superAdminMenu}  role="Super Admin">
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back, Super Admin"
        buttonText="Add New School"
      />

      <StatsGrid stats={superAdminStats} />
      <DashboardBody/>
      
    </DashboardLayout>
  );
}

export default SuperAdminDashboard;
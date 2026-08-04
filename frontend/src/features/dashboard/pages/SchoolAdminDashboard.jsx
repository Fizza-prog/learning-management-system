import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/header/DashboardHeader";
import StatsGrid from "../components/stats/StatsGrid";
import {
  schoolAdminMenu,
  schoolAdminHeader,
  schoolAdminStats,
} from "../config/schoolAdminConfig";
function SchoolAdminDashboard() {
  return (
    <DashboardLayout menu={schoolAdminMenu}  role="School Admin">
     <DashboardHeader
        title={schoolAdminHeader.title}
        subtitle={schoolAdminHeader.subtitle}
        buttonText={schoolAdminHeader.buttonText}
      />

      <StatsGrid stats={schoolAdminStats} />
    </DashboardLayout>
  );
}

export default SchoolAdminDashboard;
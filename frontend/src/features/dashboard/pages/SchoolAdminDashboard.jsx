import Announcements from "../../Announcements/pages/Announcements";
import DashboardHeader from "../components/header/DashboardHeader";
import StatsGrid from "../components/stats/StatsGrid";

import {
  schoolAdminHeader,
  schoolAdminStats,
} from "../config/schoolAdminConfig";

function SchoolAdminDashboard() {
  return (
    <>
      <DashboardHeader
        title={schoolAdminHeader.title}
        subtitle={schoolAdminHeader.subtitle}
        buttonText={schoolAdminHeader.buttonText}
      />

      <StatsGrid stats={schoolAdminStats} />
    </>
  );
}

export default SchoolAdminDashboard;
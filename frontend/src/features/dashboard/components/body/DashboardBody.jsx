import RecentSchools from "../table/RecentSchools";
import TenantGrowthChart from "../charts/TenantGrowthChart";

import {
  superAdminTenantGrowth,
  superAdminRecentSchools,
} from "../../config/superAdminConfig";


import "./DashboardBody.css";

function DashboardBody() {
  return (
    <section className="dashboard-body">
      {/* <RecentSchools schools={schoolAdminSchools} />

      <TenantGrowthChart /> */}
      <RecentSchools schools={superAdminRecentSchools} />

      <TenantGrowthChart
        data={superAdminTenantGrowth}
      />
    </section>
  );
}

export default DashboardBody;
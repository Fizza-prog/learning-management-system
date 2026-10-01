/**
 * @file DashboardBody.jsx
 * @description Composes the main data visualizations on the super-admin dashboard.
 *
 * Responsibilities:
 * - Render recent-school records.
 * - Render school tenant-growth data.
 */
import RecentSchools from "../table/RecentSchools";
import TenantGrowthChart from "../charts/TenantGrowthChart";

import "./DashboardBody.css";

function DashboardBody({
  recentSchools,
  tenantGrowth,
}) {
  return (
    <section className="dashboard-body">
      <RecentSchools schools={recentSchools} />

      <TenantGrowthChart data={tenantGrowth} />
    </section>
  );
}

export default DashboardBody;
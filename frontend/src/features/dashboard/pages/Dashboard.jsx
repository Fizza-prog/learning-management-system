import StatsCard from "../components/StatsCard";
import RecentActivity from "../components/RecentActivity";
import { dashboardConfig } from "../config/dashboardConfig";
import { useAuth } from "../../auth/context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "students";
  const dashboardData = dashboardConfig[role];

  if (!dashboardData) {
    return <h2>Dashboard configuration not found</h2>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="dashboard-subtext">Here's what's happening today.</p>
      </div>

      <div className="stats-container">
        {dashboardData.stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <RecentActivity activities={dashboardData.activities} />
    </div>
  );
}

export default Dashboard;
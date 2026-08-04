import DashboardHeader from "../components/header/DashboardHeader";
import Sidebar from "../components/sidebar/Sidebar";
import StatsGrid from "../components/stats/StatsGrid";
import RecentSchools from "../components/table/RecentSchools";
import Topbar from "../components/topbar/Topbar";
import './DashboardLayout.css'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
     <Sidebar/>

      <div className="dashboard-main">
       <Topbar/>

        <main className="dashboard-content">
          <DashboardHeader/>
          <StatsGrid/>
          <RecentSchools/>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
import DashboardBody from "../components/body/DashboardBody";
import DashboardHeader from "../components/header/DashboardHeader";
import Sidebar from "../components/sidebar/Sidebar";
import StatsGrid from "../components/stats/StatsGrid";
import Topbar from "../components/topbar/Topbar";
import './DashboardLayout.css'

function DashboardLayout({
  children,
  menu,
  role,
}) {
  return (
    <div className="dashboard-layout">
     <Sidebar menu={menu} role={role}/>

      <div className="dashboard-main">
       <Topbar/>

        <main className="dashboard-content">
         
        
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
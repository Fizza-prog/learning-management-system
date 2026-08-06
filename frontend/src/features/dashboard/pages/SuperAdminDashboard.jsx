
import DashboardHeader from "../components/header/DashboardHeader";
import StatsGrid from "../components/stats/StatsGrid";


import {
  superAdminHeader,
  superAdminStats,
} from "../config/superAdminConfig";
import DashboardBody from "../components/body/DashboardBody";

function SuperAdminDashboard() {
  return (
    <>
      <DashboardHeader
        title={superAdminHeader.title}
        subtitle={superAdminHeader.subtitle}
        buttonText={superAdminHeader.buttonText}
      />

    
        <StatsGrid stats={superAdminStats}/>

 
  <DashboardBody />

    </>
  );
}

export default SuperAdminDashboard;
























// import DashboardLayout from "../layouts/DashboardLayout";
// import DashboardHeader from "../components/header/DashboardHeader";
// import StatsGrid from "../components/stats/StatsGrid";


// import {
//   superAdminMenu,
//   superAdminStats,
//   superAdminRecentSchools,
//   superAdminTenantGrowth,
// } from "../config/superAdminConfig";
// import DashboardBody from "../components/body/DashboardBody";

// function SuperAdminDashboard() {
//   return (
//     <DashboardLayout menu={superAdminMenu}  role="Super Admin">
//       <DashboardHeader
//         title="Dashboard Overview"
//         subtitle="Welcome back, Super Admin"
//         buttonText="Add New School"
//       />

//       <StatsGrid stats={superAdminStats} />
//       <DashboardBody/>
      
//     </DashboardLayout>
//   );
// }

// export default SuperAdminDashboard;
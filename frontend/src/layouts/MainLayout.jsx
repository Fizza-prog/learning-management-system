import { Outlet } from "react-router-dom";
import Sidebar from "../features/dashboard/components/sidebar/Sidebar";
import Topbar from "../features/dashboard/components/topbar/Topbar";

import { currentUser } from "../data/currentUser";


import { schoolAdminMenu } from "../features/dashboard/config/schoolAdminConfig";


import { superAdminMenu } from "../features/dashboard/config/superAdminConfig";

// Later
// import { teacherMenu } from "../features/dashboard/config/teacherConfig";
// import { studentMenu } from "../features/dashboard/config/studentConfig";

function MainLayout() {
  let menu = [];
  let role = "";

  switch (currentUser.role) {
    case "admin":
      menu = schoolAdminMenu;
      role = "School Admin";
      break;

    case "super_admin":
      menu = superAdminMenu;
      role = "Super Admin";
      break;

    // case "teacher":
    //   menu = teacherMenu;
    //   role = "Teacher";
    //   break;

    // case "student":
    //   menu = studentMenu;
    //   role = "Student";
    //   break;

    default:
      menu = [];
      role = "";
  }

  return (
    <div className="dashboard-layout">
      <Sidebar menu={menu} role={role} />

      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;






// import { Outlet } from "react-router-dom";
// import Sidebar from "../features/dashboard/components/sidebar/Sidebar";
// import Topbar from "../features/dashboard/components/topbar/Topbar";

// function MainLayout() {
//   return (
//     <div className="dashboard-layout">

//       <Sidebar />

//       <div className="dashboard-content">

//         <Topbar />

//         <main>
//           <Outlet />
//         </main>

//       </div>

//     </div>
//   );
// }

// export default MainLayout;
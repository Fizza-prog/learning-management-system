import { NavLink } from "react-router-dom";
import './sidebar.css'
import {
  MdDashboard,
  MdSchool,
  MdPayments,
  MdPeople,
  MdSettings,
  MdHistory,
} from "react-icons/md";

import { sidebarMenu } from "../../config/dashboardConfig";

const iconMap = {
  dashboard: MdDashboard,
  school: MdSchool,
  billing: MdPayments,
  users: MdPeople,
  settings: MdSettings,
  logs: MdHistory,
};

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>EduSphere</h2>
        <p>Super Admin</p>
      </div>

      <nav className="sidebar-menu">
        {sidebarMenu.map((item) => {
          const Icon = iconMap[item.icon];

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="sidebar-link"
            >
              <Icon />
              <span className="sidebar-title">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
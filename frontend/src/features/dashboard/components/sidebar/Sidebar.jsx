import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  MdDashboard,
  MdSchool,
  MdPayments,
  MdPeople,
  MdSettings,
  MdHistory,
  MdGroups,
  MdClass,
  MdCalendarMonth,
  MdFactCheck,
  MdCampaign,
  MdAssessment,
  MdLogout,
  MdPersonAdd,
} from "react-icons/md";

const iconMap = {
  dashboard: MdDashboard,
  school: MdSchool,
  billing: MdPayments,
  users: MdPeople,
  settings: MdSettings,
  logs: MdHistory,

  // School Admin
  students: MdGroups,
  teachers: MdPeople,
  classes: MdClass,
  timetable: MdCalendarMonth,
  attendance: MdFactCheck,
  fees: MdPayments,
  reports: MdAssessment,
  announcement: MdCampaign,
};

function Sidebar({ menu, role }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h2>EduSphere</h2>
        <p>{role}</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {menu.map((item) => {
          const Icon = iconMap[item.icon];

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {Icon && <Icon className="sidebar-icon" />}
              <span className="sidebar-title">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-add-member">
          <MdPersonAdd className="sidebar-footer-icon" />
          <span>Add New Member</span>
        </button>

        <button className="sidebar-logout">
          <MdLogout className="sidebar-footer-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
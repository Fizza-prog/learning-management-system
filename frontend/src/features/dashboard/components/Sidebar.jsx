import { NavLink, useNavigate } from "react-router-dom";
import { dashboardConfig } from "../config/dashboardConfig";
import { useAuth } from "../../auth/context/AuthContext";
import "./Sidebar.css";

import { FaGraduationCap } from "react-icons/fa";

import {
  MdDashboard,
  MdMenuBook,
  MdCalendarMonth,
  MdGrade,
  MdPayments,
} from "react-icons/md";

const iconMap = {
  dashboard: MdDashboard,
  courses: MdMenuBook,
  timetable: MdCalendarMonth,
  grades: MdGrade,
  fees: MdPayments,
};

function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const role = user?.role || "students";

  const menuItems = dashboardConfig[role]?.menu || [];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo-container">
        <FaGraduationCap className="sidebar-logo-icon" />

        <div className="sidebar-logo">EduLMS</div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {Icon && <Icon className="sidebar-icon" />}

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        className="logout-btn"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
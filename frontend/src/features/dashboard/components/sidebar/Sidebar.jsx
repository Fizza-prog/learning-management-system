/**
 * @file Sidebar.jsx
 * @description Renders role-specific dashboard navigation and account actions.
 *
 * Responsibilities:
 * - Build navigation links from the active role's menu.
 * - Provide the sidebar logout action.
 */
import { NavLink, useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import "./Sidebar.css";

import { logoutUser } from "../../../../api/authApi";

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
  MdAddBusiness,
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-brand">
          <FaGraduationCap className="sidebar-logo-icon" />
          <h2>EduLMS</h2>
        </div>
        <p>{role}</p>
      </div>

      <nav className="sidebar-menu">
        {menu.map((item) => {
          const Icon = iconMap[item.icon];

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {Icon && <Icon className="sidebar-icon" />}

              <span className="sidebar-title">
                {item.title}
              </span>
            </NavLink>
          );
        })}


        {/* 
        <button
          className="sidebar-add-member"
          onClick={() => navigate("/dashboard/add-member")}
        >
          <MdPersonAdd className="sidebar-footer-icon" />
          <span>Add New Member</span>
        </button>
        */}


        {/*
        <button
          className="sidebar-add-member"
          onClick={() => navigate("/dashboard/add-school")}
        >
          <MdAddBusiness className="sidebar-footer-icon" />
          <span>Add New School</span>
        </button>
        */}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <MdLogout className="sidebar-footer-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
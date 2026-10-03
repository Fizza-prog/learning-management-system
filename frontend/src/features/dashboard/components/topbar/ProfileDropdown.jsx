/**
 * @file ProfileDropdown.jsx
 * @description Provides the dashboard account menu in the top bar.
 *
 * Responsibilities:
 * - Display the signed-in user's profile actions.
 * - Manage menu visibility and logout behavior.
 */
import { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaCog,
  FaLock,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/context/AuthContext";
import "./ProfileDropdown.css";

export default function TopbarUser() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const userInitial =
    user?.firstName?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleNavigation = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <div className="topbar-user" ref={dropdownRef}>
      <div
        className="user-avatar"
        onClick={() => setOpen(!open)}
      >
        {userInitial}
      </div>

      {open && (
        <div className="profile-dropdown">

          <div className="profile-header">
            <h4>
              {user?.firstName} {user?.lastName}
            </h4>

            <p>
              {user?.role
                ?.replace("_", " ")
                .replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
            </p>
          </div>

          <div className="dropdown-divider"></div>

          <button
            type="button"
            className="dropdown-item"
            onClick={() =>
              handleNavigation("/dashboard/profile")
            }
          >
            <FaUser />
            <span>My Profile</span>
          </button>

          <button
            type="button"
            className="dropdown-item"
            onClick={() =>
              handleNavigation("/dashboard/account-settings")
            }
          >
            <FaCog />
            <span>Account Settings</span>
          </button>

          <button
            type="button"
            className="dropdown-item"
            onClick={() =>
              handleNavigation("/dashboard/change-password")
            }
          >
            <FaLock />
            <span>Change Password</span>
          </button>

          <button
            type="button"
            className="dropdown-item"
            onClick={() =>
              handleNavigation("/dashboard/help-support")
            }
          >
            <FaQuestionCircle />
            <span>Help & Support</span>
          </button>

          <div className="dropdown-divider"></div>

          <button
            type="button"
            className="dropdown-item logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </div>
      )}
    </div>
  );
}
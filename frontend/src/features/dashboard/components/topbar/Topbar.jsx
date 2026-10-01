/**
 * @file Topbar.jsx
 * @description Renders dashboard top-bar controls and account access.
 *
 * Responsibilities:
 * - Display notification controls.
 * - Include the profile dropdown.
 */
import {
  MdNotifications,
} from "react-icons/md";
import './Topbar.css'
import ProfileDropdown from "./ProfileDropdown";

function Topbar() {
  return (
    <header className="topbar">

      <div className="topbar-actions">
        <button className="notification-button">
          <MdNotifications />
        </button>

        <div className="topbar-user">
           <ProfileDropdown/>  
        </div>
      </div>
    </header>
  );
}

export default Topbar;
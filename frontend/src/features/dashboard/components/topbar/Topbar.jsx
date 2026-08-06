import {
  MdSearch,
  MdNotifications,
  MdAccountCircle,
} from "react-icons/md";
import './Topbar.css'
import ProfileDropdown from "./ProfileDropdown";

function Topbar() {
  return (
    <header className="topbar">
      {/* Search Section */}
      <div className="topbar-search">
        <MdSearch className="topbar-search-icon" />

        <input
          type="text"
          placeholder="Search schools, users, or billing..."
          className="topbar-search-input"
        />
      </div>

      {/* Actions Section */}
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
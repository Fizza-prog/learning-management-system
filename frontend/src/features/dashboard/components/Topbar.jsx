import { useAuth } from "../../auth/context/AuthContext";
import "./Topbar.css";

function Topbar() {
  const { user } = useAuth();

  const roleNames = {
    super_admin: "Super Admin",
    admin: "Admin",
    teacher: "Teacher",
    students: "Student",
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="dashboard-topbar">
      <div className="topbar-title">Dashboard</div>

      <div className="topbar-user">
        <div className="topbar-avatar">{initial}</div>
        <div className="topbar-user-info">
          <span>{user?.name || "User"}</span>
          <small>{roleNames[user?.role] || "Role"}</small>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
/**
 * @file Profile.jsx
 * @description Displays profile information for the authenticated user.
 *
 * Responsibilities:
 * - Read the current user from authentication context.
 * - Render the user's account details.
 */
import { useAuth } from "../../auth/context/AuthContext";
import "../components/adminList.css";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();

  const formatRole = (role) => {
    if (!role) return "—";

    return role
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const userInitial =
    user?.firstName?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">
      <div className="profile-page-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>My Profile</h1>
          <p>View your account information.</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {userInitial}
        </div>

        <div className="profile-name">
          <h2>
            {user?.firstName} {user?.lastName}
          </h2>
          <span>{formatRole(user?.role)}</span>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <label>First Name</label>
            <p>{user?.firstName || "—"}</p>
          </div>

          <div className="profile-detail">
            <label>Last Name</label>
            <p>{user?.lastName || "—"}</p>
          </div>

          <div className="profile-detail">
            <label>Email</label>
            <p>{user?.email || "—"}</p>
          </div>

          <div className="profile-detail">
            <label>Role</label>
            <p>{formatRole(user?.role)}</p>
          </div>

          <div className="profile-detail">
            <label>School ID</label>
            <p>{user?.schoolId || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
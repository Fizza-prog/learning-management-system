/**
 * @file ChangePassword.jsx
 * @description Provides the signed-in user's password-change form.
 *
 * Responsibilities:
 * - Validate current and new password fields.
 * - Submit password changes and display request feedback.
 */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { changePassword } from "../../../api/authApi";
import { useAuth } from "../../auth/context/AuthContext";
import "../components/header/DashboardHeader.css";
import "../components/adminList.css";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters long."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword(
        currentPassword,
        newPassword
      );

      setSuccess(response.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        clearAuth();
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Change Password</h1>
          <p>Update your account password.</p>
        </div>
      </div>

      <div className="change-password-card">
        {error && (
          <div className="password-error">
            {error}
          </div>
        )}

        {success && (
          <div className="password-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="password-field">
            <label>
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              required
            />
          </div>

          <div className="password-field">
            <label>
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              minLength={8}
              required
            />
          </div>

          <div className="password-field">
            <label>
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="dashboard-header-button"
            disabled={loading}
          >
            {loading
              ? "Changing..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
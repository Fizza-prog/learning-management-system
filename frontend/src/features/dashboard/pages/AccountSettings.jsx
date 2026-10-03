/**
 * @file AccountSettings.jsx
 * @description Manages the signed-in user's account email and security settings.
 *
 * Responsibilities:
 * - Submit email-change requests and verification flows.
 * - Load and update account preference state.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../auth/context/AuthContext";

import {
  changeEmail,
  changePassword,
  resendVerificationEmail,
} from "../../../api/authApi";

import "../components/header/DashboardHeader.css";
import "../components/adminList.css";
import "./AccountSettings.css";

function AccountSettings() {
  const navigate = useNavigate();
  const { user, logout, clearAuth } = useAuth();

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [passwordCurrentPassword, setPasswordCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // General states
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordCurrentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword === passwordCurrentPassword) {
      toast.error("New password must be different from your current password.");
      return;
    }

    try {
      setPasswordLoading(true);

      const result = await changePassword(
        passwordCurrentPassword,
        newPassword
      );

      toast.success(result.message || "Password changed successfully.");
      setPasswordCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      window.setTimeout(() => {
        clearAuth();
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newEmail || !currentPassword) {
      setError(
        "Please enter your new email and current password."
      );
      return;
    }

    if (
      newEmail.trim().toLowerCase() ===
      user?.email?.toLowerCase()
    ) {
      setError(
        "New email must be different from your current email."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await changeEmail(
        newEmail.trim(),
        currentPassword
      );

      setMessage(result.message);

      setNewEmail("");
      setCurrentPassword("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to change email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setMessage("");
    setError("");

    try {
      setResendLoading(true);

      const result = await resendVerificationEmail(
        user?.email
      );

      setMessage(result.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to resend verification email."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const formatRole = (role) => {
    if (!role) return "—";

    return role
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="account-settings-page">

      {/* Header */}

      <div className="account-settings-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Settings</h1>
          <p>Manage your account and school settings.</p>
        </div>
      </div>

      {/* Change Password */}

      <div className="account-settings-card">
        <h2>Change Password</h2>

        <form onSubmit={handleChangePassword}>
          <div className="settings-field">
            <label htmlFor="settingsCurrentPassword">Current Password</label>
            <input
              id="settingsCurrentPassword"
              type="password"
              autoComplete="current-password"
              value={passwordCurrentPassword}
              onChange={(event) => setPasswordCurrentPassword(event.target.value)}
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="settingsNewPassword">New Password</label>
            <input
              id="settingsNewPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="settingsConfirmNewPassword">Confirm New Password</label>
            <input
              id="settingsConfirmNewPassword"
              type="password"
              autoComplete="new-password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="dashboard-header-button"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>


      {/* Change Email */}

      <div className="account-settings-card">
        <h2>Change Email</h2>

        <div className="current-email">
          <label>Current Email</label>
          <p>{user?.email || "—"}</p>
        </div>

        <form onSubmit={handleChangeEmail}>

          <div className="settings-field">
            <label htmlFor="newEmail">
              New Email
            </label>

            <input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) =>
                setNewEmail(e.target.value)
              }
              placeholder="Enter new email"
            />
          </div>


          <div className="settings-field">
            <label htmlFor="currentPassword">
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              placeholder="Enter your current password"
            />
          </div>


          {message && (
            <p className="settings-success">
              {message}
            </p>
          )}


          {error && (
            <p className="settings-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="dashboard-header-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Change Email"}
          </button>

        </form>

        <p className="settings-note">
          A verification link will be sent to your new
          email address. Your email will only change after
          you verify the new address.
        </p>
      </div>


      {/* Email Verification */}

      <div className="account-settings-card">
        <h2>Email Verification</h2>

        <div className="verification-status">
          <label>Status</label>

          <p>
            {user?.isVerified ? (
              <span className="verified-status">
                ✓ Verified
              </span>
            ) : (
              <span className="unverified-status">
                Not Verified
              </span>
            )}
          </p>
        </div>


        {!user?.isVerified && (
          <>
            <p className="settings-note">
              Your email address has not been verified yet.
              Please verify it to access your account.
            </p>

            <button
              type="button"
              className="dashboard-header-button"
              onClick={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading
                ? "Sending..."
                : "Resend Verification Email"}
            </button>
          </>
        )}
      </div>


      {/* Account Information */}

      <div className="account-settings-card">
        <h2>Account Information</h2>

        <div className="account-info-grid">

          <div className="settings-info">
            <label>First Name</label>
            <p>{user?.firstName || "—"}</p>
          </div>


          <div className="settings-info">
            <label>Last Name</label>
            <p>{user?.lastName || "—"}</p>
          </div>


          <div className="settings-info">
            <label>Role</label>
            <p>{formatRole(user?.role)}</p>
          </div>


          <div className="settings-info">
            <label>School ID</label>
            <p>{user?.schoolId || "—"}</p>
          </div>


          <div className="settings-info">
            <label>Email</label>
            <p>{user?.email || "—"}</p>
          </div>


          <div className="settings-info">
            <label>Email Verification</label>

            <p>
              {user?.isVerified
                ? "Verified"
                : "Not Verified"}
            </p>
          </div>

        </div>

        <p className="settings-note">
          Account information can only be changed by an
          authorized administrator.
        </p>
      </div>


      {/* Danger Zone */}

      <div className="account-settings-card danger-zone">
        <h2>Danger Zone</h2>

        <p>
          Logging out will end your current session on
          this device.
        </p>

        <button
          type="button"
          className="danger-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default AccountSettings;
/**
 * @file Users.jsx
 * @description Manages the super-admin system-user directory.
 *
 * Responsibilities:
 * - Fetch, filter, sort, and paginate user records.
 * - Create, edit, and delete user accounts.
 */

import { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiMoreVertical,
  FiMail,
  FiSearch,
  FiUsers,
  FiHome,
  FiPlus,
  FiX,
} from "react-icons/fi";

import { getUsers, deleteUser } from "../../../api/userApi";
import { getSchools } from "../../../api/schoolApi";

import "../components/header/DashboardHeader.css";
import "./Users.css";
import "../components/adminList.css";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  const [deleteUserTarget, setDeleteUserTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");

  const menuRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await getSchools();
        setSchools(response.data?.schools || []);
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const usersResponse = await getUsers({
          page,
          limit,
          search: debouncedSearch,
          role: selectedRole,
          schoolId: selectedSchool,
          sortBy,
          sortOrder,
        });

        setUsers(usersResponse.users || []);
        setTotalUsers(usersResponse.total || 0);
        setTotalPages(usersResponse.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch users:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load users."
        );
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchUsers();
  }, [
    page,
    limit,
    debouncedSearch,
    selectedRole,
    selectedSchool,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
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

  const handleDeleteUser = (user) => {
    setOpenMenu(null);
    setDeleteUserTarget(user);
  };

  const confirmDeleteUser = async () => {
    if (!deleteUserTarget) return;

    try {
      setDeleting(true);
      setError("");

      await deleteUser(deleteUserTarget.id);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser.id !== deleteUserTarget.id
        )
      );

      setTotalUsers((currentTotal) =>
        Math.max(0, currentTotal - 1)
      );

      setDeleteUserTarget(null);
    } catch (error) {
      console.error("Failed to delete user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (userId) => {
    setOpenMenu(null);
    navigate(`/dashboard/add-member?edit=${userId}`);
  };

  const getSchoolName = (schoolId) => {
    return (
      schools.find((school) => school.id === schoolId)?.name ||
      "—"
    );
  };

  const formatRole = (role) => {
    if (!role) return "";

    return role
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // Only show full-page loading on the first load
  if (initialLoading) {
    return (
      <div className="users-page">
        <div className="users-loading">
          <div className="loading-spinner"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Users</h1>
          <p>Manage and oversee system users.</p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="users-summary-row admin-list-summary-row">
        <div className="users-count-card admin-list-count-card">
          <div className="users-count-icon admin-list-count-icon">
            <FiUsers />
          </div>

          <div className="users-count-info admin-list-count-info">
            <span className="count-label admin-list-count-label">
              {totalUsers === 1 ? "Member" : "Members"}
            </span>

            <span className="count-number admin-list-count-number">
              {totalUsers}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-header-button"
          onClick={() => navigate("/dashboard/add-member")}
        >
          <FiPlus />
          Add New Users
        </button>
      </div>

      <div className="users-toolbar admin-list-toolbar">
        <div className="users-search admin-list-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>

        <select
          value={selectedRole}
          onChange={(event) => {
            setSelectedRole(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="super_admin">Super Admin</option>
        </select>

        <select
          value={selectedSchool}
          onChange={(event) => {
            setSelectedSchool(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All Schools</option>

          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select> 

        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setPage(1);
          }}
        >
          <option value="createdAt">Created Date</option>
          <option value="firstName">Name</option>
          <option value="email">Email</option>
        </select>

        <button
          type="button"
          onClick={() =>
            setSortOrder(
              sortOrder === "ASC" ? "DESC" : "ASC"
            )
          }
        >
          {sortOrder === "ASC" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      <div className="users-table-container admin-list-table-container">
        <table className="users-table admin-list-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>School</th>
              <th className="actions-heading">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="empty-state"
                >
                  <div className="empty-state-content">
                    <div className="empty-state-icon">
                      <FiSearch />
                    </div>

                    <h3>
                      {searchTerm ||
                      selectedRole ||
                      selectedSchool
                        ? "No members found"
                        : "No members available"}
                    </h3>

                    <p>
                      {searchTerm ||
                      selectedRole ||
                      selectedSchool
                        ? "Try adjusting your filters."
                        : "Add your first member to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="member-info">
                      <div className="member-avatar">
                        {user.firstName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="member-name">
                        <span>
                          {user.firstName}{" "}
                          {user.lastName}
                        </span>

                        <small>
                          {formatRole(user.role)}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="email-info">
                      <FiMail />
                      <span>{user.email}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`role-badge ${user.role}`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </td>

                  <td>
                    <div className="school-info">
                      <FiHome />

                      <span>
                        {getSchoolName(user.schoolId)}
                      </span>
                    </div>
                  </td>

                  <td className="actions-cell">
                    <div
                      className="action-menu"
                      ref={
                        openMenu === user.id
                          ? menuRef
                          : null
                      }
                    >
                      <button
                        type="button"
                        className="action-menu-button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === user.id
                              ? null
                              : user.id
                          )
                        }
                        aria-label="Open actions"
                        aria-expanded={
                          openMenu === user.id
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenu === user.id && (
                        <div className="action-dropdown">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(user.id)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            onClick={() =>
                              handleDeleteUser(user)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="users-pagination admin-list-pagination">
        <span>
          Page {page} of {Math.max(1, totalPages)}
        </span>

        <div>
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage(
                (currentPage) => currentPage - 1
              )
            }
          >
            Previous
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() =>
              setPage(
                (currentPage) => currentPage + 1
              )
            }
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteUserTarget && (
        <div
          className="delete-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (!deleting) {
                setDeleteUserTarget(null);
              }
            }
          }}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <button
              type="button"
              className="delete-modal-close"
              aria-label="Close delete confirmation"
              onClick={() => setDeleteUserTarget(null)}
              disabled={deleting}
            >
              <FiX />
            </button>

            <div className="delete-modal-content">
              <h2 id="delete-modal-title">
                Delete User?
              </h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {deleteUserTarget.firstName}{" "}
                  {deleteUserTarget.lastName}
                </strong>
                ?
              </p>

              <span className="delete-modal-warning">
                This action cannot be undone.
              </span>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-confirm"
                onClick={confirmDeleteUser}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
                            <button
                type="button"
                className="delete-modal-cancel"
                onClick={() =>
                  setDeleteUserTarget(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;


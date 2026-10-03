/**
 * @file Teacher.jsx
 * @description Manages the school-admin teacher directory.
 *
 * Responsibilities:
 * - Fetch, search, verify-filter, sort, and paginate teachers.
 * - Edit and delete teacher accounts.
 */
import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FiMoreVertical,
  FiMail,
  FiSearch,
  FiUsers,
  FiPlus,
  FiX,
} from "react-icons/fi";

import { getUsers, deleteUser } from "../../../api/userApi";

import "../../dashboard/components/header/DashboardHeader.css";
import "../../dashboard/components/adminList.css";
import "./Teacher.css";

function Teacher() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [deleteTeacherTarget, setDeleteTeacherTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUsers({
          page,
          limit,
          search: debouncedSearch,
          role: "teacher",
          verificationStatus,
          sortBy: selectedSort === "newest" ? "createdAt" : "firstName",
          sortOrder: selectedSort === "name-asc" ? "ASC" : "DESC",
        });

        setTeachers(response.users || []);
        setTotalTeachers(response.total || 0);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load teachers."
        );
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchTeachers();
  }, [page, limit, debouncedSearch, verificationStatus, selectedSort]);

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

  const handleDeleteTeacher = (teacher) => {
    setOpenMenu(null);
    setDeleteTeacherTarget(teacher);
  };

  const confirmDeleteTeacher = async () => {
    if (!deleteTeacherTarget) return;

    try {
      setDeleting(true);
      setError("");

      await deleteUser(deleteTeacherTarget.id);
      toast.success("Teacher deleted successfully.");

      setTeachers((currentTeachers) =>
        currentTeachers.filter(
          (teacher) => teacher.id !== deleteTeacherTarget.id
        )
      );

      setTotalTeachers((currentTotal) =>
        Math.max(0, currentTotal - 1)
      );

      setDeleteTeacherTarget(null);
    } catch (error) {
      console.error("Failed to delete teacher:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete teacher."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (teacherId) => {
    setOpenMenu(null);

    navigate(
      `/dashboard/add-member?edit=${teacherId}`
    );
  };

  if (initialLoading) {
    return (
      <div className="teachers-page">
        <div className="teachers-loading">
          <div className="loading-spinner"></div>
          <p>Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teachers-page">
      <div className="teachers-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Teachers</h1>
          <p>Manage and oversee teachers in your school.</p>
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="teachers-summary-row admin-list-summary-row">
        <div className="teachers-count-card admin-list-count-card">
          <div className="teachers-count-icon admin-list-count-icon">
            <FiUsers />
          </div>

          <div className="teachers-count-info admin-list-count-info">
            <span className="count-label admin-list-count-label">
              {totalTeachers === 1 ? "Teacher" : "Teachers"}
            </span>

            <span className="count-number admin-list-count-number">
              {totalTeachers}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-header-button"
          onClick={() => navigate("/dashboard/add-member")}
        >
          <FiPlus />
          Add Teacher
        </button>
      </div>

      <div className="teachers-toolbar admin-list-toolbar">
        <div className="teachers-search admin-list-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>

        <select
          aria-label="Filter teachers by verification status"
          value={verificationStatus}
          onChange={(event) => {
            setVerificationStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All verification statuses</option>
          <option value="verified">Verified</option>
          <option value="unverified">Not verified</option>
        </select>

        <select
          aria-label="Sort teachers"
          value={selectedSort}
          onChange={(event) => {
            setSelectedSort(event.target.value);
            setPage(1);
          }}
        >
          <option value="newest">Newest first</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>

      <div className="teachers-table-container admin-list-table-container">
        <table className="teachers-table admin-list-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Email</th>
              <th>Verification</th>
              <th className="actions-heading">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="empty-state"
                >
                  <div className="empty-state-content">
                    <div className="empty-state-icon">
                      <FiSearch />
                    </div>

                    <h3>
                      {searchTerm
                        ? "No teachers found"
                        : "No teachers available"}
                    </h3>

                    <p>
                      {searchTerm
                        ? "Try adjusting your search."
                        : "Add your first teacher to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <div className="member-info">
                      <div className="member-avatar">
                        {teacher.firstName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="member-name">
                        <span>
                          {teacher.firstName}{" "}
                          {teacher.lastName}
                        </span>

                        <small>Teacher</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="email-info">
                      <FiMail />
                      <span>{teacher.email}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`verification-badge ${
                        teacher.isVerified
                          ? "verified"
                          : "not-verified"
                      }`}
                    >
                      {teacher.isVerified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <div
                      className="action-menu"
                      ref={
                        openMenu === teacher.id
                          ? menuRef
                          : null
                      }
                    >
                      <button
                        type="button"
                        className="action-menu-button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === teacher.id
                              ? null
                              : teacher.id
                          )
                        }
                        aria-label="Open actions"
                        aria-expanded={
                          openMenu === teacher.id
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenu === teacher.id && (
                        <div className="action-dropdown">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(teacher.id)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            onClick={() =>
                              handleDeleteTeacher(teacher)
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

      <div className="teachers-pagination admin-list-pagination">
        <span>
          Page {page} of {Math.max(1, totalPages)}
        </span>

        <div>
          <button
            type="button"
            disabled={page === 1 || loading}
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
            disabled={
              page >= totalPages || loading
            }
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
      {deleteTeacherTarget && (
        <div
          className="delete-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setDeleteTeacherTarget(null);
            }
          }}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-teacher-modal-title"
          >
            <button
              type="button"
              className="delete-modal-close"
              aria-label="Close delete confirmation"
              onClick={() => setDeleteTeacherTarget(null)}
              disabled={deleting}
            >
              <FiX />
            </button>

            <div className="delete-modal-content">
              <h2 id="delete-teacher-modal-title">
                Delete Teacher?
              </h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {deleteTeacherTarget.firstName}{" "}
                  {deleteTeacherTarget.lastName}
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
                onClick={confirmDeleteTeacher}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>

              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() =>
                  setDeleteTeacherTarget(null)
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

export default Teacher;
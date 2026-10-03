/**
 * @file Student.jsx
 * @description Manages the school-admin student directory.
 *
 * Responsibilities:
 * - Fetch, search, verify-filter, sort, and paginate students.
 * - Edit and delete student accounts.
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
import "./Student.css";

function Student() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [deleteStudentTarget, setDeleteStudentTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalStudents, setTotalStudents] = useState(0);
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
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUsers({
          page,
          limit,
          search: debouncedSearch,
          role: "student",
          verificationStatus,
          sortBy: selectedSort === "newest" ? "createdAt" : "firstName",
          sortOrder: selectedSort === "name-asc" ? "ASC" : "DESC",
        });

        setStudents(response.users || []);
        setTotalStudents(response.total || 0);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch students:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load students."
        );
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchStudents();
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

  const handleDeleteStudent = (student) => {
    setOpenMenu(null);
    setDeleteStudentTarget(student);
  };

  const confirmDeleteStudent = async () => {
    if (!deleteStudentTarget) return;

    try {
      setDeleting(true);
      setError("");

      await deleteUser(deleteStudentTarget.id);
      toast.success("Student deleted successfully.");

      setStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student.id !== deleteStudentTarget.id
        )
      );

      setTotalStudents((currentTotal) =>
        Math.max(0, currentTotal - 1)
      );

      setDeleteStudentTarget(null);
    } catch (error) {
      console.error("Failed to delete student:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete student."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (studentId) => {
    setOpenMenu(null);

    navigate(
      `/dashboard/add-member?edit=${studentId}`
    );
  };

  if (initialLoading) {
    return (
      <div className="students-page">
        <div className="students-loading">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="students-page">
      <div className="students-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Students</h1>
          <p>Manage and oversee students in your school.</p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="students-summary-row admin-list-summary-row">
        <div className="students-count-card admin-list-count-card">
          <div className="students-count-icon admin-list-count-icon">
            <FiUsers />
          </div>

          <div className="students-count-info admin-list-count-info">
            <span className="count-label admin-list-count-label">
              {totalStudents === 1 ? "Student" : "Students"}
            </span>

            <span className="count-number admin-list-count-number">
              {totalStudents}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-header-button"
          onClick={() => navigate("/dashboard/add-member")}
        >
          <FiPlus />
          Add Student
        </button>
      </div>

      <div className="students-toolbar admin-list-toolbar">
        <div className="students-search admin-list-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>

        <select
          aria-label="Filter students by verification status"
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
          aria-label="Sort students"
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

      <div className="students-table-container admin-list-table-container">
        <table className="students-table admin-list-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Verification</th>
              <th className="actions-heading">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
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
                        ? "No students found"
                        : "No students available"}
                    </h3>

                    <p>
                      {searchTerm
                        ? "Try adjusting your search."
                        : "Add your first student to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="member-info">
                      <div className="member-avatar">
                        {student.firstName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="member-name">
                        <span>
                          {student.firstName}{" "}
                          {student.lastName}
                        </span>

                        <small>Student</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="email-info">
                      <FiMail />
                      <span>{student.email}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`verification-badge ${
                        student.isVerified
                          ? "verified"
                          : "not-verified"
                      }`}
                    >
                      {student.isVerified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <div
                      className="action-menu"
                      ref={
                        openMenu === student.id
                          ? menuRef
                          : null
                      }
                    >
                      <button
                        type="button"
                        className="action-menu-button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === student.id
                              ? null
                              : student.id
                          )
                        }
                        aria-label="Open actions"
                        aria-expanded={
                          openMenu === student.id
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenu === student.id && (
                        <div className="action-dropdown">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(student.id)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            onClick={() =>
                              handleDeleteStudent(student)
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

      <div className="students-pagination admin-list-pagination">
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
      {deleteStudentTarget && (
        <div
          className="delete-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setDeleteStudentTarget(null);
            }
          }}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-student-modal-title"
          >
            <button
              type="button"
              className="delete-modal-close"
              aria-label="Close delete confirmation"
              onClick={() => setDeleteStudentTarget(null)}
              disabled={deleting}
            >
              <FiX />
            </button>

            <div className="delete-modal-content">
              <h2 id="delete-student-modal-title">
                Delete Student?
              </h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {deleteStudentTarget.firstName}{" "}
                  {deleteStudentTarget.lastName}
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
                onClick={confirmDeleteStudent}
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
                  setDeleteStudentTarget(null)
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

export default Student;
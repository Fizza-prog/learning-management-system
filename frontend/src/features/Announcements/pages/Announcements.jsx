/**
 * @file Announcements.jsx
 * @description Renders the administrator interface for school announcements.
 *
 * Responsibilities:
 * - Load, search, and paginate announcements with school scoping.
 * - Create, edit, and delete announcement records.
 */
import { useEffect, useState } from "react";

import {
  FiBell,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";

import { toast } from "react-toastify";

import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../../../api/announcementApi";

import { getSchools } from "../../../api/schoolApi";

import { useAuth } from "../../auth/context/AuthContext";

import "../../dashboard/components/header/DashboardHeader.css";
import "../../announcements/pages/Announcements.css";
import "../../dashboard/components/adminList.css";

const EMPTY_FORM = {
  title: "",
  schoolId: "",
  message: "",
};

function Announcements() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [announcements, setAnnouncements] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // --------------------------------
  // DEBOUNCE SEARCH
  // --------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // --------------------------------
  // CLOSE ACTION MENU ON OUTSIDE CLICK
  // --------------------------------

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".announcements-actions")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // --------------------------------
  // LOAD SCHOOLS FOR SUPER ADMIN
  // --------------------------------

  useEffect(() => {
    if (!isSuperAdmin) return;

    getSchools()
      .then((response) => {
        setSchools(response.data?.schools || []);
      })
      .catch((requestError) => {
        toast.error(
          requestError.response?.data?.message ||
            "Could not load schools."
        );
      });
  }, [isSuperAdmin]);

  // --------------------------------
  // LOAD ANNOUNCEMENTS
  // --------------------------------

  const loadAnnouncements = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAnnouncements({
        page,
        limit: 10,
        search: debouncedSearch,
        ...(isSuperAdmin && schoolFilter
          ? { schoolId: schoolFilter }
          : {}),
      });

      setAnnouncements(result.announcements || []);

      setPagination({
        total: result.total || 0,
        totalPages: result.totalPages || 0,
      });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Could not load announcements.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, [
    page,
    debouncedSearch,
    schoolFilter,
    isSuperAdmin,
  ]);

  // --------------------------------
  // CREATE ANNOUNCEMENT
  // --------------------------------

  const openCreate = () => {
    setOpenMenuId(null);
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  // --------------------------------
  // EDIT ANNOUNCEMENT
  // --------------------------------

  const openEdit = (announcement) => {
    setOpenMenuId(null);

    setEditing(announcement);

    setForm({
      title: announcement.title,
      schoolId: announcement.schoolId,
      message: announcement.message,
    });

    setModalOpen(true);
  };

  // --------------------------------
  // SUBMIT FORM
  // --------------------------------

  const submitForm = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      if (editing) {
        await updateAnnouncement(editing.id, {
          title: form.title,
          message: form.message,
        });

        toast.success("Announcement updated.");
      } else {
        const payload = {
          title: form.title,
          message: form.message,
        };

        if (isSuperAdmin) {
          payload.schoolId = form.schoolId;
        }

        await createAnnouncement(payload);

        toast.success("Announcement created.");
      }

      setModalOpen(false);

      await loadAnnouncements();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Could not save announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // OPEN DELETE CONFIRMATION
  // --------------------------------

  const handleDelete = (announcement) => {
    setOpenMenuId(null);
    setDeleteTarget(announcement);
  };

  // --------------------------------
  // CONFIRM DELETE
  // --------------------------------

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteAnnouncement(deleteTarget.id);

      toast.success("Announcement deleted.");

      const nextPage =
        announcements.length === 1 && page > 1
          ? page - 1
          : page;

      setDeleteTarget(null);
      setPage(nextPage);

      if (nextPage === page) {
        await loadAnnouncements();
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Could not delete announcement."
      );
    }
  };

  return (
    <section className="announcements-page">
      <header className="announcements-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Announcements</h1>

          <p>
            View and create important announcements.
          </p>
        </div>
      </header>

      <div className="announcements-summary-row admin-list-summary-row">
        <div className="announcements-count-card admin-list-count-card">
          <div className="admin-list-count-icon">
            <FiBell />
          </div>

          <div className="admin-list-count-info">
            <span className="admin-list-count-label">
              Total Announcements
            </span>

            <span className="admin-list-count-number">
              {pagination.total}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-header-button"
          onClick={openCreate}
        >
          <FiPlus />
          Add Announcement
        </button>
      </div>

      <div className="announcements-toolbar admin-list-toolbar">
        <label className="announcements-search admin-list-search">
          <FiSearch />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search announcements"
          />
        </label>

        {isSuperAdmin && (
          <select
            aria-label="Filter by school"
            value={schoolFilter}
            onChange={(event) => {
              setSchoolFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">
              All schools
            </option>

            {schools.map((school) => (
              <option
                key={school.id}
                value={school.id}
              >
                {school.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <p className="announcements-error">
          {error}
        </p>
      )}

      <div className="announcements-table-wrap admin-list-table-container">
        <table className="announcements-table admin-list-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>School</th>
              <th>Created by</th>
              <th>Date</th>
              <th className="actions-heading">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="announcements-empty"
                >
                  Loading announcements...
                </td>
              </tr>
            ) : announcements.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="announcements-empty"
                >
                  {error
                    ? "Announcements could not be loaded."
                    : "No announcements found."}
                </td>
              </tr>
            ) : (
              announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td>
                    <strong>
                      {announcement.title}
                    </strong>

                    <small>
                      {announcement.message}
                    </small>
                  </td>

                  <td>
                    {announcement.School?.name || "—"}
                  </td>

                  <td>
                    {[
                      announcement.creator?.firstName,
                      announcement.creator?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </td>

                  <td>
                    {new Date(
                      announcement.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="actions-cell">
                    <div className="announcements-actions">
                      <button
                        type="button"
                        className="announcements-menu-button"
                        title="Actions"
                        aria-label={`Actions for ${announcement.title}`}
                        aria-expanded={
                          openMenuId === announcement.id
                        }
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === announcement.id
                              ? null
                              : announcement.id
                          )
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenuId === announcement.id && (
                        <div className="announcements-action-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(announcement)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="announcements-delete-action"
                            onClick={() =>
                              handleDelete(announcement)
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

      <footer className="announcements-pagination admin-list-pagination">
        <span>
          Page {page} of{" "}
          {Math.max(1, pagination.totalPages)}
        </span>

        <div>
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() =>
              setPage((current) => current - 1)
            }
          >
            Previous
          </button>

          <button
            type="button"
            disabled={
              page >= pagination.totalPages ||
              loading
            }
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Next
          </button>
        </div>
      </footer>

      {/* CREATE / EDIT MODAL */}

      {modalOpen && (
        <div
          className="announcements-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
              setOpenMenuId(null);
            }
          }}
        >
          <form
            className="announcements-modal"
            onSubmit={submitForm}
          >
            <header>
              <div>
                <h2>
                  {editing
                    ? "Edit announcement"
                    : "Add announcement"}
                </h2>

                <p>
                  Share an update with the school
                  community.
                </p>
              </div>

              <button
                className="announcements-close"
                type="button"
                aria-label="Close"
                onClick={() =>
                  setModalOpen(false)
                }
              >
                <FiX />
              </button>
            </header>

            <label>
              Title

              <input
                required
                maxLength="255"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </label>

            {!editing && isSuperAdmin && (
              <label>
                School

                <select
                  required
                  value={form.schoolId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      schoolId: event.target.value,
                    }))
                  }
                >
                  <option value="">
                    Select school
                  </option>

                  {schools.map((school) => (
                    <option
                      key={school.id}
                      value={school.id}
                    >
                      {school.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Message

              <textarea
                required
                rows="7"
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
              />
            </label>

            <footer>
              <button
                type="submit"
                className="announcements-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editing
                  ? "Save changes"
                  : "Create announcement"}
              </button>
               <button
                type="button"
                className="announcements-secondary"
                onClick={() =>
                  setModalOpen(false)
                }
              >
                Cancel
              </button>

            </footer>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

      {deleteTarget && (
        <div
          className="announcements-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="announcements-modal announcements-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-announcement-title"
          >
            <header>
              <div>
                <h2 id="delete-announcement-title">
                  Delete Announcement
                </h2>

                <p>
                  This announcement will be permanently
                  deleted.
                </p>
              </div>

              <button
                className="announcements-close"
                type="button"
                aria-label="Close"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                <FiX />
              </button>
            </header>

            <p className="announcements-confirm-message">
              Are you sure you want to delete{" "}
              <strong>
                “{deleteTarget.title}”
              </strong>
              ?
            </p>

            <footer>

              <button
                type="button"
                className="announcements-delete-button"
                onClick={confirmDelete}
              >
                Delete
              </button>

              
              <button
                type="button"
                className="announcements-secondary"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}

export default Announcements;
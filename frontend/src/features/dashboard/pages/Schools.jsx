/**
 * @file Schools.jsx
 * @description Manages the super-admin school directory.
 *
 * Responsibilities:
 * - Fetch, search, filter, sort, and paginate school records.
 * - Create, edit, delete, and activate schools.
 */
import { useEffect, useState, useRef } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FiMoreVertical,
  FiSearch,
  FiPlus,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiX,
} from "react-icons/fi";

import {
  getSchools,
  deleteSchool,
} from "../../../api/schoolApi";

import "../components/header/DashboardHeader.css";
import "./Schools.css";
import "../components/adminList.css";

const SCHOOLS_PAGE_SIZE = 20;

function Schools() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );

  const [refreshVersion, setRefreshVersion] = useState(0);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: SCHOOLS_PAGE_SIZE,
    totalPages: 0,
  });

  const requestedPage = Number(searchParams.get("page") || 1);

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const search = (searchParams.get("search") || "").trim();

  const requestedStatus = searchParams.get("status") || "all";

  const status = ["all", "active", "inactive"].includes(
    requestedStatus
  )
    ? requestedStatus
    : "all";

  const sortBy =
    searchParams.get("sortBy") === "name"
      ? "name"
      : "createdAt";

  const sortOrder =
    searchParams.get("sortOrder")?.toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  const sortValue = `${sortBy}:${sortOrder}`;

  const hasAppliedFilters = Boolean(
    search ||
      status !== "all" ||
      sortBy !== "createdAt" ||
      sortOrder !== "DESC"
  );

  const hasFilters =
    hasAppliedFilters || Boolean(searchTerm.trim());

  const searchPending =
    searchTerm.trim() !== search;

  const menuRef = useRef(null);

  // --------------------------------
  // SET PAGE IN URL
  // --------------------------------

  const setPageInUrl = (nextPage, replace = false) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (nextPage > 1) {
          nextParams.set("page", String(nextPage));
        } else {
          nextParams.delete("page");
        }

        return nextParams;
      },
      { replace }
    );
  };

  // --------------------------------
  // SEARCH DEBOUNCE
  // --------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchTerm.trim();

      if (value === search) {
        return;
      }

      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(
            currentParams
          );

          if (value) {
            nextParams.set("search", value);
          } else {
            nextParams.delete("search");
          }

          nextParams.delete("page");

          return nextParams;
        },
        { replace: true }
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, search, setSearchParams]);

  // --------------------------------
  // SYNC SEARCH INPUT WITH URL
  // --------------------------------

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  // --------------------------------
  // FETCH SCHOOLS
  // --------------------------------

  useEffect(() => {
    let isCurrent = true;

    const fetchSchools = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSchools({
          page,
          limit: SCHOOLS_PAGE_SIZE,
          search,
          status,
          sortBy,
          sortOrder,
        });

        if (isCurrent) {
          setSchools(response.data?.schools || []);

          setPagination(
            response.data?.pagination || {
              total: 0,
              page,
              limit: SCHOOLS_PAGE_SIZE,
              totalPages: 0,
            }
          );
        }
      } catch (error) {
        if (isCurrent) {
          console.error(
            "Failed to fetch schools:",
            error
          );

          setError(
            error.response?.data?.message ||
              "Failed to load schools."
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
          setHasLoaded(true);
        }
      }
    };

    fetchSchools();

    return () => {
      isCurrent = false;
    };
  }, [
    page,
    search,
    status,
    sortBy,
    sortOrder,
    refreshVersion,
  ]);

  // --------------------------------
  // CLOSE ACTION MENU ON OUTSIDE CLICK
  // --------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // --------------------------------
  // CLOSE DELETE MODAL WITH ESC
  // --------------------------------

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !deleteLoading) {
        setDeleteTarget(null);
      }
    };

    if (deleteTarget) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [deleteTarget, deleteLoading]);

  // --------------------------------
  // OPEN DELETE MODAL
  // --------------------------------

  const handleDeleteSchool = (school) => {
    setOpenMenu(null);
    setDeleteTarget(school);
  };

  // --------------------------------
  // CONFIRM DELETE SCHOOL
  // --------------------------------

  const confirmDeleteSchool = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      const response = await deleteSchool(
        deleteTarget.id
      );

      toast.success(
        response.message || "School deleted successfully."
      );
      setDeleteTarget(null);

      const schoolLeavesFilteredResults =
        !response.school || status === "active";

      if (
        schoolLeavesFilteredResults &&
        schools.length === 1 &&
        page > 1
      ) {
        setPageInUrl(page - 1, true);
      } else {
        setRefreshVersion(
          (currentVersion) => currentVersion + 1
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete school:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete school."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // --------------------------------
  // EDIT SCHOOL
  // --------------------------------

  const handleEdit = (schoolId) => {
    setOpenMenu(null);

    navigate(
      `/dashboard/schools/edit/${schoolId}`
    );
  };

  // --------------------------------
  // UPDATE FILTERS
  // --------------------------------

  const updateFilters = (changes) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(
          currentParams
        );

        const currentSearch = searchTerm.trim();

        if (currentSearch) {
          nextParams.set("search", currentSearch);
        } else {
          nextParams.delete("search");
        }

        for (const [key, value] of Object.entries(
          changes
        )) {
          if (value) {
            nextParams.set(key, value);
          } else {
            nextParams.delete(key);
          }
        }

        nextParams.delete("page");

        return nextParams;
      },
      { replace: true }
    );
  };

  // --------------------------------
  // CLEAR FILTERS
  // --------------------------------

  const clearFilters = () => {
    setSearchTerm("");

    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(
          currentParams
        );

        [
          "search",
          "status",
          "sortBy",
          "sortOrder",
          "page",
        ].forEach((key) => {
          nextParams.delete(key);
        });

        return nextParams;
      },
      { replace: true }
    );
  };

  // --------------------------------
  // LOADING STATE
  // --------------------------------

  if (loading && !hasLoaded) {
    return (
      <div className="schools-page">
        <div className="schools-loading">
          <div className="loading-spinner"></div>
          <p>Loading schools...</p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // MAIN UI
  // --------------------------------

  return (
    <div className="schools-page">

      <div className="schools-header admin-list-header">
        <div className="schools-header-content admin-list-header-content">
          <h1>Schools</h1>

          <p>
            Manage and oversee all schools.
          </p>
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="schools-summary-row admin-list-summary-row">
        <div className="schools-count-card admin-list-count-card">
          <div className="schools-count-icon">
            <FiHome />
          </div>

          <div className="schools-count-info admin-list-count-info">
            <span className="count-label admin-list-count-label">
              {hasAppliedFilters
                ? "Schools found"
                : "Total Schools"}
            </span>

            <span className="count-number admin-list-count-number">
              {pagination.total}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-header-button"
          onClick={() =>
            navigate("/dashboard/schools/add")
          }
        >
          <FiPlus />
          Add New School
        </button>
      </div>

      <div className="schools-toolbar admin-list-toolbar">

        <label className="schools-search-container admin-list-search">
          <FiSearch aria-hidden="true" />

          <input
            type="search"
            aria-label="Search schools"
            placeholder="Search schools..."
            maxLength={100}
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </label>

        <label className="schools-filter-control admin-list-filter">
          <select
            aria-label="Filter schools by status"
            value={status}
            onChange={(event) =>
              updateFilters({
                status:
                  event.target.value === "all"
                    ? ""
                    : event.target.value,
              })
            }
          >
            <option value="all">
              All Statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </label>

        <label className="schools-filter-control admin-list-filter">
          <select
            aria-label="Sort schools"
            value={sortValue}
            onChange={(event) => {
              const [
                nextSortBy,
                nextSortOrder,
              ] = event.target.value.split(":");

              updateFilters({
                sortBy:
                  nextSortBy === "createdAt"
                    ? ""
                    : nextSortBy,

                sortOrder:
                  nextSortOrder === "DESC"
                    ? ""
                    : nextSortOrder,
              });
            }}
          >
            <option value="createdAt:DESC">
              Newest
            </option>

            <option value="createdAt:ASC">
              Oldest
            </option>

            <option value="name:ASC">
              Name: A to Z
            </option>

            <option value="name:DESC">
              Name: Z to A
            </option>
          </select>
        </label>

        {hasFilters && (
          <button
            type="button"
            className="schools-clear-filters admin-list-clear"
            onClick={clearFilters}
          >
            <FiX aria-hidden="true" />
            Clear Filters
          </button>
        )}
      </div>

      {loading && (
        <p
          className="schools-loading-status"
          role="status"
        >
          Loading schools...
        </p>
      )}

      <div className="schools-table-container admin-list-table-container">
        <table className="schools-table admin-list-table">

          <thead>
            <tr>
              <th>School</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Status</th>
              <th className="actions-heading">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="schools-loading-cell"
                >
                  Loading schools...
                </td>
              </tr>
            ) : schools.length === 0 ? (
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
                      {hasFilters
                        ? "No schools found"
                        : "No schools available"}
                    </h3>

                    <p>
                      {hasFilters
                        ? "Try adjusting your search or filters."
                        : "Add your first school to get started."}
                    </p>

                  </div>
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr key={school.id}>

                  <td>
                    <div className="school-info">

                      <div className="school-avatar">
                        {school.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="school-name">
                        <span>
                          {school.name}
                        </span>

                        <small>
                          {school.email}
                        </small>
                      </div>

                    </div>
                  </td>

                  <td>
                    <div className="contact-info">

                      <div>
                        <FiMail />

                        <span>
                          {school.email}
                        </span>
                      </div>

                      <div>
                        <FiPhone />

                        <span>
                          {school.phone}
                        </span>
                      </div>

                    </div>
                  </td>

                  <td>
                    <div className="address-info">
                      <FiMapPin />

                      <span>
                        {school.address}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`school-status-badge ${
                        school.isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      <span className="status-dot"></span>

                      {school.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="actions-cell">

                    <div
                      className="action-menu"
                      ref={
                        openMenu === school.id
                          ? menuRef
                          : null
                      }
                    >

                      <button
                        type="button"
                        className="action-menu-button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === school.id
                              ? null
                              : school.id
                          )
                        }
                        aria-label="Open actions"
                        aria-expanded={
                          openMenu === school.id
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenu === school.id && (
                        <div className="action-dropdown">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                school.id
                              )
                            }
                            disabled={
                              !school.isActive
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            onClick={() =>
                              handleDeleteSchool(
                                school
                              )
                            }
                            disabled={
                              !school.isActive
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

      <div className="schools-pagination admin-list-pagination">

        <span>
          Page {page} of{" "}
          {Math.max(
            1,
            pagination.totalPages
          )}
        </span>

        <div>

          <button
            type="button"
            disabled={
              page <= 1 ||
              loading ||
              searchPending
            }
            onClick={() =>
              setPageInUrl(page - 1)
            }
          >
            Previous
          </button>

          <button
            type="button"
            disabled={
              page >=
                pagination.totalPages ||
              loading ||
              searchPending
            }
            onClick={() =>
              setPageInUrl(page + 1)
            }
          >
            Next
          </button>

        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}

      {deleteTarget && (
        <div
          className="schools-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleteLoading
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="schools-modal schools-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-school-title"
            aria-describedby="delete-school-message"
          >

            <header>

              <div>
                <h2 id="delete-school-title">
                  Delete School
                </h2>

                <p>
                  This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                className="schools-close"
                aria-label="Close"
                onClick={() =>
                  !deleteLoading &&
                  setDeleteTarget(null)
                }
                disabled={deleteLoading}
              >
                <FiX />
              </button>

            </header>

            <p
              id="delete-school-message"
              className="schools-confirm-message"
            >
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.name}
              </strong>
              ?
            </p>

            <footer>

              
              <button
                type="button"
                className="schools-delete-button"
                onClick={confirmDeleteSchool}
                disabled={deleteLoading}
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete School"}
              </button>

              <button
                type="button"
                className="schools-secondary-button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>


            </footer>

          </div>
        </div>
      )}

    </div>
  );
}

export default Schools;
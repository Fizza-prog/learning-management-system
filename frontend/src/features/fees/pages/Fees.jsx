/**
 * @file Fees.jsx
 * @description Manages fee records for school and super administrators.
 *
 * Responsibilities:
 * - Fetch, search, filter, and paginate fee records.
 * - Create, edit, mark paid, and delete fees.
 */
import { useEffect, useState } from "react";

import {
  FiDollarSign,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";

import { toast } from "react-toastify";

import {
  createFee,
  deleteFee,
  getFees,
  updateFee,
} from "../../../api/feeApi";

import { getSchools } from "../../../api/schoolApi";
import { getUsers } from "../../../api/userApi";

import { useAuth } from "../../auth/context/AuthContext";

import "../../dashboard/components/header/DashboardHeader.css";
import "../../dashboard/components/adminList.css";
import "./Fees.css";

const EMPTY_FORM = {
  schoolId: "",
  studentId: "",
  feeType: "Tuition",
  amount: "",
  dueDate: "",
  description: "",
  status: "pending",
};

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Fees() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [fees, setFees] = useState([]);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const activeSchools = schools.filter((school) => school.isActive);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    schoolId: "",
    status: "",
    feeType: "",
  });

  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const editingInactiveSchool = editingFee
    ? schools.find(
        (school) =>
          school.id === form.schoolId && !school.isActive
      )
    : null;

  // --------------------------------
  // CLOSE ACTION MENU ON OUTSIDE CLICK
  // --------------------------------

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".fees-actions")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // --------------------------------
  // LOAD SCHOOLS
  // --------------------------------

  useEffect(() => {
    if (!isSuperAdmin) return;

    getSchools()
      .then((response) =>
        setSchools(response.data?.schools || [])
      )
      .catch((error) =>
        toast.error(
          error.response?.data?.message ||
            "Could not load schools."
        )
      );
  }, [isSuperAdmin]);

  // --------------------------------
  // LOAD FEES
  // --------------------------------

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await getFees({
          page,
          limit: 10,
          ...filters,
        });

        setFees(response.fees || []);

        setPagination({
          total: response.total || 0,
          totalPages: response.totalPages || 0,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Could not load fees."
        );
      } finally {
        setLoading(false);
      }
    }, filters.search ? 300 : 0);

    return () => clearTimeout(timer);
  }, [page, filters]);

  // --------------------------------
  // LOAD STUDENTS
  // --------------------------------

  useEffect(() => {
    if (!formOpen) return;

    const schoolId = isSuperAdmin
      ? form.schoolId
      : user?.schoolId;

    setStudents([]);

    setForm((current) => ({
      ...current,
      studentId: "",
    }));

    if (!schoolId) return;

    getUsers({
      role: "student",
      schoolId,
      page: 1,
      limit: 100,
    })
      .then((response) =>
        setStudents(response.users || [])
      )
      .catch((error) =>
        toast.error(
          error.response?.data?.message ||
            "Could not load students."
        )
      );
  }, [
    form.schoolId,
    formOpen,
    isSuperAdmin,
    user?.schoolId,
  ]);

  // --------------------------------
  // FILTERS
  // --------------------------------

  const changeFilter = (key, value) => {
    setPage(1);

    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // --------------------------------
  // CREATE FEE
  // --------------------------------

  const openCreate = () => {
    setOpenMenuId(null);

    setEditingFee(null);

    setForm({
      ...EMPTY_FORM,
      schoolId: isSuperAdmin
        ? ""
        : user?.schoolId || "",
    });

    setFormOpen(true);
  };

  // --------------------------------
  // EDIT FEE
  // --------------------------------

  const openEdit = (fee) => {
    setOpenMenuId(null);

    setEditingFee(fee);

    setForm({
      schoolId: fee.schoolId,
      studentId: fee.studentId,
      feeType: fee.feeType,
      amount: fee.amount,
      dueDate: new Date(fee.dueDate)
        .toISOString()
        .slice(0, 10),
      description: fee.description || "",
      status: fee.status,
    });

    setFormOpen(true);
  };

  // --------------------------------
  // REFRESH FEES
  // --------------------------------

  const refreshFees = async (targetPage = page) => {
    const response = await getFees({
      page: targetPage,
      limit: 10,
      ...filters,
    });

    setFees(response.fees || []);

    setPagination({
      total: response.total || 0,
      totalPages: response.totalPages || 0,
    });
  };

  // --------------------------------
  // SUBMIT FORM
  // --------------------------------

  const submitForm = async (event) => {
    event.preventDefault();

    setSaving(true);

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    if (!isSuperAdmin) delete payload.schoolId;

    try {
      if (editingFee) {
        await updateFee(editingFee.id, payload);
      } else {
        await createFee(payload);
      }

      toast.success(
        editingFee
          ? "Fee updated."
          : "Fee created."
      );

      setFormOpen(false);
      setPage(1);

      await refreshFees(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not save fee."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // MARK PAID
  // --------------------------------

  const markPaid = async (fee) => {
    setOpenMenuId(null);

    try {
      await updateFee(fee.id, {
        status: "paid",
      });

      toast.success("Fee marked as paid.");

      await refreshFees();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not update fee."
      );
    }
  };

  // --------------------------------
  // OPEN DELETE CONFIRMATION
  // --------------------------------

  const removeFee = (fee) => {
    setOpenMenuId(null);
    setDeleteTarget(fee);
  };

  // --------------------------------
  // CONFIRM DELETE
  // --------------------------------

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteFee(deleteTarget.id);

      toast.success("Fee deleted.");

      const targetPage =
        fees.length === 1 && page > 1
          ? page - 1
          : page;

      setDeleteTarget(null);
      setPage(targetPage);

      await refreshFees(targetPage);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not delete fee."
      );
    }
  };

  return (
    <section className="fees-page">
      <header className="fees-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Fees</h1>

          <p>
            Manage and track school fee records.
          </p>
        </div>
      </header>

      <div className="fees-summary-row admin-list-summary-row">
        <div className="fees-count-card admin-list-count-card">
          <div className="admin-list-count-icon">
            <FiDollarSign />
          </div>

          <div className="admin-list-count-info">
            <span className="admin-list-count-label">
              Total Fee Records
            </span>

            <span className="admin-list-count-number">
              {pagination.total}
            </span>
          </div>
        </div>

        <button
          className="dashboard-header-button"
          type="button"
          onClick={openCreate}
        >
          <FiPlus />
          Add Fee
        </button>
      </div>

      <div className="fees-toolbar admin-list-toolbar">
        <label className="fees-search admin-list-search">
          <FiSearch />

          <input
            value={filters.search}
            onChange={(event) =>
              changeFilter(
                "search",
                event.target.value
              )
            }
            placeholder="Search students"
          />
        </label>

        {isSuperAdmin && (
          <select
            aria-label="Filter by school"
            value={filters.schoolId}
            onChange={(event) =>
              changeFilter(
                "schoolId",
                event.target.value
              )
            }
          >
            <option value="">
              All schools
            </option>

            {activeSchools.map((school) => (
              <option
                key={school.id}
                value={school.id}
              >
                {school.name}
              </option>
            ))}
          </select>
        )}

        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(event) =>
            changeFilter(
              "status",
              event.target.value
            )
          }
        >
          <option value="">
            All statuses
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="overdue">
            Overdue
          </option>
        </select>

        <select
          aria-label="Filter by fee type"
          value={filters.feeType}
          onChange={(event) =>
            changeFilter(
              "feeType",
              event.target.value
            )
          }
        >
          <option value="">
            All fee types
          </option>

          <option>Tuition</option>
          <option>Admission</option>
          <option>Exam</option>
          <option>Transport</option>
          <option>Other</option>
        </select>
      </div>

      <div className="fees-table-wrap admin-list-table-container">
        <table className="fees-table admin-list-table">
          <thead>
            <tr>
              <th>Student</th>

              {isSuperAdmin && (
                <th>School</th>
              )}

              <th>Fee type</th>
              <th>Amount</th>
              <th>Due date</th>
              <th>Status</th>
              <th className="actions-heading">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={isSuperAdmin ? 7 : 6}
                  className="fees-empty"
                >
                  Loading fees...
                </td>
              </tr>
            ) : fees.length === 0 ? (
              <tr>
                <td
                  colSpan={isSuperAdmin ? 7 : 6}
                  className="fees-empty"
                >
                  No fee records found.
                </td>
              </tr>
            ) : (
              fees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <strong>
                      {fee.student?.firstName}{" "}
                      {fee.student?.lastName}
                    </strong>

                    <small>
                      {fee.student?.email}
                    </small>
                  </td>

                  {isSuperAdmin && (
                    <td>
                      {fee.School?.name || "—"}
                    </td>
                  )}

                  <td>{fee.feeType}</td>

                  <td>
                    {formatMoney(fee.amount)}
                  </td>

                  <td>
                    {new Date(
                      fee.dueDate
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={`fees-status fees-status-${fee.status}`}
                    >
                      <span className="status-dot"></span>
                      {fee.status}
                    </span>
                  </td>

                  <td className="actions-cell">
                    <div className="fees-actions">
                      <button
                        type="button"
                        className="fees-menu-button"
                        title="Actions"
                        aria-label={`Actions for ${fee.feeType} fee`}
                        aria-expanded={
                          openMenuId === fee.id
                        }
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === fee.id
                              ? null
                              : fee.id
                          )
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenuId === fee.id && (
                        <div className="fees-action-menu">
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(fee)
                            }
                          >
                            Edit
                          </button>

                          {fee.status !== "paid" && (
                            <button
                              type="button"
                              onClick={() =>
                                markPaid(fee)
                              }
                            >
                              Mark paid
                            </button>
                          )}

                          <button
                            type="button"
                            className="fees-delete-action"
                            onClick={() =>
                              removeFee(fee)
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

      <footer className="fees-pagination admin-list-pagination">
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
              page <= 1 || loading
            }
            onClick={() =>
              setPage(
                (current) => current - 1
              )
            }
          >
            Previous
          </button>

          <button
            type="button"
            disabled={
              page >=
                pagination.totalPages ||
              loading
            }
            onClick={() =>
              setPage(
                (current) => current + 1
              )
            }
          >
            Next
          </button>
        </div>
      </footer>

      {/* CREATE / EDIT MODAL */}

      {formOpen && (
        <div
          className="fees-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setFormOpen(false);
              setOpenMenuId(null);
            }
          }}
        >
          <form
            className="fees-modal"
            onSubmit={submitForm}
          >
            <header>
              <div>
                <h2>
                  {editingFee
                    ? "Edit fee"
                    : "Add fee"}
                </h2>

                <p>
                  Record a student fee and its
                  due date.
                </p>
              </div>

              <button
                className="fees-close"
                type="button"
                aria-label="Close"
                onClick={() =>
                  setFormOpen(false)
                }
              >
                <FiX />
              </button>
            </header>

            <div className="fees-form-grid">
              {isSuperAdmin && (
                <label>
                  School

                  {editingInactiveSchool ? (
                    <input
                      type="text"
                      value={`${editingInactiveSchool.name} (inactive)`}
                      disabled
                    />
                  ) : (
                    <select
                      required
                      value={form.schoolId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          schoolId:
                            event.target.value,
                        }))
                      }
                    >
                      <option value="">
                        Select school
                      </option>

                      {activeSchools.map((school) => (
                          <option
                            key={school.id}
                            value={school.id}
                          >
                            {school.name}
                          </option>
                        ))}
                    </select>
                  )}
                </label>
              )}

              <label>
                Student

                <select
                  required
                  value={form.studentId}
                  disabled={
                    !(
                      isSuperAdmin
                        ? form.schoolId
                        : user?.schoolId
                    )
                  }
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      studentId:
                        event.target.value,
                    }))
                  }
                >
                  <option value="">
                    Select student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.firstName}{" "}
                      {student.lastName} ·{" "}
                      {student.email}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Fee type

                <input
                  required
                  maxLength="80"
                  value={form.feeType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      feeType:
                        event.target.value,
                    }))
                  }
                  placeholder="Tuition"
                />
              </label>

              <label>
                Amount

                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      amount:
                        event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Due date

                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      dueDate:
                        event.target.value,
                    }))
                  }
                />
              </label>

              {editingFee && (
                <label>
                  Status

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status:
                          event.target.value,
                      }))
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="paid">
                      Paid
                    </option>

                    <option value="overdue">
                      Overdue
                    </option>
                  </select>
                </label>
              )}

              <label className="fees-description">
                Description

                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <footer>
              
              <button
                type="submit"
                className="fees-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingFee
                  ? "Save changes"
                  : "Create fee"}
              </button>
              <button
                type="button"
                className="fees-secondary-button"
                onClick={() =>
                  setFormOpen(false)
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
          className="fees-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="fees-modal fees-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-fee-title"
          >
            <header>
              <div>
                <h2 id="delete-fee-title">
                  Delete Fee
                </h2>

                <p>
                  This fee record will be
                  permanently deleted.
                </p>
              </div>

              <button
                className="fees-close"
                type="button"
                aria-label="Close"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                <FiX />
              </button>
            </header>

            <p className="fees-confirm-message">
              Are you sure you want to delete the{" "}
              <strong>
                {deleteTarget.feeType}
              </strong>{" "}
              fee for{" "}
              <strong>
                {deleteTarget.student?.firstName ||
                  "this student"}
              </strong>
              ?
            </p>

            <footer>
              
              <button
                type="button"
                className="fees-delete-button"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="fees-secondary-button"
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

export default Fees;
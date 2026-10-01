/**
 * @file AuditLogs.jsx
 * @description Displays paginated audit activity and individual log details.
 *
 * Responsibilities:
 * - Fetch and render audit log records.
 * - Present selected log metadata in a detail dialog.
 */
import { useEffect, useState } from "react";
import { FiSearch, FiEye } from "react-icons/fi";

import { getAuditLogs } from "../../../api/auditLogApi";

import "./AuditLogs.css";
import "../components/adminList.css";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchAuditLogs = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAuditLogs(page, 20);

      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const formatAction = (action) => {
    if (!action) return "—";

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
  };

  const formatEntity = (entity) => {
    if (!entity) return "—";

    return entity
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  if (loading) {
    return (
      <div className="audit-logs-page">
        <div className="audit-logs-loading">
          <div className="loading-spinner"></div>
          <p>Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-logs-page">
      <div className="audit-logs-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Audit Logs</h1>
          <p>
            View administrative activity and system changes.
          </p>
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="audit-logs-count-row admin-list-summary-row">
        <div className="audit-logs-count-card admin-list-count-card">
          <div className="audit-logs-count-icon admin-list-count-icon">
            <FiSearch />
          </div>

          <div className="audit-logs-count-info admin-list-count-info">
            <span className="count-label admin-list-count-label">
              Audit Logs
            </span>
            <span className="count-number admin-list-count-number">
              {pagination.total}
            </span>
          </div>
        </div>
      </div>

      <div className="audit-logs-table-container admin-list-table-container">
        <table className="audit-logs-table admin-list-table">
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Performed By</th>
              <th>School ID</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="empty-state"
                >
                  <div className="empty-state-content">
                    <div className="empty-state-icon">
                      <FiSearch />
                    </div>

                    <h3>No audit logs found</h3>

                    <p>
                      There are no audit records to display.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {formatDate(log.createdAt)}
                  </td>

                  <td>
                    <span
                      className={`audit-action-badge ${log.action}`}
                    >
                      {formatAction(log.action)}
                    </span>
                  </td>

                  <td>
                    {formatEntity(log.entity)}
                  </td>

                  <td>
                    {log.userId || "System"}
                  </td>

                  <td>
                    {log.schoolId || "—"}
                  </td>

                  <td>
                    {log.ipAddress || "—"}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="audit-details-button"
                      onClick={() =>
                        setSelectedLog(log)
                      }
                    >
                      <FiEye />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="audit-pagination admin-list-pagination">
        <span>
          Page {pagination.page} of {Math.max(1, pagination.totalPages)}
        </span>
        <div>
          <button
            type="button"
            disabled={pagination.page === 1}
            onClick={() =>
              fetchAuditLogs(pagination.page - 1)
            }
          >
            Previous
          </button>

          <button
            type="button"
            disabled={
              pagination.page >= Math.max(1, pagination.totalPages)
            }
            onClick={() =>
              fetchAuditLogs(pagination.page + 1)
            }
          >
            Next
          </button>
        </div>
      </div>

      {selectedLog && (
        <div className="audit-modal-overlay">
          <div className="audit-modal">
            <div className="audit-modal-header">
              <h2>Audit Log Details</h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedLog(null)
                }
              >
                ×
              </button>
            </div>

            <div className="audit-modal-content">
              <p>
                <strong>Action:</strong>{" "}
                {formatAction(selectedLog.action)}
              </p>

              <p>
                <strong>Entity:</strong>{" "}
                {formatEntity(selectedLog.entity)}
              </p>

              <p>
                <strong>Entity ID:</strong>{" "}
                {selectedLog.entityId || "—"}
              </p>

              <p>
                <strong>User ID:</strong>{" "}
                {selectedLog.userId || "System"}
              </p>

              <p>
                <strong>School ID:</strong>{" "}
                {selectedLog.schoolId || "—"}
              </p>

              <p>
                <strong>IP Address:</strong>{" "}
                {selectedLog.ipAddress || "—"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {formatDate(selectedLog.createdAt)}
              </p>

              <div className="metadata-section">
                <strong>Metadata</strong>

                <pre>
                  {JSON.stringify(
                    selectedLog.metadata,
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
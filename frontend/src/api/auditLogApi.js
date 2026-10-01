/**
 * @file auditLogApi.js
 * @description Fetches paginated audit-log records from the backend.
 *
 * Responsibilities:
 * - Request audit logs for a specified page and page size.
 */
import axiosInstance from "./axios";

export const getAuditLogs = async (page = 1, limit = 20) => {
  const { data } = await axiosInstance.get(
    `/audit-logs?page=${page}&limit=${limit}`
  );

  return data;
};
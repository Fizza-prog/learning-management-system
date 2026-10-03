/**
 * @file auditLogController.js
 * @description Handles paginated audit-log requests.
 *
 * Responsibilities:
 * - Read pagination parameters from the request.
 * - Return logs scoped by the authenticated user's role.
 */
import { getAuditLogsService } from "../services/auditLogService.js";
import { getPagination } from "../utils/pagination.js";
export const getAuditLogs = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const data = await getAuditLogsService(
      req.user,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Audit logs fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
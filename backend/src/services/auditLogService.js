/**
 * @file auditLogService.js
 * @description Persists and retrieves administrative audit records.
 *
 * Responsibilities:
 * - Create audit entries within caller-provided transactions.
 * - List paginated logs within the current administrator's school scope.
 */
import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
  userId = null,
  schoolId = null,
  action,
  entity,
  entityId = null,
  metadata = {},
  ipAddress = null,
  transaction = null,
}) => {
  return await AuditLog.create(
    {
      userId,
      schoolId,
      action,
      entity,
      entityId,
      metadata,
      ipAddress,
    },
    {
      transaction,
    }
  );
};

export const getAuditLogsService = async (currentUser, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  if (currentUser.role === "admin" && !currentUser.schoolId) {
    return {
      logs: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  const where = {};

  // Admin can only see logs from their own school
  if (currentUser.role === "admin") {
    where.schoolId = currentUser.schoolId;
  }

  const { count, rows } = await AuditLog.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    logs: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
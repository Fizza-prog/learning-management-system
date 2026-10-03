/**
 * @file validateUserFilters.js
 * @description Validates query parameters for user-list requests.
 *
 * Responsibilities:
 * - Check role, school, search, and verification filters.
 * - Restrict user sorting to supported fields and directions.
 */
import validator from "validator";

const allowedRoles = [
  "super_admin",
  "admin",
  "teacher",
  "student",
];

const allowedSortFields = [
  "firstName",
  "lastName",
  "email",
  "createdAt",
];

const allowedSortOrders = ["asc", "desc"];

export const validateUserFilters = (req, res, next) => {
  const {
    role,
    schoolId,
    search,
    verificationStatus,
    sortBy,
    sortOrder,
  } = req.query;

  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role filter",
    });
  }

  if (schoolId && !validator.isUUID(schoolId, 4)) {
    return res.status(400).json({
      success: false,
      message: "Invalid schoolId filter",
    });
  }

  if (search && search.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Search query is too long",
    });
  }

  if (
    verificationStatus &&
    !["verified", "unverified"].includes(verificationStatus)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification status filter",
    });
  }

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    return res.status(400).json({
      success: false,
      message: "Invalid sort field",
    });
  }

  if (
    sortOrder &&
    !allowedSortOrders.includes(sortOrder.toLowerCase())
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid sort order",
    });
  }

  next();
};
/**
 * @file validateSchoolFilters.js
 * @description Validates pagination and filter parameters for school lists.
 *
 * Responsibilities:
 * - Check page, limit, search, and status query values.
 * - Restrict school sorting to supported fields and directions.
 */
const isIntegerInRange = (value, min, max = Number.MAX_SAFE_INTEGER) => {
  if (value === undefined || value === "") return true;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return false;

  const number = Number(value);
  return Number.isSafeInteger(number) && number >= min && number <= max;
};

const invalidQuery = (res, message) =>
  res.status(400).json({ success: false, message });

export const validateSchoolFilters = (req, res, next) => {
  const { page, limit, search, status, sortBy, sortOrder } = req.query;

  if (!isIntegerInRange(page, 1)) {
    return invalidQuery(res, "Page must be a positive integer.");
  }

  if (!isIntegerInRange(limit, 1, 100)) {
    return invalidQuery(res, "Limit must be an integer between 1 and 100.");
  }

  if (search !== undefined && (typeof search !== "string" || search.length > 100)) {
    return invalidQuery(res, "Search must be text no longer than 100 characters.");
  }

  if (status !== undefined && !["all", "active", "inactive"].includes(status)) {
    return invalidQuery(res, "Status must be all, active, or inactive.");
  }

  if (sortBy !== undefined && !["createdAt", "name"].includes(sortBy)) {
    return invalidQuery(res, "Sort field must be createdAt or name.");
  }

  if (sortOrder !== undefined && !["asc", "desc"].includes(String(sortOrder).toLowerCase())) {
    return invalidQuery(res, "Sort order must be asc or desc.");
  }

  return next();
};
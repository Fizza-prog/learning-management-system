/**
 * @file pagination.js
 * @description Parses and validates page and limit query parameters.
 *
 * Responsibilities:
 * - Apply default pagination values.
 * - Reject invalid page sizes and calculate the query offset.
 */
import  AppError from "../utils/AppError.js";

export const getPagination = (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("Page must be a positive integer", 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError(
      "Limit must be an integer between 1 and 100",
      400
    );
  }

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
};
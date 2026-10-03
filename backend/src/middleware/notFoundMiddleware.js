/**
 * @file notFoundMiddleware.js
 * @description Handles requests that do not match a registered route.
 *
 * Responsibilities:
 * - Create a not-found application error.
 * - Forward it to the centralized error handler.
 */
import AppError from "../utils/AppError.js";

const notFound = (req, res, next) => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404
    )
  );
};

export default notFound;
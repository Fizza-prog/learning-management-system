/**
 * @file roleMiddleware.js
 * @description Restricts requests to configured user roles.
 *
 * Responsibilities:
 * - Compare the authenticated role with the allowed roles.
 * - Forward authorization failures to error handling middleware.
 */
import AppError from "../utils/AppError.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return next(new AppError("Access denied.", 403));
    }

    next();
  };
};

export default authorize;
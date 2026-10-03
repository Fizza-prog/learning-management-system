/**
 * @file errorMiddleware.js
 * @description Converts application and Sequelize errors into API responses.
 *
 * Responsibilities:
 * - Map recognized database errors to client status codes.
 * - Return a consistent JSON error response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Sequelize errors
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Duplicate value already exists.";
  }

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors
      ?.map((error) => error.message)
      .join(", ") || "Validation error.";
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Invalid related resource.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
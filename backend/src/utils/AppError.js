/**
 * @file AppError.js
 * @description Defines an application error carrying an HTTP status code.
 *
 * Responsibilities:
 * - Represent expected operational failures for Express middleware.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? "fail"
      : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
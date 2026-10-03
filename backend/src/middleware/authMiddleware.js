/**
 * @file authMiddleware.js
 * @description Verifies bearer access tokens for protected API requests.
 *
 * Responsibilities:
 * - Validate authorization headers and JWT signatures.
 * - Attach decoded user claims to the request.
 */
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";


const protect = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("No token provided", 401);
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AppError("Invalid authorization header", 401);
    }

    const token = parts[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Invalid token", 401));
  }
};

export default protect;
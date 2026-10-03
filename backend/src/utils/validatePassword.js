/**
 * @file validatePassword.js
 * @description Enforces the backend password policy.
 *
 * Responsibilities:
 * - Define the minimum accepted password length.
 * - Reject passwords that do not meet validation rules.
 */
import AppError from "./AppError.js";

export const MIN_PASSWORD_LENGTH = 8;

export const validatePassword = (password) => {
  if (
    typeof password !== "string" ||
    password.length < MIN_PASSWORD_LENGTH
  ) {
    throw new AppError(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      400
    );
  }
};
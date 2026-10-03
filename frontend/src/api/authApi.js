/**
 * @file authApi.js
 * @description Provides frontend requests for account authentication and verification.
 *
 * Responsibilities:
 * - Submit login, logout, token refresh, and password requests.
 * - Request email verification and account email changes.
 */
import axiosInstance from "./axios";

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post(
    "/auth/login",
    credentials
  );

  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post(
    "/auth/forgot-password",
    { email }
  );

  return data;
};

export const resetPassword = async (
  token,
  password
) => {
  const { data } = await axiosInstance.post(
    `/auth/reset-password/${token}`,
    { password }
  );

  return data;
};

export const refreshToken = async () => {
  const { data } = await axiosInstance.post(
    "/auth/refresh-token"
  );

  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post(
    "/auth/logout"
  );

  return data;
};

export const changePassword = async (
  currentPassword,
  newPassword
) => {
  const { data } = await axiosInstance.post(
    "/auth/change-password",
    {
      currentPassword,
      newPassword,
    }
  );

  return data;
};

export const changeEmail = async (
  newEmail,
  currentPassword
) => {
  const { data } = await axiosInstance.post(
    "/auth/change-email",
    {
      newEmail,
      currentPassword,
    }
  );

  return data;
};

export const verifyEmailChange = async (token) => {
  const { data } = await axiosInstance.get(
    `/auth/verify-email-change/${token}`
  );

  return data;
};

export const resendVerificationEmail = async (email) => {
  const { data } = await axiosInstance.post(
    "/auth/resend-verification-email",
    { email }
  );

  return data;
};
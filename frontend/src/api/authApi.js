import axiosInstance from "./axios";

// Register
export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post(
    "/auth/register",
    userData
  );

  return data;
};

// Login
export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post(
    "/auth/login",
    credentials
  );

  return data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post(
    "/auth/forgot-password",
    { email }
  );

  return data;
};

// Reset Password
export const resetPassword = async (token, password) => {
  const { data } = await axiosInstance.post(
    `/auth/reset-password/${token}`,
    { password }
  );

  return data;
};

// Refresh Token
export const refreshToken = async (refreshToken) => {
  const { data } = await axiosInstance.post(
    "/auth/refresh-token",
    {
      refreshToken,
    }
  );

  return data;
};

// Logout
export const logoutUser = async (refreshToken) => {
  const { data } = await axiosInstance.post(
    "/auth/logout",
    {
      refreshToken,
    }
  );

  return data;
};
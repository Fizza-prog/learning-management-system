/**
 * @file authController.js
 * @description Handles authentication, account recovery, and verification requests.
 *
 * Responsibilities:
 * - Translate authentication requests into service calls and responses.
 * - Set or clear the refresh-token cookie where required.
 */
import {
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
  resendVerificationEmailService,
  changePasswordService,
  changeEmailService,
  verifyEmailChangeService,
} from "../services/authService.js";

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body, req.ip);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const {
      refreshToken,
      ...responseData
    } = result;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await refreshAccessToken(
      req.cookies.refreshToken
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await forgotPasswordService(
        req.body.email
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await resetPasswordService(
        req.params.token,
        req.body.password,
        req.ip
      );

    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.params;

    const result =
      await verifyEmailService(token);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await resendVerificationEmailService(
        req.body.email
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await changePasswordService(
        req.user.id,
        req.body.currentPassword,
        req.body.newPassword,
        req.ip
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const changeEmail = async (
  req,
  res,
  next
) => {
  try {
    const result = await changeEmailService(
      req.user.id,
      req.body.newEmail,
      req.body.currentPassword,
      req.ip
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmailChange = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await verifyEmailChangeService(
        req.params.token,
        req.ip
      );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export {
  login,
  getProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
  changeEmail,
  verifyEmailChange,
};
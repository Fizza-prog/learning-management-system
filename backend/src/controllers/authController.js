const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
  resendVerificationEmailService
} = require("../services/authService");

const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { refreshToken, ...responseData } = result;


    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: responseData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const result = await refreshAccessToken(
      req.cookies.refreshToken
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(
      req.body.email
    );

    res.status(200).json({
      success: true,
      message: result,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(
      req.params.token,
      req.body.password
    );

    res.status(200).json({
      success: true,
      message: result,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await verifyEmailService(token);

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const resendVerificationEmail = async (
  req,
  res
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
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};
  
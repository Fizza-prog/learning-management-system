const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
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

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
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
      req.body.refreshToken
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
    await logoutUser(req.body.refreshToken);

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


module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
};
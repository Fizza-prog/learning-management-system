const sanitizeUser = (user) => {
  const userObject = user.toJSON();

  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpiry;

  return userObject;
};

module.exports = sanitizeUser;
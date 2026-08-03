export function validateLogin(formData) {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Enter a valid email";
  }

  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export function validateSignup(formData) {
  const errors = {};

  if (!formData.schoolName.trim()) {
    errors.schoolName = "School name is required";
  }

  if (!formData.adminName.trim()) {
    errors.adminName = "Admin name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Enter a valid email";
  }

  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!formData.confirmPassword.trim()) {
  errors.confirmPassword = "Confirm password is required";
} else if (formData.password !== formData.confirmPassword) {
  errors.confirmPassword = "Passwords do not match";
}

  return errors;
}

export function validateForgotPassword(formData) {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Enter a valid email";
  }

  return errors;
}
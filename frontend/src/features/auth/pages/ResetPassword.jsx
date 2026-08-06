import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { resetPassword } from "../../../api/authApi";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Confirm password is required";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);

      return;
    }

    try {
      const response = await resetPassword(
        token,
        formData.password
      );

      toast.success(response.message);

      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Password reset failed."
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>

        <p>Create a new password.</p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <AuthInput
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<FaLock />}
          />

          <AuthInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<FaLock />}
          />

          <button type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
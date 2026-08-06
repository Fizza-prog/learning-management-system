import { useState } from "react";
import AuthInput from "../components/AuthInput";
import { validateForgotPassword } from "../services/validation";
import { forgotPassword } from "../../../api/authApi";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
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

    const validationErrors =
      validateForgotPassword(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);

      return;
    }

    setErrors({});

    try {
      const response = await forgotPassword(
        formData.email
      );

      toast.success(response.message);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );
    }}

    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Forgot Password</h1>

          <p>
            Enter your email to receive a password
            reset link.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <AuthInput
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<MdEmail />}
            />

            <button type="submit">
              Send Reset Link
            </button>
          </form>

        </div>
      </div>
    );
  }

  export default ForgotPassword;
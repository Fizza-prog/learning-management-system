import { useState } from "react";
import AuthInput from "../components/AuthInput";
import { validateForgotPassword } from "../services/validation";
import {MdEmail} from "react-icons/md";


function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForgotPassword(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    // Backend integration will come later
    setMessage(
      "If an account with this email exists, a password reset link has been sent."
    );

    console.log("Forgot Password:", formData);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a password reset link.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            icon={<MdEmail/>}
            onChange={handleChange}
            error={errors.email}
          />

          <button type="submit">
            Send Reset Link
          </button>
        </form>

        {message && <p className="success-text">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
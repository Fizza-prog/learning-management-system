import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { validateSignup } from "../services/validation";
import { registerUser } from "../../../api/authApi";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

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
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateSignup(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);

      return;
    }

    setErrors({});

    try {
      const payload = {
        schoolId: null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "admin",
      };
      console.log(payload);
      const response = await registerUser(payload);

      toast.success(response.message);

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Registration failed."
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create School Account</h1>
        <p>Register your school to get started</p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <AuthInput
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            icon={<MdAdminPanelSettings />}
          />

          <AuthInput
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            icon={<MdAdminPanelSettings />}
          />

          <AuthInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<MdEmail />}
          />

          <AuthInput
            type="password"
            name="password"
            placeholder="Password"
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
            icon={<RiLockPasswordFill />}
          />

          <button type="submit">
            Register
          </button>



          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
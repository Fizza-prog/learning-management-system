import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../../../api/authApi";
import { validateLogin } from "../services/validation";
import "./Login.css";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa"
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Remove error as user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      Object.values(validationErrors).forEach((message) => {
        toast.error(message);
      });

      return;
    }

    setErrors({});

    try {
      const response = await loginUser(formData);

      const { user, accessToken, refreshToken } = response.data;

      login(user, accessToken);

      localStorage.setItem("refreshToken", refreshToken);

      toast.success(response.message);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Login failed."
      );
    }}

    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p>Login to your LMS account</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <AuthInput
              type="email"
              name="email"
              placeholder="Email"
              icon={<MdEmail />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <AuthInput
              type="password"
              name="password"
              placeholder="Password"
              icon={<FaLock />}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>

            <button type="submit">Login</button>

          </form>
        </div>
      </div>
    );
  }

  export default Login;
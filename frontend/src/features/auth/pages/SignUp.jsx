import { useState } from "react";
import AuthInput from "../components/AuthInput";
import { validateSignup } from "../services/validation";
import { FaSchool } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import {MdEmail} from "react-icons/md";
import {FaLock} from "react-icons/fa"
import { RiLockPasswordFill } from "react-icons/ri";

function Signup() {
  const [formData, setFormData] = useState({
    schoolName: "",
    adminName: "",
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

    // Clear the error for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateSignup(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    // Backend integration will be added later
    console.log("Signup Data:", formData);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create School Account</h1>
        <p>Register your school to get started</p>

        <form className="auth-form" onSubmit={handleSubmit}>
    
          <AuthInput
            type="text"
            name="schoolName"
            placeholder="School Name"
            value={formData.schoolName}
            onChange={handleChange}
            error={errors.schoolName}
            icon={<FaSchool />}
          />
          
        
          <AuthInput
            type="text"
            name="adminName"
            placeholder="Admin Name"
            value={formData.adminName}
            onChange={handleChange}
            error={errors.adminName}
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
            Register School
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
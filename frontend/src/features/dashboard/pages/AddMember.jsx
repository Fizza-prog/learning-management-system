import { useState } from "react";
import "./AddMember.css";

function AddMember() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "teacher",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log(formData);
  }

  return (
    <div className="add-member-page">
      <div className="add-member-card">
        <h1>Add New Member</h1>

        <p>
          Create a new teacher, student, or admin account.
        </p>

        <form
          className="add-member-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>First Name</label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="teacher">
                Teacher
              </option>

              <option value="student">
                Student
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <button type="submit">
            Create Member
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMember;
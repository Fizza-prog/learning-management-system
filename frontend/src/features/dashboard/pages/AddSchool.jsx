/**
 * @file AddSchool.jsx
 * @description Provides the super-admin form for creating or editing a school.
 *
 * Responsibilities:
 * - Load school details for edit mode.
 * - Validate and submit school information.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSchool,
  getSchoolById,
  updateSchool,
} from "../../../api/schoolApi";

import "./AddSchool.css";
import "../components/header/DashboardHeader.css";
import "../components/adminList.css";

function AddSchool() {
  const navigate = useNavigate();
  const { id: editSchoolId } = useParams();

  const isEditMode = Boolean(editSchoolId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing school when editing
  useEffect(() => {
    const fetchSchool = async () => {
      if (!editSchoolId) return;

      try {
        setLoading(true);
        setError("");

        const response = await getSchoolById(editSchoolId);
        const school = response.data;

        setFormData({
          name: school.name || "",
          email: school.email || "",
          phone: school.phone || "",
          address: school.address || "",
        });
      } catch (error) {
        console.error("Failed to fetch school:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load school."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [editSchoolId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      // EDIT SCHOOL
      if (isEditMode) {
        await updateSchool(editSchoolId, formData);

        setMessage("School updated successfully.");

        setTimeout(() => {
          navigate("/dashboard/schools");
        }, 1000);

        return;
      }

      // CREATE SCHOOL
      const response = await createSchool(formData);

      setMessage(
        response.message || "School created successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      console.error(
        isEditMode
          ? "Failed to update school:"
          : "Failed to create school:",
        error
      );

      setError(
        error.response?.data?.message ||
          (isEditMode
            ? "Failed to update school."
            : "Failed to create school.")
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while existing school data is being fetched
  if (loading && isEditMode && !formData.name) {
    return <p>Loading school...</p>;
  }

  return (
    <div className="add-school-page">
      <div className="add-school-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>{isEditMode ? "Edit School" : "Add New School"}</h1>
          <p>
            {isEditMode
              ? "Update school information."
              : "Create a new school in the system."}
          </p>
        </div>
      </div>

      <div className="add-school-container">
        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form
          className="add-school-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>School Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter school name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter school email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter school phone"
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter school address"
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="dashboard-header-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update School"
                : "Create School"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/dashboard/schools")
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSchool;


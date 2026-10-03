/**
 * @file AddMember.jsx
 * @description Provides the administrator form for creating or editing users.
 *
 * Responsibilities:
 * - Load school choices and existing user data when needed.
 * - Validate and submit user account details.
 */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/context/AuthContext";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../../api/userApi";
import "./AddMember.css";
import { getSchools } from "../../../api/schoolApi";
import "../components/header/DashboardHeader.css";
import "../components/adminList.css";

function AddMember() {
  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const editUserId = searchParams.get("edit");
  const isEditMode = Boolean(editUserId);

  const [schools, setSchools] = useState([]);
  const [originalRole, setOriginalRole] = useState("");
  const [originalSchoolId, setOriginalSchoolId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSuperAdmin = user?.role === "super_admin";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: user?.role === "super_admin" ? "admin" : "teacher",
    schoolId: user?.role === "admin" ? user.schoolId : "",
  });

  // Get schools for Super Admin
  useEffect(() => {
    const fetchSchools = async () => {
      if (user?.role !== "super_admin") return;

      try {
        const response = await getSchools();
        setSchools(response.data?.schools || []);
      } catch (error) {
        console.error("Failed to fetch schools:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load schools."
        );
      }
    };

    fetchSchools();
  }, [user]);

  // Fetch existing user when editing
  useEffect(() => {
    const fetchUser = async () => {
      if (!editUserId) return;

      try {
        setLoading(true);
        setError("");

        const response = await getUserById(editUserId);

        const existingUser = response.data;
        setOriginalRole(existingUser.role || "");
        setOriginalSchoolId(existingUser.schoolId || "");

        setFormData({
          firstName: existingUser.firstName || "",
          lastName: existingUser.lastName || "",
          email: existingUser.email || "",
          password: "",
          role: existingUser.role || "",
          schoolId: existingUser.schoolId || "",
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load user."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [editUserId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!isEditMode && formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        };

        if (isSuperAdmin) {
          if (formData.role !== originalRole) {
            updateData.role = formData.role;
          }

          if (formData.schoolId !== originalSchoolId) {
            updateData.schoolId = formData.schoolId;
          }
        }

        await updateUser(editUserId, updateData);
        toast.success("User updated successfully.");
        navigate("/dashboard/members");

        return;
      }

      const response = await createUser(formData);
      toast.success(
        response.message || "User created successfully."
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role:
          user?.role === "super_admin"
            ? "admin"
            : "teacher",
        schoolId:
          user?.role === "admin"
            ? user.schoolId
            : "",
      });
    } catch (error) {
      console.error(
        isEditMode
          ? "Failed to update user:"
          : "Failed to create user:",
        error
      );

      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      setError(
        error.response?.data?.message ||
          (isEditMode
            ? "Failed to update user."
            : "Failed to create user.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.firstName) {
    return <p>Loading member...</p>;
  }

  return (
    <div className="add-member-page">
      <div className="add-member-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>{isEditMode ? "Edit Member" : "Add New Member"}</h1>
          <p>
            {isEditMode
              ? "Update member information."
              : isSuperAdmin
              ? "Create a new admin account."
              : "Create a new teacher or student account."}
          </p>
        </div>
      </div>

      <div className="add-member-container">
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

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
              required
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
              placeholder="Enter email"
              required
            />
          </div>

          {!isEditMode && (
            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isEditMode && !isSuperAdmin}
            >
              {(isEditMode && !isSuperAdmin
                ? [formData.role]
                : isSuperAdmin
                ? isEditMode
                  ? ["admin", "teacher", "student", ...(formData.role === "super_admin" ? ["super_admin"] : [])]
                  : ["admin"]
                : ["teacher", "student"]
              ).map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {isSuperAdmin && (
            <div className="form-group">
              <label>School</label>

              <select
                name="schoolId"
                value={formData.schoolId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a school
                </option>

                {schools
                  .filter((school) => school.isActive)
                  .map((school) => (
                    <option
                      key={school.id}
                      value={school.id}
                    >
                      {school.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="dashboard-header-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Member"
                : "Create Member"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/dashboard/members")
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

export default AddMember;
/**
 * @file VerifyEmail.jsx
 * @description Confirms an account's email address using its verification token.
 *
 * Responsibilities:
 * - Request token verification when the page loads.
 * - Display success or failure and provide a login action.
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../../../api/axios";
import "./VerifyEmail.css";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axiosInstance.get(
          `/auth/verify-email/${token}`
        );

        setMessage(response.data.message);
      } catch (error) {
        console.error("EMAIL VERIFICATION ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Email verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]); //dependency array 

  if (loading) {
  return (
    <div className="verify-email-page">
      <div className="verify-email-card">
        <p className="verify-email-loading">
          Verifying your email...
        </p>
      </div>
    </div>
  );
}

return (
  <div className="verify-email-page">
    <div className="verify-email-card">
      {message ? (
        <>
          <h1>Email Verified</h1>

          <p className="verify-email-success">
            {message}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </>
      ) : (
        <>
          <h1>Verification Failed</h1>

          <p className="verify-email-error">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </>
      )}
    </div>
  </div>
);
}

export default VerifyEmail;
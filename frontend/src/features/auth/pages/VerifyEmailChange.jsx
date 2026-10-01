/**
 * @file VerifyEmailChange.jsx
 * @description Confirms a pending email-address change using its token.
 *
 * Responsibilities:
 * - Submit the email-change verification token.
 * - Display the verification result to the user.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmailChange } from "../../../api/authApi";

function VerifyEmailChange() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyChange = async () => {
      try {
        const result = await verifyEmailChange(token);

        setStatus("success");
        setMessage(result.message);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed."
        );
      }
    };

    verifyChange();
  }, [token, navigate]);

  return (
    <div className="verify-email-change-page">
      {status === "verifying" && (
        <>
          <h2>Verifying Email</h2>
          <p>Please wait...</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2>Email Changed Successfully</h2>
          <p>{message}</p>
          <p>Redirecting to login...</p>
        </>
      )}

      {status === "error" && (
        <>
          <h2>Email Change Failed</h2>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}

export default VerifyEmailChange;
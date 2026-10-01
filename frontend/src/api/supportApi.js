/**
 * @file supportApi.js
 * @description Sends support requests from the frontend to the backend.
 *
 * Responsibilities:
 * - Submit a support subject and message.
 */
import api from "./axios";

export const contactSupport = async (subject, message) => {
  const response = await api.post("/support/contact", {
    subject,
    message,
  });

  return response.data;
};
/**
 * @file HelpSupport.jsx
 * @description Provides the authenticated support-contact form.
 *
 * Responsibilities:
 * - Collect a support subject and message.
 * - Submit the request and display its outcome.
 */
import { useState } from "react";
import { contactSupport } from "../../../api/supportApi";
import { toast } from "react-toastify";
import "../components/header/DashboardHeader.css";
import "../components/adminList.css";

import "./HelpSupport.css";

const HelpSupport = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "How do I change my password?",
      answer:
        "Go to Account Settings and use the Change Password option.",
    },
    {
      question: "How do I change my email?",
      answer:
        "Go to Account Settings, enter your new email and current password, then verify the new email from the verification link.",
    },
    {
      question: "I did not receive my verification email. What should I do?",
      answer:
        "Check your spam or junk folder. You can also request another verification email.",
    },
    {
      question: "I forgot my password. How can I reset it?",
      answer:
        "Use the Forgot Password option on the login page and follow the instructions sent to your email.",
    },
    {
      question: "What should I do if I am having another problem?",
      answer:
        "Use the contact form below to send a message to the support team.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      return;
    }

    try {
      setLoading(true);

      await contactSupport(
        subject.trim(),
        message.trim()
      );

      setSubject("");
      setMessage("");

toast.success("Your message has been sent successfully.");    } catch (error) {
      console.error("Support request failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-support-page">
      <div className="help-support-header admin-list-header">
        <div className="admin-list-header-content">
          <h1>Help & Support</h1>
          <p>
            Find answers to common questions or contact our
            support team.
          </p>
        </div>
      </div>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details
              className="faq-item"
              key={index}
            >
              <summary>{faq.question}</summary>

              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-support-section">
        <div className="contact-support-header">
          <h2>Contact Support</h2>
          <p>
            Still need help? Send us a message and our
            support team will get back to you.
          </p>
        </div>

        <form
          className="support-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="support-subject">
              Subject
            </label>

            <input
              id="support-subject"
              type="text"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              placeholder="Enter your subject"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="support-message">
              Message
            </label>

            <textarea
              id="support-message"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Describe your issue..."
              rows="6"
              required
            />
          </div>

          <button
            type="submit"
            className="dashboard-header-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default HelpSupport;
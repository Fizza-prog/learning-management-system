/**
 * @file Exam.jsx
 * @description Displays assessment and report status summaries.
 *
 * Responsibilities:
 * - Calculate counts for scheduled, active, and ready items.
 * - Render the exams and reports table.
 */
import { MdAssessment } from "react-icons/md";

import "../../dashboard/components/SchoolAdminModule.css";
import "./Exam.css";

const exams = [
  {
    name: "Mid-Term Mathematics",
    className: "Grade 10-A",
    date: "Oct 14, 2026",
    status: "Scheduled",
    tone: "warning",
  },
  {
    name: "English Language Assessment",
    className: "Grade 9-B",
    date: "Oct 16, 2026",
    status: "Scheduled",
    tone: "warning",
  },
  {
    name: "Science Practical",
    className: "Grade 10-B",
    date: "Oct 19, 2026",
    status: "In progress",
    tone: "muted",
  },
  {

  name: "Term 1 Report Cards",
  className: "All classes",
  date: "Oct 08, 2026",
  status: "Ready",
  tone: "ready",

  },
];

function Exam() {
  const upcomingExams = exams.filter(
    (exam) => exam.status === "Scheduled"
  ).length;

  const inProgress = exams.filter(
    (exam) => exam.status === "In progress"
  ).length;

  const reportsReady = exams.filter(
    (exam) => exam.status === "Ready"
  ).length;

  return (
    <section className="exam-page">
      <header className="exam-header">
        <div className="exam-header-content">
          <h1>Exams &amp; Reports</h1>
          <p>
            Upcoming assessments and report publishing status.
          </p>
        </div>
      </header>

      <div className="exam-summary-row">
        <div className="exam-stat-card">
          <div className="exam-stat-icon">
            <MdAssessment />
          </div>

          <div className="exam-stat-info">
            <span className="exam-stat-label">
              Upcoming exams
            </span>

            <strong className="exam-stat-number">
              {upcomingExams}
            </strong>
          </div>
        </div>

        <div className="exam-stat-card">
          <div className="exam-stat-icon">
            <MdAssessment />
          </div>

          <div className="exam-stat-info">
            <span className="exam-stat-label">
              In progress
            </span>

            <strong className="exam-stat-number">
              {inProgress}
            </strong>
          </div>
        </div>

        <div className="exam-stat-card">
          <div className="exam-stat-icon">
            <MdAssessment />
          </div>

          <div className="exam-stat-info">
            <span className="exam-stat-label">
              Reports ready
            </span>

            <strong className="exam-stat-number">
              {reportsReady}
            </strong>
          </div>
        </div>
      </div>

      <div className="exam-table-container">
        <table className="exam-table">
          <thead>
            <tr>
              <th>Exam / Report</th>
              <th>Class</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr key={exam.name}>
                <td>
                  <div className="exam-name">
                    <div className="exam-avatar">
                      <MdAssessment />
                    </div>

                    <strong>{exam.name}</strong>
                  </div>
                </td>

                <td>
                  <span className="exam-class">
                    {exam.className}
                  </span>
                </td>

                <td>
                  <span className="exam-date">
                    {exam.date}
                  </span>
                </td>

                <td>
                  <span
                    className={`exam-status ${
                      exam.tone
                        ? `exam-status--${exam.tone}`
                        : ""
                    }`}
                  >
                    {exam.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exams.length === 0 && (
        <div className="exam-empty-state">
          <div className="exam-empty-content">
            <div className="exam-empty-icon">
              <MdAssessment />
            </div>

            <h3>No exams or reports</h3>

            <p>
              No upcoming assessments or reports are available.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Exam;
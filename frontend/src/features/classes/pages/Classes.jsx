/**
 * @file Classes.jsx
 * @description Displays class and section summaries for school administrators.
 *
 * Responsibilities:
 * - Show class, section, and student totals.
 * - Render the class teacher and section assignments table.
 */
import { MdClass, MdGroups } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

import "../../dashboard/components/SchoolAdminModule.css";
import "./Classes.css";

const classRows = [
  {
    grade: "Grade 10",
    sections: "A, B, C",
    teacher: "Olivia Bennett",
    students: 84,
  },
  {
    grade: "Grade 9",
    sections: "A, B",
    teacher: "Noah Williams",
    students: 61,
  },
  {
    grade: "Grade 8",
    sections: "A, B, C",
    teacher: "Ava Thompson",
    students: 79,
  },
  {
    grade: "Grade 7",
    sections: "A, B",
    teacher: "Liam Carter",
    students: 56,
  },
];

function Classes() {
  const totalStudents = classRows.reduce(
    (sum, row) => sum + row.students,
    0
  );

  const totalSections = classRows.reduce(
    (total, row) => total + row.sections.split(",").length,
    0
  );

  return (
    <section className="classes-page">
      <header className="classes-header">
        <div>
          <h1>Classes &amp; Sections</h1>
          <p>
            Manage class structure and section assignments for your school.
          </p>
        </div>
      </header>

      <div className="classes-summary-row">
        <div className="classes-stat-card">
          <div className="classes-stat-icon">
            <MdClass />
          </div>

          <div className="classes-stat-info">
            <span className="classes-stat-label">Classes</span>
            <span className="classes-stat-number">
              {classRows.length}
            </span>
          </div>
        </div>

        <div className="classes-stat-card">
          <div className="classes-stat-icon">
            <MdClass />
          </div>

          <div className="classes-stat-info">
            <span className="classes-stat-label">Sections</span>
            <span className="classes-stat-number">
              {totalSections}
            </span>
          </div>
        </div>

        <div className="classes-stat-card">
          <div className="classes-stat-icon">
            <MdGroups />
          </div>

          <div className="classes-stat-info">
            <span className="classes-stat-label">
              Enrolled students
            </span>
            <span className="classes-stat-number">
              {totalStudents}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="classes-add-button"
        >
          <FiPlus />
          Add Class
        </button>
      </div>

      <div className="classes-table-container">
        <table className="classes-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Sections</th>
              <th>Class Teacher</th>
              <th>Students</th>
            </tr>
          </thead>

          <tbody>
            {classRows.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="classes-empty-state"
                >
                  <div className="classes-empty-content">
                    <div className="classes-empty-icon">
                      <MdClass />
                    </div>

                    <h3>No classes available</h3>

                    <p>
                      Add your first class to get started.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              classRows.map((row) => (
                <tr key={row.grade}>
                  <td>
                    <div className="class-name">
                      <div className="class-avatar">
                        <MdClass />
                      </div>

                      <div className="class-name-content">
                        <strong>{row.grade}</strong>
                        <small>Class</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="sections-badge">
                      {row.sections}
                    </span>
                  </td>

                  <td>
                    <span className="class-teacher">
                      {row.teacher}
                    </span>
                  </td>

                  <td>
                    <div className="student-count">
                      <MdGroups />
                      <span>{row.students}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Classes;
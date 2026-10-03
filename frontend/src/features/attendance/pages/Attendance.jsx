/**
 * @file Attendance.jsx
 * @description Displays the school-admin attendance summary by class.
 *
 * Responsibilities:
 * - Present enrollment, attendance totals, and rates.
 * - Render the class attendance summary table.
 */
import { MdFactCheck } from "react-icons/md";

import "../../dashboard/components/SchoolAdminModule.css";
import "./Attendance.css";

const classAttendance = [
  {
    className: "Grade 10-A",
    enrolled: 30,
    present: 28,
    absent: 1,
    late: 1,
  },
  {
    className: "Grade 10-B",
    enrolled: 29,
    present: 27,
    absent: 2,
    late: 0,
  },
  {
    className: "Grade 9-A",
    enrolled: 31,
    present: 29,
    absent: 1,
    late: 1,
  },
  {
    className: "Grade 9-B",
    enrolled: 30,
    present: 27,
    absent: 2,
    late: 1,
  },
];

function Attendance() {
  const totals = classAttendance.reduce(
    (result, row) => ({
      enrolled: result.enrolled + row.enrolled,
      present: result.present + row.present,
      absent: result.absent + row.absent,
      late: result.late + row.late,
    }),
    {
      enrolled: 0,
      present: 0,
      absent: 0,
      late: 0,
    }
  );

  const attendanceRate =
    totals.enrolled > 0
      ? Math.round((totals.present / totals.enrolled) * 100)
      : 0;

  return (
    <section className="attendance-page">
      <header className="attendance-header">
        <div className="attendance-header-content">
          <h1>Attendance</h1>
          <p>Daily attendance summary across school classes.</p>
        </div>
      </header>

      <div className="attendance-summary-row">
        <div className="attendance-stat-card">
          <div className="attendance-stat-icon">
            <MdFactCheck />
          </div>

          <div className="attendance-stat-info">
            <span className="attendance-stat-label">
              Attendance rate
            </span>

            <strong className="attendance-stat-number">
              {attendanceRate}%
            </strong>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon">
            <MdFactCheck />
          </div>

          <div className="attendance-stat-info">
            <span className="attendance-stat-label">
              Present
            </span>

            <strong className="attendance-stat-number">
              {totals.present}
            </strong>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="attendance-stat-icon">
            <MdFactCheck />
          </div>

          <div className="attendance-stat-info">
            <span className="attendance-stat-label">
              Absent / late
            </span>

            <strong className="attendance-stat-number">
              {totals.absent} / {totals.late}
            </strong>
          </div>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Enrolled</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {classAttendance.map((row) => {
              const percentage =
                row.enrolled > 0
                  ? Math.round((row.present / row.enrolled) * 100)
                  : 0;

              return (
                <tr key={row.className}>
                  <td>
                    <div className="attendance-class">
                      <div className="attendance-class-avatar">
                        <MdFactCheck />
                      </div>

                      <strong>{row.className}</strong>
                    </div>
                  </td>

                  <td>{row.enrolled}</td>

                  <td>
                    <span className="attendance-present">
                      {row.present}
                    </span>
                  </td>

                  <td>
                    <span className="attendance-absent">
                      {row.absent}
                    </span>
                  </td>

                  <td>
                    <span className="attendance-late">
                      {row.late}
                    </span>
                  </td>

                  <td>
                    <span className="attendance-percentage">
                      {percentage}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {classAttendance.length === 0 && (
        <div className="attendance-empty-state">
          <div className="attendance-empty-content">
            <div className="attendance-empty-icon">
              <MdFactCheck />
            </div>

            <h3>No attendance records</h3>

            <p>
              No attendance has been recorded for today yet.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Attendance;
/**
 * @file Timetable.jsx
 * @description Displays the weekly school timetable summary.
 *
 * Responsibilities:
 * - Show timetable overview metrics.
 * - Render class activities by day and time.
 */
import { MdCalendarMonth } from "react-icons/md";

import "../../dashboard/components/SchoolAdminModule.css";
import "./Timetable.css";

const timetableRows = [
  {
    time: "08:00 – 08:45",
    monday: "Mathematics",
    tuesday: "English",
    wednesday: "Biology",
    thursday: "Mathematics",
    friday: "History",
  },
  {
    time: "08:50 – 09:35",
    monday: "English",
    tuesday: "Chemistry",
    wednesday: "Mathematics",
    thursday: "Geography",
    friday: "English",
  },
  {
    time: "09:55 – 10:40",
    monday: "Physics",
    tuesday: "Mathematics",
    wednesday: "English",
    thursday: "Biology",
    friday: "Computer Science",
  },
  {
    time: "10:45 – 11:30",
    monday: "History",
    tuesday: "Geography",
    wednesday: "Physical Education",
    thursday: "Chemistry",
    friday: "Mathematics",
  },
];

function Timetable() {
  return (
    <section className="timetable-page">
      <header className="timetable-header">
        <div className="timetable-header-content">
          <h1>Timetable</h1>
          <p>Weekly schedule and class period assignments.</p>
        </div>
      </header>

      <div className="timetable-summary-row">
        <div className="timetable-stat-card">
          <div className="timetable-stat-icon">
            <MdCalendarMonth />
          </div>

          <div className="timetable-stat-info">
            <span className="timetable-stat-label">School week</span>
            <strong className="timetable-stat-number">Mon – Fri</strong>
          </div>
        </div>

        <div className="timetable-stat-card">
          <div className="timetable-stat-icon">
            <MdCalendarMonth />
          </div>

          <div className="timetable-stat-info">
            <span className="timetable-stat-label">Class</span>
            <strong className="timetable-stat-number">Grade 10-A</strong>
          </div>
        </div>

        <div className="timetable-stat-card">
          <div className="timetable-stat-icon">
            <MdCalendarMonth />
          </div>

          <div className="timetable-stat-info">
            <span className="timetable-stat-label">Periods shown</span>
            <strong className="timetable-stat-number">
              {timetableRows.length} of 7
            </strong>
          </div>
        </div>
      </div>

      <div className="timetable-table-container">
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>

          <tbody>
            {timetableRows.map((row) => (
              <tr key={row.time}>
                <td>
                  <strong className="timetable-time">{row.time}</strong>
                </td>

                <td>
                  <span className="timetable-subject">{row.monday}</span>
                </td>

                <td>
                  <span className="timetable-subject">{row.tuesday}</span>
                </td>

                <td>
                  <span className="timetable-subject">{row.wednesday}</span>
                </td>

                <td>
                  <span className="timetable-subject">{row.thursday}</span>
                </td>

                <td>
                  <span className="timetable-subject">{row.friday}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {timetableRows.length === 0 && (
        <div className="timetable-empty-state">
          <div className="timetable-empty-content">
            <div className="timetable-empty-icon">
              <MdCalendarMonth />
            </div>

            <h3>No timetable available</h3>
            <p>
              No schedule has been created for this class yet.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Timetable;
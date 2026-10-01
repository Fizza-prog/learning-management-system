/**
 * @file RecentSchools.jsx
 * @description Renders recent school records in the super-admin dashboard.
 *
 * Responsibilities:
 * - Display the recent-schools table headings.
 * - Delegate each school row to the SchoolRow component.
 */
import SchoolRow from "./SchoolRow";
import "./RecentSchools.css";
import "../adminTable.css";

function RecentSchools({ schools }) {
  return (
    <section className="recent-schools">
      <h2 className="recent-schools-title">
        Recent Schools
      </h2>

      <table className="schools-table">
        <thead>
          <tr>
            <th>School</th>
            <th>Admin</th>
            <th>Students</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {schools.map((school) => (
            <SchoolRow
              key={school.id}
              school={school}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default RecentSchools;
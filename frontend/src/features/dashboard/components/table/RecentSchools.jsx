import SchoolRow from "./SchoolRow";
import "./RecentSchools.css";
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
            <th>Plan</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
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
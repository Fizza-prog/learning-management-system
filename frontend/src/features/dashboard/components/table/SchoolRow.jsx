/**
 * @file SchoolRow.jsx
 * @description Renders one school record in the recent-schools table.
 *
 * Responsibilities:
 * - Format the school creation date and status.
 * - Display school, administrator, and student-count values.
 */
import "./SchoolRow.css";

function SchoolRow({ school }) {
  const formatCreatedAt = (createdAt) => {
    if (!createdAt) {
      return "-";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "status-active";

      case "Suspended":
        return "status-suspended";

      default:
        return "";
    }
  };

  return (
    <tr>
      <td>{school.name}</td>

      <td>{school.admin}</td>

      <td>{school.students}</td>

      <td>
        <span
          className={`status-badge ${getStatusClass(
            school.status
          )}`}
        >
          <span className="status-dot"></span>
          {school.status}
        </span>
      </td>

      <td>{formatCreatedAt(school.createdAt)}</td>
    </tr>
  );
}

export default SchoolRow;
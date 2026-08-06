import {
  MdVisibility,
  MdEdit,
  MdMoreVert,
} from "react-icons/md";
import "./SchoolRow.css";
function SchoolRow({ school }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "status-active";

      case "Pending":
        return "status-pending";

      case "Suspended":
        return "status-suspended";

      default:
        return "";
    }
  };

  return (
    <tr>
      <td>{school.school}</td>

      <td>{school.admin}</td>

      <td>{school.students}</td>

      <td>{school.plan}</td>

      <td>
        <span className={`status-badge ${getStatusClass(school.status)}`}>
          {school.status}
        </span>
      </td>

      <td>{school.createdAt}</td>

      <td>
        <div className="table-actions">
          <button>
            <MdVisibility />
          </button>

          <button>
            <MdEdit />
          </button>

          <button>
            <MdMoreVert />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default SchoolRow;
import "./StatsCard.css";
import {
  MdAssignment,
  MdGrade,
  MdPayments,
  MdPeople,
  MdSchool,
} from "react-icons/md";
const iconMap = {
  attendance: MdAssignment,
  grade: MdGrade,
  fees: MdPayments,
  students: MdPeople,
  schools: MdSchool,
};
function StatsCard({ title, value, icon }) {
  const IconComponent = iconMap[icon];
  return (
    <div className="stats-card">
      <div className="stats-card-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
      {IconComponent && <IconComponent className="stats-card-icon" />}
    </div>
  );
}

export default StatsCard;
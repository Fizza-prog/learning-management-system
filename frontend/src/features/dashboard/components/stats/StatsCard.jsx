import {
  MdSchool,
  MdGroups,
  MdAttachMoney,
  MdPendingActions,
  MdPerson,
  MdFactCheck,
  MdPayments,
} from "react-icons/md";
import "./StatsCard.css";

const iconMap = {
  school: MdSchool,
  students: MdGroups,
  revenue: MdAttachMoney,
  approval: MdPendingActions,

  teachers: MdPerson,
  attendance: MdFactCheck,
  fees: MdPayments,
};

function StatsCard({ title, value, growth, icon }) {
 const Icon = iconMap[icon] || MdSchool;
  const isPositive = growth.startsWith("+");

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <Icon className="stats-card-icon" />

        <span
          className={`stats-card-growth ${isPositive ? "positive" : "negative"
            }`}
        >
          {growth}
        </span>
      </div>

      <h3 className="stats-card-title">
        {title}
      </h3>

      <h2 className="stats-card-value">
        {value}
      </h2>
    </div>
  );
}

export default StatsCard;
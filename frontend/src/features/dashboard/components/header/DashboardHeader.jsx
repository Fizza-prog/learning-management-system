import { MdAdd } from "react-icons/md";
import './DashboardHeader.css'

function DashboardHeader({
  title,
  subtitle,
  buttonText,
}) {
  return (
    <section className="dashboard-header">
      {/* Left Section */}
      <div className="dashboard-header-content">
        <h1 className="dashboard-header-title">
          {title}
        </h1>

        <p className="dashboard-header-subtitle">
         {subtitle}
        </p>
      </div>

      {/* Right Section */}
      <button className="dashboard-header-button">
        <MdAdd />
        <span>{buttonText}</span>
      </button>
    </section>
  );
}

export default DashboardHeader;
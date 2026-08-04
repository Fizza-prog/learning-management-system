import { MdAdd } from "react-icons/md";
import './DashboardHeader.css'

function DashboardHeader() {
  return (
    <section className="dashboard-header">
      {/* Left Section */}
      <div className="dashboard-header-content">
        <h1 className="dashboard-header-title">
          Dashboard Overview
        </h1>

        <p className="dashboard-header-subtitle">
          Welcome back, Super Admin
        </p>
      </div>

      {/* Right Section */}
      <button className="dashboard-header-button">
        <MdAdd />
        <span>Add New School</span>
      </button>
    </section>
  );
}

export default DashboardHeader;
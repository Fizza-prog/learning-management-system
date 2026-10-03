/**
 * @file DashboardHeader.jsx
 * @description Renders the title and subtitle shared by dashboard pages.
 *
 * Responsibilities:
 * - Display the supplied dashboard heading and supporting text.
 */
import './DashboardHeader.css'

function DashboardHeader({
  title,
  subtitle,
  buttonText,
}) {
  return (
    <section className="dashboard-header">
      <div className="dashboard-header-content">
        <h1 className="dashboard-header-title">
          {title}
        </h1>

        <p className="dashboard-header-subtitle">
         {subtitle}
        </p>
      </div>

    </section>
  );
}

export default DashboardHeader;
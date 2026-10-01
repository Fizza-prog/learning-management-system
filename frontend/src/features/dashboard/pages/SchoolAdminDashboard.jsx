/**
 * @file SchoolAdminDashboard.jsx
 * @description Loads and presents the school administrator overview.
 *
 * Responsibilities:
 * - Fetch school statistics and recent audit activity.
 * - Render summary metrics and upcoming items.
 */
import { useEffect, useState } from "react";

import { FiActivity, FiCalendar } from "react-icons/fi";

import { toast } from "react-toastify";

import { getSchoolAdminDashboard } from "../../../api/dashboardApi";
import { getAuditLogs } from "../../../api/auditLogApi";

import DashboardHeader from "../components/header/DashboardHeader";
import StatsGrid from "../components/stats/StatsGrid";

import {
  schoolAdminHeader,
  schoolAdminStats,
} from "../config/schoolAdminConfig";

import "./SchoolAdminDashboard.css";
import "../components/adminTable.css";

function SchoolAdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [statsFailed, setStatsFailed] = useState(false);

  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    getSchoolAdminDashboard()
      .then((response) => setDashboardStats(response.data.stats))
      .catch((error) => {
        setStatsFailed(true);

        toast.error(
          error.response?.data?.message ||
            "Could not load dashboard statistics."
        );
      });
  }, []);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setActivityLoading(true);

        const response = await getAuditLogs(1, 5);

        setRecentActivity(response.data.logs || []);
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
        setRecentActivity([]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const formatAction = (action) => {
    if (!action) return "Activity";

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatTime = (date) => {
    if (!date) return "—";

    const createdAt = new Date(date);
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now - createdAt) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${
        diffInMinutes === 1 ? "" : "s"
      } ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours} hour${
        diffInHours === 1 ? "" : "s"
      } ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    return `${diffInDays} day${
      diffInDays === 1 ? "" : "s"
    } ago`;
  };

  const stats = schoolAdminStats.map((item) => {
    if (item.title === "Attendance Today") return item;

    if (statsFailed) {
      return {
        ...item,
        value: "Unavailable",
        growth: "",
      };
    }

    if (!dashboardStats) {
      return {
        ...item,
        value: "Loading...",
        growth: "",
      };
    }

    if (item.title === "Total Students") {
      return {
        ...item,
        value: dashboardStats.totalStudents.toLocaleString(),
        growth: "",
      };
    }

    if (item.title === "Total Teachers") {
      return {
        ...item,
        value: dashboardStats.totalTeachers.toLocaleString(),
        growth: "",
      };
    }

    if (item.title === "Fee Collection (MTD)") {
      return {
        ...item,
        value: `$${Number(
          dashboardStats.monthToDate
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        growth: "",
      };
    }

    return item;
  });

  const upcomingItems = [
    {
      id: 1,
      title: "Mid-Term Exams",
      date: "Oct 14",
    },
    {
      id: 2,
      title: "Fee Due Date",
      date: "Oct 20",
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      date: "Oct 25",
    },
    {
      id: 4,
      title: "Annual Sports Day",
      date: "Oct 30",
    },
  ];

  return (
    <>
      <DashboardHeader
        title={schoolAdminHeader.title}
        subtitle={schoolAdminHeader.subtitle}
        buttonText={schoolAdminHeader.buttonText}
      />

      <StatsGrid stats={stats} />

      <section className="dashboard-overview-grid">
        <div className="dashboard-overview-card">
          <div className="dashboard-overview-card-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest administrative activity.</p>
            </div>

            <div className="dashboard-overview-icon">
              <FiActivity />
            </div>
          </div>

          <div className="recent-activity-list">
            {activityLoading ? (
              <div className="dashboard-empty-state">
                <p>Loading activity...</p>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="dashboard-empty-state">
                <p>No recent activity found.</p>
              </div>
            ) : (
              recentActivity.map((log) => (
                <div
                  className="recent-activity-item"
                  key={log.id}
                >
                  <div className="recent-activity-dot"></div>

                  <div className="recent-activity-content">
                    <span className="recent-activity-action">
                      {formatAction(log.action)}
                    </span>

                    <span className="recent-activity-entity">
                      {log.entity || "System activity"}
                    </span>
                  </div>

                  <span className="recent-activity-time">
                    {formatTime(log.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-overview-card upcoming-card">
          <div className="dashboard-overview-card-header">
            <div>
              <h2>Upcoming</h2>
              <p>Important upcoming dates.</p>
            </div>

            <div className="dashboard-overview-icon">
              <FiCalendar />
            </div>
          </div>

          <div className="upcoming-list">
            {upcomingItems.map((item) => (
              <div
                className="upcoming-item"
                key={item.id}
              >
                <div className="upcoming-date">
                  {item.date}
                </div>

                <span className="upcoming-title">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default SchoolAdminDashboard;
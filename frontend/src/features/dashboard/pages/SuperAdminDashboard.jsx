/**
 * @file SuperAdminDashboard.jsx
 * @description Loads and composes the super-admin system overview.
 *
 * Responsibilities:
 * - Fetch super-admin dashboard statistics.
 * - Render summary cards, recent schools, and tenant-growth data.
 */
import { useEffect, useState } from "react";

import DashboardHeader from "../components/header/DashboardHeader";
import StatsGrid from "../components/stats/StatsGrid";
import DashboardBody from "../components/body/DashboardBody";

import { superAdminHeader } from "../config/superAdminConfig";
import { getDashboard } from "../../../api/dashboardApi";

function SuperAdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getDashboard();

        setDashboard(result.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const stats = [
    {
      id: 1,
      title: "Total Schools",
      value: dashboard.stats.totalSchools,
      growth: "",
      icon: "school",
    },
    {
      id: 2,
      title: "Active Students",
      value: dashboard.stats.activeStudents,
      growth: "",
      icon: "students",
    },
    {
      id: 3,
      title: "Fee Collection (MTD)",
      value: `$${Number(dashboard.stats.feeCollectionMonthToDate || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      growth: "",
      icon: "fees",
    },
  ];

  return (
    <>
      <DashboardHeader
        title={superAdminHeader.title}
        subtitle={superAdminHeader.subtitle}
        buttonText={superAdminHeader.buttonText}
      />

      <StatsGrid stats={stats} />

      <DashboardBody
        recentSchools={dashboard.recentSchools}
        tenantGrowth={dashboard.tenantGrowth}
      />
    </>
  );
}

export default SuperAdminDashboard;
/**
 * @file superAdminConfig.js
 * @description Defines navigation and heading configuration for super-admin pages.
 *
 * Responsibilities:
 * - Provide super-admin sidebar entries.
 * - Supply the dashboard title and subtitle.
 */

// ============================================
// SUPER ADMIN SIDEBAR MENU
// ============================================

export const superAdminMenu = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
  },
  {
    id: 2,
    title: "Schools",
    path: "/dashboard/schools",
    icon: "school",
  },
  {
    id: 3,
    title: "System Users",
    path: "/dashboard/members",
    icon: "users",
  },
  {
    id: 6,
    title: "Fees",
    path: "/dashboard/fees",
    icon: "billing",
  },
  {
    id: 7,
    title: "Announcements",
    path: "/dashboard/announcements",
    icon: "announcement",
  },
  {
    id: 4,
    title: "Settings",
    path: "/dashboard/account-settings",
    icon: "settings",
  },
  {
    id: 5,
    title: "Logs",
    path: "/dashboard/audit-logs",
    icon: "logs",
  },
];


// ============================================
// SUPER ADMIN DASHBOARD HEADER
// ============================================

export const superAdminHeader = {
  title: "Overview",
  subtitle:
    "Manage schools, subscriptions, and platform operations.",
  buttonText: "Add School",
};


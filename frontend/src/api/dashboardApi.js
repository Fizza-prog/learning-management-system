/**
 * @file dashboardApi.js
 * @description Provides requests for administrator dashboard summaries.
 *
 * Responsibilities:
 * - Fetch super-admin and school-admin dashboard statistics.
 * - Fetch school-admin fee collection totals.
 */
import axiosInstance from "./axios";

export const getDashboard = async () => {
  const { data } = await axiosInstance.get("/dashboard");
  return data;
};

export const getSchoolAdminFeeCollection = async () => {
  const { data } = await axiosInstance.get("/dashboard/fee-collection");
  return data;
};

export const getSchoolAdminDashboard = async () => {
  const { data } = await axiosInstance.get("/dashboard/school-admin");
  return data;
};
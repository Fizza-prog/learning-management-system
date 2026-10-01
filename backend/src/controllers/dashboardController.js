/**
 * @file dashboardController.js
 * @description Handles dashboard statistics and fee-collection requests.
 *
 * Responsibilities:
 * - Dispatch dashboard requests to their data services.
 * - Enforce the super-admin dashboard role requirement.
 */
import AppError from "../utils/AppError.js";
import {
  getSchoolAdminDashboardService,
  getSchoolAdminFeeCollectionService,
  getSuperAdminDashboardService,
} from "../services/dashboardService.js";

const getSchoolAdminDashboard = async (req, res, next) => {
  try {
    const data = await getSchoolAdminDashboardService(req.user.schoolId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getSchoolAdminFeeCollection = async (req, res, next) => {
  try {
    const data = await getSchoolAdminFeeCollectionService(req.user.schoolId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    if (req.user.role !== "super_admin") {
      throw new AppError(
        "Only super admin can access this dashboard",
        403
      );
    }

    const data = await getSuperAdminDashboardService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getDashboard,
  getSchoolAdminDashboard,
  getSchoolAdminFeeCollection,
};
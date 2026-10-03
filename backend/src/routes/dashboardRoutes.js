/**
 * @file dashboardRoutes.js
 * @description Registers role-protected dashboard summary endpoints.
 *
 * Responsibilities:
 * - Provide super-admin dashboard data routes.
 * - Provide school-admin dashboard and fee-collection routes.
 */
import express from "express";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  getDashboard,
  getSchoolAdminDashboard,
  getSchoolAdminFeeCollection,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("super_admin"),
  getDashboard
);

router.get(
  "/school-admin",
  protect,
  authorize("admin"),
  getSchoolAdminDashboard
);

router.get(
  "/fee-collection",
  protect,
  authorize("admin"),
  getSchoolAdminFeeCollection
);

export default router;
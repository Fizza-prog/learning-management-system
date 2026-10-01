/**
 * @file auditLogRoutes.js
 * @description Registers the protected audit-log listing endpoint.
 *
 * Responsibilities:
 * - Require authentication and an administrator role.
 * - Dispatch audit-log requests to their controller.
 */
import express from "express";

import { getAuditLogs } from "../controllers/auditLogController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("super_admin", "admin"),
  getAuditLogs
);

export default router;
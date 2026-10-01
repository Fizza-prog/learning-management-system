/**
 * @file supportRoutes.js
 * @description Registers the authenticated support-contact endpoint.
 *
 * Responsibilities:
 * - Require a signed-in user for support submissions.
 * - Dispatch contact requests to the support controller.
 */
import express from "express";
import  protect  from "../middleware/authMiddleware.js";
import {
  contactSupport,
} from "../controllers/supportController.js";

const router = express.Router();

router.post(
  "/contact",
  protect,
  contactSupport
);

export default router;
/**
 * @file feeRoutes.js
 * @description Registers protected fee-record endpoints.
 *
 * Responsibilities:
 * - Route fee list and individual record requests.
 * - Route fee creation, update, and deletion.
 */
import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { createFee, deleteFee, getFee, listFees, updateFee } from "../controllers/feeController.js";

const router = express.Router();
router.use(protect, authorize("super_admin", "admin"));
router.route("/").post(createFee).get(listFees);
router.route("/:id").get(getFee).put(updateFee).delete(deleteFee);

export default router;
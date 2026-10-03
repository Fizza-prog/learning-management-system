/**
 * @file announcementRoutes.js
 * @description Registers protected announcement endpoints.
 *
 * Responsibilities:
 * - Route list and individual announcement requests.
 * - Route announcement creation, update, and deletion.
 */
import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

router.use(protect, authorize("super_admin", "admin"));
router.route("/").post(createAnnouncement).get(getAnnouncements);
router.route("/:id").get(getAnnouncementById).put(updateAnnouncement).delete(deleteAnnouncement);

export default router;
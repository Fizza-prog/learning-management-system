/**
 * @file schoolRoutes.js
 * @description Registers super-admin school management endpoints.
 *
 * Responsibilities:
 * - Route school list, lookup, create, update, and delete requests.
 * - Route school activation and validate list filters.
 */
import express from "express";

import { createSchool,
    getAllSchools,
    getSchoolById,
    updateSchoolById,
    deleteSchoolById,
    activateSchool
 } from "../controllers/schoolController.js";
import  protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { validateSchoolFilters } from "../middleware/validateSchoolFilters.js";

const router=express.Router();


router.post("/",
    protect,
    authorize("super_admin"),
    createSchool
);

router.get(
  "/",
  protect,
  authorize("super_admin"),
  validateSchoolFilters,
  getAllSchools
);
router.get(
  "/:id",
  protect,
  authorize("super_admin"),
  getSchoolById
);


router.patch(
  "/:id",
  protect,
  authorize("super_admin"),
  updateSchoolById
);


router.delete(
  "/:id",
  protect,
  authorize("super_admin"),
  deleteSchoolById
);


router.patch(
  "/:id/activate",
  protect,
  authorize("super_admin"),
  activateSchool
);












export default router;
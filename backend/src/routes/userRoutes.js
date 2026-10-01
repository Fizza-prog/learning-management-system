/**
 * @file userRoutes.js
 * @description Registers protected user-account management endpoints.
 *
 * Responsibilities:
 * - Route user list, lookup, creation, update, and deletion requests.
 * - Enforce roles and validate user-list filters.
 */
import express from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";

import  protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {validateUserFilters} from "../middleware/validateUserFilters.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("super_admin", "admin"),
  createUser
);

router.get(
  "/", 
  protect,
  authorize("super_admin", "admin"),
  validateUserFilters,
  getAllUsers
);
router.get(
  "/:id",
  protect,
  authorize("admin", "super_admin"),
  getUserById
);

router.patch(
  "/:id",
  protect,
  authorize("admin", "super_admin"),
  updateUserById
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "super_admin"),
  deleteUserById
);

export default router;
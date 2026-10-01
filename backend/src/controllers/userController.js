/**
 * @file userController.js
 * @description Handles HTTP requests for user account management.
 *
 * Responsibilities:
 * - Dispatch user CRUD requests to user services.
 * - Pass validated list filters and pagination to the query service.
 */
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
} from "../services/userService.js";
import { getPagination } from "../utils/pagination.js";

export const createUser = async (req, res, next) => {
  try {
    const data = await createUserService(
      req.body,
      req.user,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);

    const {
      role,
      schoolId,
      search,
      verificationStatus,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await getAllUsersService(
      req.user,
      page,
      limit,
      {
        role,
        schoolId,
        search,
        verificationStatus,
        sortBy,
        sortOrder,
      }
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await updateUserByIdService(
      id,
      updateData,
      req.user,
      req.ip
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteUserByIdService(
      id,
      req.user,
      req.ip
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
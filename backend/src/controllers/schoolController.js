/**
 * @file schoolController.js
 * @description Handles HTTP requests for school administration.
 *
 * Responsibilities:
 * - Create, retrieve, update, delete, and activate schools.
 * - Validate list pagination and pass school filters to the service.
 */
import {
  createSchoolService,
  getAllSchoolsService,
  getSchoolByIdService,
  updateSchoolByIdService,
  deleteSchoolByIdService,
  activateSchoolService
} from "../services/schoolService.js";
import { getPagination } from "../utils/pagination.js";

export const createSchool = async (req, res, next) => {
  try {
    const data = await createSchoolService(req.body,req.user,req.ip);

    return res.status(201).json({
      success: true,
      message: "School created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSchools = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const {
      search = "",
      status = "all",
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const data = await getAllSchoolsService(
      req.user,
      page,
      limit,
      {
        search: search.trim(),
        status,
        sortBy,
        sortOrder: sortOrder.toUpperCase(),
      }
    );

    return res.status(200).json({
      success: true,
      message: "Schools fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const getSchoolById = async (req, res, next) => {
  try {
    const data = await getSchoolByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "School fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchoolById = async (req, res, next) => {
  try {
    const data = await updateSchoolByIdService(
      req.params.id,
      req.body,
      req.user,
      req.ip
    );

    return res.status(200).json({
      success: true,
      message: "School updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSchoolById = async (req, res, next) => {
  try {
    const result = await deleteSchoolByIdService(req.params.id,req.user,req.ip);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const activateSchool = async (req, res, next) => {
  try {
    const data = await activateSchoolService(
      req.params.id,
      req.user,
      req.ip
    );

    return res.status(200).json({
      success: true,
      message: "School activated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
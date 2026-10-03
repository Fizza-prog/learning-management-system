/**
 * @file announcementController.js
 * @description Handles HTTP requests for school announcements.
 *
 * Responsibilities:
 * - Apply administrator school scope to announcement operations.
 * - Validate request inputs through services and return API responses.
 */
import { School } from "../models/index.js";
import {
  createAnnouncement as createAnnouncementService,
  deleteAnnouncement as deleteAnnouncementService,
  getAnnouncementById as getAnnouncementByIdService,
  getAnnouncements as getAnnouncementsService,
  updateAnnouncement as updateAnnouncementService,
} from "../services/announcementService.js";
import AppError from "../utils/AppError.js";
import { getPagination } from "../utils/pagination.js";

const getSchoolAdminSchoolId = async (user, { requireActive = false } = {}) => {
  if (!user.schoolId) throw new AppError("Your account is not assigned to a school.", 403);
  if (!requireActive) return user.schoolId;

  const school = await School.findByPk(user.schoolId);
  if (!school) throw new AppError("School not found.", 404);
  if (!school.isActive) {
    throw new AppError("Announcements cannot be changed while your school is inactive.", 403);
  }
  return school.id;
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const schoolId = req.user.role === "admin"
      ? await getSchoolAdminSchoolId(req.user, { requireActive: true })
      : req.body.schoolId;
    const data = await createAnnouncementService({
      title: req.body.title,
      message: req.body.message,
      schoolId,
      createdBy: req.user.id,
    }, req.ip);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(req.query);
    const schoolId = req.user.role === "admin"
      ? await getSchoolAdminSchoolId(req.user)
      : req.query.schoolId;
    const result = await getAnnouncementsService({
      schoolId,
      search: req.query.search,
      page,
      limit,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};

export const getAnnouncementById = async (req, res, next) => {
  try {
    const schoolId = req.user.role === "admin"
      ? await getSchoolAdminSchoolId(req.user)
      : undefined;
    const data = await getAnnouncementByIdService(req.params.id, schoolId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const schoolId = req.user.role === "admin"
      ? await getSchoolAdminSchoolId(req.user, { requireActive: true })
      : undefined;
    const data = await updateAnnouncementService(
      req.params.id,
      { title: req.body.title, message: req.body.message },
      schoolId,
      req.user.id,
      req.ip
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const schoolId = req.user.role === "admin"
      ? await getSchoolAdminSchoolId(req.user, { requireActive: true })
      : undefined;
    const data = await deleteAnnouncementService(
      req.params.id,
      schoolId,
      req.user.id,
      req.ip
    );
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};
/**
 * @file announcementService.js
 * @description Implements persistence and authorization-aware announcement operations.
 *
 * Responsibilities:
 * - Create, list, retrieve, update, and delete announcements.
 * - Validate fields and record announcement changes in audit logs.
 */
import { Announcement, School, User } from "../models/index.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";
import { createAuditLog } from "./auditLogService.js";
import { sequelize } from "../config/database.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateSchoolId = (schoolId) => {
	if (typeof schoolId !== "string" || !UUID_PATTERN.test(schoolId)) {
		throw new AppError("A valid school ID is required.", 400);
	}
};

const validateAnnouncementFields = (data, { partial = false } = {}) => {
	for (const field of ["title", "message"]) {
		const value = data[field];
		if ((!partial || value !== undefined) && (typeof value !== "string" || !value.trim())) {
			throw new AppError(`${field} is required.`, 400);
		}
	}
};

const getAnnouncementOrThrow = async (id, schoolId, transaction) => {
	if (typeof id !== "string" || !UUID_PATTERN.test(id)) {
		throw new AppError("Announcement not found.", 404);
	}

	const where = { id };
	if (schoolId) where.schoolId = schoolId;
	const announcement = await Announcement.findOne({ where, transaction });
	if (!announcement) throw new AppError("Announcement not found.", 404);
	return announcement;
};

const announcementIncludes = [
	{ model: School, attributes: ["id", "name"] },
	{ model: User, as: "creator", attributes: ["id", "firstName", "lastName"] },
];

export const createAnnouncement = async (
	{ title, message, schoolId, createdBy },
	ipAddress
) => {
	validateAnnouncementFields({ title, message });
	validateSchoolId(schoolId);

	const transaction = await sequelize.transaction();
	try {
		const school = await School.findByPk(schoolId, { transaction });
		if (!school) throw new AppError("School not found.", 404);

		const announcement = await Announcement.create({
			schoolId: school.id,
			createdBy,
			title: title.trim(),
			message: message.trim(),
		}, { transaction });

		await createAuditLog({
			userId: createdBy,
			schoolId: school.id,
			action: "ANNOUNCEMENT_CREATED",
			entity: "Announcement",
			entityId: announcement.id,
			metadata: { title: announcement.title },
			ipAddress,
			transaction,
		});
		await transaction.commit();

		return Announcement.findByPk(announcement.id, { include: announcementIncludes });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

export const getAnnouncements = async ({ schoolId, search, page, limit }) => {
	const where = {};
	if (schoolId) {
		validateSchoolId(schoolId);
		where.schoolId = schoolId;
	}
	if (search?.trim()) {
		where[Op.or] = [
			{ title: { [Op.iLike]: `%${search.trim()}%` } },
			{ message: { [Op.iLike]: `%${search.trim()}%` } },
		];
	}

	const { count, rows } = await Announcement.findAndCountAll({
		where,
		include: announcementIncludes,
		order: [["createdAt", "DESC"]],
		limit,
		offset: (page - 1) * limit,
		distinct: true,
	});

	return {
		announcements: rows,
		total: count,
		page,
		limit,
		totalPages: Math.ceil(count / limit),
	};
};

export const getAnnouncementById = async (id, schoolId) => {
	const announcement = await getAnnouncementOrThrow(id, schoolId);
	return Announcement.findByPk(announcement.id, { include: announcementIncludes });
};

export const updateAnnouncement = async (id, data, schoolId, updatedBy, ipAddress) => {
	validateAnnouncementFields(data, { partial: true });
	if (data.title === undefined && data.message === undefined) {
		throw new AppError("At least one announcement field is required.", 400);
	}

	const transaction = await sequelize.transaction();
	try {
		const announcement = await getAnnouncementOrThrow(id, schoolId, transaction);
		const changes = {};
		for (const field of ["title", "message"]) {
			if (data[field] !== undefined && announcement[field] !== data[field].trim()) {
				changes[field] = { old: announcement[field], new: data[field].trim() };
				announcement[field] = data[field].trim();
			}
		}
		if (Object.keys(changes).length) {
			await announcement.save({ transaction });
			await createAuditLog({
				userId: updatedBy,
				schoolId: announcement.schoolId,
				action: "ANNOUNCEMENT_UPDATED",
				entity: "Announcement",
				entityId: announcement.id,
				metadata: { changes },
				ipAddress,
				transaction,
			});
		}
		await transaction.commit();
		return Announcement.findByPk(announcement.id, { include: announcementIncludes });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

export const deleteAnnouncement = async (id, schoolId, deletedBy, ipAddress) => {
	const transaction = await sequelize.transaction();
	try {
		const announcement = await getAnnouncementOrThrow(id, schoolId, transaction);
		await createAuditLog({
			userId: deletedBy,
			schoolId: announcement.schoolId,
			action: "ANNOUNCEMENT_DELETED",
			entity: "Announcement",
			entityId: announcement.id,
			metadata: { title: announcement.title },
			ipAddress,
			transaction,
		});
		await announcement.destroy({ transaction });
		await transaction.commit();
		return { success: true, message: "Announcement deleted successfully." };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

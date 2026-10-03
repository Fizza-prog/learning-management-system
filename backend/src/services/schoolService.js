/**
 * @file schoolService.js
 * @description Implements school creation, lookup, maintenance, and activation.
 *
 * Responsibilities:
 * - Query and filter paginated school records.
 * - Validate school changes and record mutations in audit logs.
 */
import School from "../models/School.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";
import { createAuditLog } from "./auditLogService.js";
import { sequelize } from "../config/database.js";

export const createSchoolService = async (
  schoolData,
  currentUser,
  ipAddress
) => {
  const transaction = await sequelize.transaction();

  try {
    const { name, email, phone, address } = schoolData;

    if (!name || !email || !phone || !address) {
      throw new AppError("All school fields are required", 400);
    }

    const existingSchool = await School.findOne({
      where: { email },
      transaction,
    });

    if (existingSchool) {
      throw new AppError(
        "School with this email already exists",
        409
      );
    }

    const school = await School.create(
      {
        name,
        email,
        phone,
        address,
      },
      {
        transaction,
      }
    );

    // Create audit log in the same transaction
    await createAuditLog({
      userId: currentUser.id,
      schoolId: school.id,
      action: "SCHOOL_CREATED",
      entity: "School",
      entityId: school.id,
      metadata: {
        name: school.name,
        email: school.email,
      },
      ipAddress,
      transaction,
    });

    await transaction.commit();

    return school;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getAllSchoolsService = async (
  currentUser,
  page = 1,
  limit = 20,
  filters = {}
) => {
  const offset = (page - 1) * limit;

  const where = {};

  // Admin can only see their own school
  if (currentUser.role === "admin") {
    where.id = currentUser.schoolId;
  }

  if (filters.search) {
    where.name = {
      [Op.iLike]: `%${filters.search}%`,
    };
  }

  if (filters.status === "active" || filters.status === "inactive") {
    where.isActive = filters.status === "active";
  }

  const sortBy = filters.sortBy === "name" ? "name" : "createdAt";
  const sortOrder = filters.sortOrder === "ASC" ? "ASC" : "DESC";

  const { count, rows } = await School.findAndCountAll({
    attributes: ["id", "name", "email", "phone", "address", "isActive", "createdAt"],
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  return {
    schools: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const getSchoolByIdService = async (id) => {
  const school = await School.findByPk(id);

  if (!school) {
    throw new AppError("School not found", 404);
  }

  return school;
};

export const updateSchoolByIdService = async (
  id,
  updateData,
  currentUser,
  ipAddress
) => {
  const transaction = await sequelize.transaction();

  try {
    const school = await School.findByPk(id, {
      transaction,
    });

    if (!school) {
      throw new AppError("School not found", 404);
    }

    if (!school.isActive) {
      throw new AppError(
        "Cannot update an inactive school",
        400
      );
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "address",
    ];

    const invalidFields = Object.keys(updateData).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new AppError(
        `Invalid fields: ${invalidFields.join(", ")}`,
        400
      );
    }

    if (
      updateData.email &&
      updateData.email !== school.email
    ) {
      const existingSchool = await School.findOne({
        where: {
          email: updateData.email,
        },
        transaction,
      });

      if (existingSchool) {
        throw new AppError(
          "School with this email already exists",
          409
        );
      }
    }

    // Track changes before update
    const changes = {};

    for (const field of Object.keys(updateData)) {
      if (school[field] !== updateData[field]) {
        changes[field] = {
          old: school[field],
          new: updateData[field],
        };
      }
    }

    // Update school in the same transaction
    await school.update(updateData, {
      transaction,
    });

    // Only create audit log when something actually changed
    if (Object.keys(changes).length > 0) {
      await createAuditLog({
        userId: currentUser.id,
        schoolId: school.id,
        action: "SCHOOL_UPDATED",
        entity: "School",
        entityId: school.id,
        metadata: {
          changes,
        },
        ipAddress,
        transaction,
      });
    }

    await transaction.commit();

    return school;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteSchoolByIdService = async (
  id,
  currentUser,
  ipAddress
) => {
  const transaction = await sequelize.transaction();

  try {
    const school = await School.findByPk(id, {
      transaction,
    });

    if (!school) {
      throw new AppError("School not found", 404);
    }

    const users = await User.count({
      where: {
        schoolId: id,
      },
      transaction,
    });

    // If school has users, deactivate instead of permanently deleting
    if (users > 0) {
      school.isActive = false;

      await school.save({
        transaction,
      });

      await createAuditLog({
        userId: currentUser.id,
        schoolId: school.id,
        action: "SCHOOL_DEACTIVATED",
        entity: "School",
        entityId: school.id,
        metadata: {
          name: school.name,
        },
        ipAddress,
        transaction,
      });

      await transaction.commit();

      return {
        message: "School deactivated successfully",
        school,
      };
    }

    // Audit before permanent deletion
    await createAuditLog({
      userId: currentUser.id,
      schoolId: school.id,
      action: "SCHOOL_DELETED",
      entity: "School",
      entityId: school.id,
      metadata: {
        name: school.name,
        email: school.email,
      },
      ipAddress,
      transaction,
    });

    await school.destroy({
      transaction,
    });

    await transaction.commit();

    return {
      message: "School deleted successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const activateSchoolService = async (
  id,
  currentUser,
  ipAddress
) => {
  const transaction = await sequelize.transaction();

  try {
    const school = await School.findByPk(id, {
      transaction,
    });

    if (!school) {
      throw new AppError("School not found", 404);
    }

    if (school.isActive) {
      throw new AppError(
        "School is already active",
        400
      );
    }

    school.isActive = true;

    await school.save({
      transaction,
    });

    await createAuditLog({
      userId: currentUser.id,
      schoolId: school.id,
      action: "SCHOOL_ACTIVATED",
      entity: "School",
      entityId: school.id,
      metadata: {
        name: school.name,
      },
      ipAddress,
      transaction,
    });

    await transaction.commit();

    return school;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
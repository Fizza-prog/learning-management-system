/**
 * @file feeService.js
 * @description Implements validated, school-scoped fee record operations.
 *
 * Responsibilities:
 * - Query fees with student, school, and status filters.
 * - Create, update, and delete fees with transactional audit records.
 */
import { Op } from "sequelize";
import { Fee, School, User } from "../models/index.js";
import AppError from "../utils/AppError.js";
import { createAuditLog } from "./auditLogService.js";
import { sequelize } from "../config/database.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_STATUSES = ["pending", "paid", "overdue"];

const validateUuid = (value, label) => {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new AppError(`${label} must be a valid UUID.`, 400);
  }
};

const getAdminSchool = async (currentUser, transaction) => {
  if (currentUser.role !== "admin") return null;
  if (!currentUser.schoolId) {
    throw new AppError("Your account is not assigned to a school.", 403);
  }

  const school = await School.findByPk(currentUser.schoolId, { transaction });
  if (!school) throw new AppError("School not found.", 404);
  return school;
};

const assertSchoolCanMutate = async (currentUser, transaction) => {
  const school = await getAdminSchool(currentUser, transaction);
  if (school && !school.isActive) {
    throw new AppError("Fees cannot be changed while your school is inactive.", 403);
  }
  return school;
};

const resolveSchoolId = async (requestedSchoolId, currentUser, transaction) => {
  const schoolId = currentUser.role === "admin"
    ? currentUser.schoolId
    : requestedSchoolId;

  if (!schoolId) throw new AppError("School is required.", 400);
  validateUuid(schoolId, "School ID");

  const school = await School.findByPk(schoolId, { transaction });
  if (!school) throw new AppError("School not found.", 404);

  if (currentUser.role === "admin" && school.id !== currentUser.schoolId) {
    throw new AppError("You cannot manage fees for another school.", 403);
  }
  return school;
};

const validateStudent = async (studentId, schoolId, transaction) => {
  if (!studentId) throw new AppError("Student is required.", 400);
  validateUuid(studentId, "Student ID");

  const student = await User.findByPk(studentId, { transaction });
  if (!student) throw new AppError("Student not found.", 404);
  if (student.role !== "student") throw new AppError("Selected user is not a student.", 400);
  if (student.schoolId !== schoolId) {
    throw new AppError("Student does not belong to the selected school.", 400);
  }
  return student;
};

const validateFeeFields = (data, { partial = false } = {}) => {
  const required = ["feeType", "amount", "dueDate"];
  if (!partial) {
    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        throw new AppError(`${field} is required.`, 400);
      }
    }
  }

  if (data.feeType !== undefined && (typeof data.feeType !== "string" || !data.feeType.trim() || data.feeType.length > 80)) {
    throw new AppError("Fee type must be between 1 and 80 characters.", 400);
  }
  if (data.amount !== undefined && (!Number.isFinite(Number(data.amount)) || Number(data.amount) <= 0 || Number(data.amount) > 9999999999.99)) {
    throw new AppError("Amount must be a positive number.", 400);
  }
  if (data.dueDate !== undefined) {
    const parsedDate = typeof data.dueDate === "string"
      ? new Date(`${data.dueDate}T00:00:00.000Z`)
      : new Date(Number.NaN);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(data.dueDate) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== data.dueDate
    ) {
      throw new AppError("A valid due date is required.", 400);
    }
  }
  if (data.status !== undefined && !ALLOWED_STATUSES.includes(data.status)) {
    throw new AppError("Status must be pending, paid, or overdue.", 400);
  }
  if (data.description !== undefined && data.description !== null && typeof data.description !== "string") {
    throw new AppError("Description must be text.", 400);
  }
};

const getScopedFee = async (id, currentUser, transaction) => {
  validateUuid(id, "Fee ID");
  const where = { id };
  if (currentUser.role === "admin") where.schoolId = currentUser.schoolId;
  const fee = await Fee.findOne({ where, transaction });
  if (!fee) throw new AppError("Fee not found.", 404);
  return fee;
};

export const listFeesService = async (currentUser, page, limit, filters = {}) => {
  const where = {};
  if (currentUser.role === "admin") {
    if (!currentUser.schoolId) {
      return { fees: [], total: 0, page, limit, totalPages: 0 };
    }
    where.schoolId = currentUser.schoolId;
  } else if (filters.schoolId) {
    validateUuid(filters.schoolId, "School ID");
    where.schoolId = filters.schoolId;
  }

  if (filters.status) {
    if (!ALLOWED_STATUSES.includes(filters.status)) throw new AppError("Invalid fee status.", 400);
    where.status = filters.status;
  }
  if (filters.feeType) where.feeType = { [Op.iLike]: `%${filters.feeType}%` };

  const studentWhere = { role: "student" };
  if (filters.search) {
    studentWhere[Op.or] = [
      { firstName: { [Op.iLike]: `%${filters.search}%` } },
      { lastName: { [Op.iLike]: `%${filters.search}%` } },
      { email: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const { count, rows } = await Fee.findAndCountAll({
    where,
    include: [
      { model: User, as: "student", attributes: ["id", "firstName", "lastName", "email"], where: studentWhere },
      { model: School, attributes: ["id", "name"] },
    ],
    order: [["dueDate", "ASC"], ["createdAt", "DESC"]],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
  });

  return { fees: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
};

export const getFeeService = async (id, currentUser) => {
  const fee = await getScopedFee(id, currentUser);
  return Fee.findByPk(fee.id, {
    include: [
      { model: User, as: "student", attributes: ["id", "firstName", "lastName", "email"] },
      { model: School, attributes: ["id", "name"] },
    ],
  });
};

export const createFeeService = async (data, currentUser, ipAddress) => {
  validateFeeFields(data);
  const transaction = await sequelize.transaction();
  try {
    const school = await assertSchoolCanMutate(currentUser, transaction);
    const targetSchool = await resolveSchoolId(data.schoolId, currentUser, transaction);
    await validateStudent(data.studentId, targetSchool.id, transaction);

    const fee = await Fee.create({
      schoolId: school?.id || targetSchool.id,
      studentId: data.studentId,
      feeType: data.feeType.trim(),
      amount: data.amount,
      dueDate: data.dueDate,
      status: data.status || "pending",
      paidAt: data.status === "paid" ? new Date() : null,
      description: data.description?.trim() || null,
    }, { transaction });

    await createAuditLog({ userId: currentUser.id, schoolId: fee.schoolId, action: "FEE_CREATED", entity: "Fee", entityId: fee.id, metadata: { feeType: fee.feeType, amount: fee.amount }, ipAddress, transaction });
    await transaction.commit();
    return getFeeService(fee.id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateFeeService = async (id, data, currentUser, ipAddress) => {
  validateFeeFields(data, { partial: true });
  const transaction = await sequelize.transaction();
  try {
    await assertSchoolCanMutate(currentUser, transaction);
    const fee = await getScopedFee(id, currentUser, transaction);
    if (data.schoolId !== undefined) {
      const school = await resolveSchoolId(data.schoolId, currentUser, transaction);
      fee.schoolId = school.id;
    }
    if (data.studentId !== undefined) fee.studentId = data.studentId;
    if (data.schoolId !== undefined || data.studentId !== undefined) {
      await validateStudent(fee.studentId, fee.schoolId, transaction);
    }

    for (const field of ["feeType", "amount", "dueDate", "description"]) {
      if (data[field] !== undefined) fee[field] = field === "feeType" || field === "description" ? data[field]?.trim() || null : data[field];
    }
    if (data.status !== undefined) {
      fee.status = data.status;
      fee.paidAt = data.status === "paid" ? fee.paidAt || new Date() : null;
    }
    await fee.save({ transaction });
    await createAuditLog({ userId: currentUser.id, schoolId: fee.schoolId, action: "FEE_UPDATED", entity: "Fee", entityId: fee.id, metadata: { status: fee.status }, ipAddress, transaction });
    await transaction.commit();
    return getFeeService(fee.id, currentUser);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteFeeService = async (id, currentUser, ipAddress) => {
  const transaction = await sequelize.transaction();
  try {
    await assertSchoolCanMutate(currentUser, transaction);
    const fee = await getScopedFee(id, currentUser, transaction);
    await createAuditLog({ userId: currentUser.id, schoolId: fee.schoolId, action: "FEE_DELETED", entity: "Fee", entityId: fee.id, metadata: { feeType: fee.feeType }, ipAddress, transaction });
    await fee.destroy({ transaction });
    await transaction.commit();
    return { success: true, message: "Fee deleted successfully." };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
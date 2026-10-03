/**
 * @file userService.js
 * @description Implements user account operations with school-scoped authorization, verification, and audit logging.
 *
 * Responsibilities:
 * - Create user accounts and send email verification messages.
 * - Retrieve, filter, sort, and paginate users within authorized school scopes.
 * - Update or delete users transactionally while recording audit events.
 */
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import School from "../models/School.js";

import sanitizeUser from "../utils/sanitizeUser.js";

import validator from "validator";
import crypto from "crypto";

import verificationEmail from "../utils/verificationEmail.js";
import sendEmail from "../utils/sendEmail.js";

import AppError from "../utils/AppError.js";
import { createAuditLog } from "./auditLogService.js";
import { sequelize } from "../config/database.js";
import { Op } from "sequelize";
import { validatePassword } from "../utils/validatePassword.js";


// ============================================
// CREATE USER
// ============================================

export const createUserService = async (
  userData,
  currentUser,
  ipAddress
) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    schoolId,
  } = userData;

  if (!currentUser || !currentUser.role) {
    throw new AppError(
      "Current user information is required.",
      401
    );
  }

  // Only super admin and admin can create users
  const creatorRoles = ["super_admin", "admin"];

  if (!creatorRoles.includes(currentUser.role)) {
    throw new AppError(
      "You are not authorized to create users.",
      403
    );
  }

  // Allowed roles
  const allowedRoles = [
    "admin",
    "teacher",
    "student",
  ];

  if (!allowedRoles.includes(role)) {
    throw new AppError(
      "Invalid role.",
      400
    );
  }

  // Super Admin can only create Admins
  if (
    currentUser.role === "super_admin" &&
    role !== "admin"
  ) {
    throw new AppError(
      "Super admin can only create admins.",
      403
    );
  }

  // Admin can only create Teachers and Students
  if (
    currentUser.role === "admin" &&
    role !== "teacher" &&
    role !== "student"
  ) {
    throw new AppError(
      "Admin can only create teachers and students.",
      403
    );
  }

  if (!schoolId) {
    throw new AppError(
      "School ID is required.",
      400
    );
  }

  validatePassword(password);

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const verificationToken = crypto
    .randomBytes(32)
    .toString("hex");

  const verificationExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const transaction = await sequelize.transaction();

  let user;

  try {
    const existingUser = await User.findOne({
      where: { email },
      transaction,
    });

    if (existingUser) {
      throw new AppError(
        "User already exists.",
        409
      );
    }

    const school = await School.findByPk(schoolId, {
      transaction,
    });

    if (!school) {
      throw new AppError(
        "School not found.",
        404
      );
    }

    // Cannot create user in inactive school
    if (!school.isActive) {
      throw new AppError(
        "Cannot create users for an inactive school.",
        400
      );
    }

    // Admin can only create users in their own school
    if (
      currentUser.role === "admin" &&
      currentUser.schoolId !== schoolId
    ) {
      throw new AppError(
        "You cannot create users for another school.",
        403
      );
    }

    user = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        schoolId,

        isVerified: false,

        emailVerificationToken:
          verificationToken,

        emailVerificationExpiry:
          verificationExpiry,

        lastVerificationEmailSent:
          new Date(),
      },
      {
        transaction,
      }
    );

    // Create audit log in SAME transaction
    await createAuditLog({
      userId: currentUser.id,
      schoolId: schoolId,
      action: "USER_CREATED",
      entity: "User",
      entityId: user.id,
      metadata: {
        role: user.role,
      },
      ipAddress,
      transaction,
    });

    // Commit user + audit log together
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  // ------------------------------------------------
  // IMPORTANT:
  // Transaction is already committed here.
  // Email is an external side effect.
  // ------------------------------------------------

  const verificationLink =
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const emailBody = verificationEmail(
    user.firstName,
    verificationLink
  );

  await sendEmail(
    user.email,
    "Verify your email",
    emailBody
  );

  return sanitizeUser(user);
};

// ============================================
// GET ALL USERS
// ============================================

export const getAllUsersService = async (
  currentUser,
  page,
  limit,
  filters = {}
) => {
  const {
    role,
    schoolId,
    search,
    verificationStatus,
    sortBy,
    sortOrder,
  } = filters;
   
  
  const offset = (page - 1) * limit;

  const where = {};

  // --------------------------------
  // MULTI-TENANT AUTHORIZATION
  // --------------------------------

  if (currentUser.role === "admin") {
    where.schoolId = currentUser.schoolId;
  }
  

  // --------------------------------
  // ROLE FILTER
  // --------------------------------

  if (role) {
    where.role = role;
  }

  if (verificationStatus) {
    where.isVerified = verificationStatus === "verified";
  }
  

  // --------------------------------
  // SCHOOL FILTER
  // --------------------------------

  if (currentUser.role === "super_admin" && schoolId) {
  where.schoolId = schoolId;
}


  // --------------------------------
  // SEARCH FILTER
  // --------------------------------

  if (search) {
    where[Op.or] = [
      {
        firstName: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        lastName: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        email: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  console.log("Search filtering done");
  // --------------------------------
  // SORTING
  // --------------------------------

  const allowedSortFields = [
    "firstName",
    "lastName",
    "email",
    "createdAt",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder =
    sortOrder?.toLowerCase() === "asc"
      ? "ASC"
      : "DESC";

      
  // --------------------------------
  // DATABASE QUERY
  // --------------------------------


  const { count, rows } = await User.findAndCountAll({
    where,
    attributes:{
      exclude:["password",
        "refreshToken",
        "emailVerificationToken",
        "emailVerificationExpiry",
        "resetPasswordToken",
        "resetPasswordExpiry",
        "lastVerificationEmailSent",],
    },

    order: [[safeSortBy, safeSortOrder]],

    limit,
    offset,
  });

  return {
    users: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

// ============================================
// GET USER BY ID
// ============================================

export const getUserByIdService = async (
  id,
  currentUser
) => {

  const user = await User.findByPk(id);


  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }


  // Admin can only access users
  // from their own school
  if (
    currentUser.role === "admin" &&
    user.schoolId !== currentUser.schoolId
  ) {
    throw new AppError(
      "Access denied",
      403
    );
  }


  return sanitizeUser(user);
};


// ============================================
// UPDATE USER
// ============================================

export const updateUserByIdService = async (
  id,
  updateData,
  currentUser,
  ipAddress
) => {
  if (!validator.isUUID(id)) {
    throw new AppError(
      "Invalid user ID",
      400
    );
  }

  // Start transaction BEFORE fetching user
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(id, {
      transaction,
    });

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    const oldRole = user.role;
    const oldSchoolId = user.schoolId;

    // Admin can only update users
    // from their own school
    if (
      currentUser.role === "admin" &&
      user.schoolId !== currentUser.schoolId
    ) {
      throw new AppError(
        "You are not authorized to update this user",
        403
      );
    }

    // Allowed fields
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
      "schoolId",
    ];

    // Check invalid fields
    const invalidFields = Object.keys(
      updateData
    ).filter(
      (field) =>
        !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new AppError(
        `Invalid fields: ${invalidFields.join(", ")}`,
        400
      );
    }

    // Admin cannot update role or school
    if (
      currentUser.role === "admin" &&
      (
        updateData.role !== undefined ||
        updateData.schoolId !== undefined
      )
    ) {
      throw new AppError(
        "Admin cannot change role or school",
        403
      );
    }

    if (
      updateData.firstName !== undefined
    ) {
      user.firstName =
        updateData.firstName;
    }

    if (
      updateData.lastName !== undefined
    ) {
      user.lastName =
        updateData.lastName;
    }

    if (
      updateData.email !== undefined
    ) {
      const existingUser =
        await User.findOne({
          where: {
            email: updateData.email,
          },
          transaction,
        });

      if (
        existingUser &&
        existingUser.id !== user.id
      ) {
        throw new AppError(
          "Email already exists",
          409
        );
      }

      user.email =
        updateData.email;

      // Email changed
      // Require verification again
      user.isVerified = false;
    }

    if (
      updateData.password !== undefined
    ) {
      validatePassword(updateData.password);

      user.password =
        await bcrypt.hash(
          updateData.password,
          10
        );
    }

// Super Admin can change role
const allowedRoles = [
  "admin",
  "teacher",
  "student",
];

if (updateData.role !== undefined) {
  if (currentUser.role !== "super_admin") {
    throw new AppError(
      "Only super admin can change user role",
      403
    );
  }

  if (!allowedRoles.includes(updateData.role)) {
    throw new AppError(
      "Invalid role",
      400
    );
  }

  user.role = updateData.role;
}

    // Super Admin can change school
    if (
      updateData.schoolId !== undefined
    ) {
      if (
        currentUser.role !== "super_admin"
      ) {
        throw new AppError(
          "Only super admin can change user's school",
          403
        );
      }

      user.schoolId =
        updateData.schoolId;
    }

    // Save user inside transaction
    await user.save({
      transaction,
    });

    // USER_UPDATED audit log
    await createAuditLog({
      userId: currentUser.id,
      schoolId: user.schoolId || oldSchoolId,
      action: "USER_UPDATED",
      entity: "User",
      entityId: user.id,
      metadata: {
        updatedFields: Object.keys(updateData),
      },
      ipAddress,
      transaction,
    });

    // ROLE_CHANGED audit log
    if (
      updateData.role !== undefined &&
      updateData.role !== oldRole
    ) {
      await createAuditLog({
        userId: currentUser.id,
        schoolId: user.schoolId || oldSchoolId,
        action: "ROLE_CHANGED",
        entity: "User",
        entityId: user.id,
        metadata: {
          oldRole,
          newRole: user.role,
        },
        ipAddress,
        transaction,
      });
    }

    // Commit user + all audit logs together
    await transaction.commit();

    return sanitizeUser(user);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// ============================================
// DELETE USER
// ============================================

export const deleteUserByIdService = async (
  id,
  currentUser,
  ipAddress
) => {
  if (!validator.isUUID(id)) {
    throw new AppError(
      "Invalid user ID",
      400
    );
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(id, {
      transaction,
    });

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    // Admin can only delete users
    // from their own school
    if (
      currentUser.role === "admin" &&
      user.schoolId !== currentUser.schoolId
    ) {
      throw new AppError(
        "You are not authorized to delete this user",
        403
      );
    }

    // Capture values before deletion
    const deletedUserId = user.id;
    const deletedUserSchoolId = user.schoolId;
    const deletedUserRole = user.role;

    await user.destroy({
      transaction,
    });

    // Create audit log BEFORE commit
    await createAuditLog({
      userId: currentUser.id,
      schoolId: deletedUserSchoolId,
      action: "USER_DELETED",
      entity: "User",
      entityId: deletedUserId,
      metadata: {
        role: deletedUserRole,
      },
      ipAddress,
      transaction,
    });

    // Commit deletion + audit log together
    await transaction.commit();

    return {
      message: "User deleted successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
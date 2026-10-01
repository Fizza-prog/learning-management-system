/**
 * @file dashboardService.js
 * @description Aggregates database metrics for administrator dashboards.
 *
 * Responsibilities:
 * - Calculate school-admin student, teacher, and fee totals.
 * - Build super-admin school, fee, and tenant-growth summaries.
 */
import { Op, fn, col, literal } from "sequelize";

import { Fee, User, School } from "../models/index.js";

// =====================================================
// SCHOOL ADMIN — FEE COLLECTION
// =====================================================

export const getSchoolAdminFeeCollectionService = async (schoolId) => {
  if (!schoolId) return { monthToDate: 0 };

  const now = new Date();

  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );

  const nextMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  );

  const monthToDate = await Fee.sum("amount", {
    where: {
      schoolId,
      status: "paid",
      paidAt: {
        [Op.gte]: monthStart,
        [Op.lt]: nextMonthStart,
      },
    },
  });

  return {
    monthToDate: Number(monthToDate) || 0,
  };
};

// =====================================================
// SCHOOL ADMIN DASHBOARD
// =====================================================

export const getSchoolAdminDashboardService = async (schoolId) => {
  if (!schoolId) {
    return {
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        feeCollectionMonthToDate: 0,
      },
    };
  }

  const [
    totalStudents,
    totalTeachers,
    feeCollectionMonthToDate,
  ] = await Promise.all([
    User.count({
      where: {
        schoolId,
        role: "student",
      },
    }),

    User.count({
      where: {
        schoolId,
        role: "teacher",
      },
    }),

    getSchoolAdminFeeCollectionService(schoolId),
  ]);

  return {
    stats: {
      totalStudents,
      totalTeachers,
      feeCollectionMonthToDate:
        feeCollectionMonthToDate.monthToDate,
    },
  };
};

// =====================================================
// SUPER ADMIN DASHBOARD
// =====================================================

export const getSuperAdminDashboardService = async () => {
  console.time("SUPER_ADMIN_DASHBOARD");

  const now = new Date();

  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );

  const nextMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  );

  // ---------------------------------------------------
  // 1. TOTAL SCHOOLS + ACTIVE STUDENTS
  // ---------------------------------------------------
  // Both values are calculated in one database query.
  // This removes one dashboard DB round trip.

  console.time("dashboardStats");

  const dashboardStatsPromise = School.findOne({
    attributes: [
      [
        literal(`(
          SELECT COUNT(*)
          FROM "Schools"
        )`),
        "totalSchools",
      ],

      [
        literal(`(
          SELECT COUNT(*)
          FROM "Users" AS u
          INNER JOIN "Schools" AS s
            ON s."id" = u."schoolId"
          WHERE u."role" = 'student'
            AND s."isActive" = true
        )`),
        "activeStudents",
      ],
    ],

    raw: true,
  }).finally(() => {
    console.timeEnd("dashboardStats");
  });

  // ---------------------------------------------------
  // 2. MONTH-TO-DATE FEE COLLECTION
  // ---------------------------------------------------

  console.time("feeCollection");

  const feeCollectionPromise = Fee.sum("amount", {
    where: {
      status: "paid",

      paidAt: {
        [Op.gte]: monthStart,
        [Op.lt]: nextMonthStart,
      },
    },
  }).finally(() => {
    console.timeEnd("feeCollection");
  });

  // ---------------------------------------------------
  // 3. RECENT SCHOOLS
  // ---------------------------------------------------

  console.time("recentSchools");

  const recentSchoolsPromise = School.findAll({
    attributes: [
      "id",
      "name",
      "isActive",
      "createdAt",

      [
        literal(`(
          SELECT COUNT(*)
          FROM "Users" AS u
          WHERE u."schoolId" = "School"."id"
            AND u."role" = 'student'
        )`),
        "studentCount",
      ],

      [
        literal(`(
          SELECT CONCAT(u."firstName", ' ', u."lastName")
          FROM "Users" AS u
          WHERE u."schoolId" = "School"."id"
            AND u."role" = 'admin'
          LIMIT 1
        )`),
        "adminName",
      ],
    ],

    order: [["createdAt", "DESC"]],

    limit: 5,

    raw: true,
  }).finally(() => {
    console.timeEnd("recentSchools");
  });

  // ---------------------------------------------------
  // 4. TENANT GROWTH
  // ---------------------------------------------------

  console.time("tenantGrowth");

  const tenantGrowthPromise = School.findAll({
    attributes: [
      [
        fn(
          "DATE_TRUNC",
          "month",
          col("createdAt")
        ),
        "month",
      ],

      [
        fn(
          "COUNT",
          col("id")
        ),
        "schools",
      ],
    ],

    group: [
      fn(
        "DATE_TRUNC",
        "month",
        col("createdAt")
      ),
    ],

    order: [
      [
        fn(
          "DATE_TRUNC",
          "month",
          col("createdAt")
        ),
        "ASC",
      ],
    ],

    raw: true,
  }).finally(() => {
    console.timeEnd("tenantGrowth");
  });

  // ===================================================
  // RUN ALL QUERIES CONCURRENTLY
  // ===================================================

  const [
    dashboardStats,
    feeCollectionMonthToDate,
    recentSchools,
    tenantGrowth,
  ] = await Promise.all([
    dashboardStatsPromise,
    feeCollectionPromise,
    recentSchoolsPromise,
    tenantGrowthPromise,
  ]);

  // ===================================================
  // FORMAT RECENT SCHOOLS
  // ===================================================

  const formattedRecentSchools = recentSchools.map(
    (school) => ({
      id: school.id,

      name: school.name,

      admin: school.adminName || "N/A",

      students:
        Number(school.studentCount) || 0,

      status: school.isActive
        ? "Active"
        : "Suspended",

      createdAt: school.createdAt,
    })
  );

  // ===================================================
  // FORMAT TENANT GROWTH
  // ===================================================

  const formattedTenantGrowth =
    tenantGrowth.map((item) => {
      const date = new Date(item.month);

      return {
        month: date.toLocaleString("en-US", {
          month: "short",
        }),

        schools: Number(item.schools),
      };
    });

  // ===================================================
  // FINAL RESPONSE
  // ===================================================

  console.timeEnd("SUPER_ADMIN_DASHBOARD");

  return {
    stats: {
      totalSchools:
        Number(dashboardStats.totalSchools) || 0,

      activeStudents:
        Number(dashboardStats.activeStudents) || 0,

      feeCollectionMonthToDate:
        Number(feeCollectionMonthToDate) || 0,
    },

    recentSchools:
      formattedRecentSchools,

    tenantGrowth:
      formattedTenantGrowth,
  };
};
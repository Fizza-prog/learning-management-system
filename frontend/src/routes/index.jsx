/**
 * @file index.jsx
 * @description Declares public, authentication, and dashboard routes.
 *
 * Responsibilities:
 * - Map URL paths to page components and layouts.
 * - Apply guest, authentication, and role guards.
 */
import { Routes, Route } from "react-router-dom";

import VerifyEmail from "../features/auth/pages/VerifyEmail";
import VerifyEmailChange from "../features/auth/pages/VerifyEmailChange";

import PublicLayout from "../layouts/PublicLayout";
import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/LandingPage";

import Login from "../features/auth/pages/Login";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

import DashboardRouter from "../features/dashboard/DashboardRouter";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import GuestRoute from "./GuestRoute";

// Dashboard Pages

import Student from "../features/students/pages/Student";
import Teacher from "../features/teacher/pages/Teacher";

import Classes from "../features/classes/pages/Classes";
import Timetable from "../features/timetable/pages/Timetable";
import Attendance from "../features/attendance/pages/Attendance";
import Exam from "../features/exam/pages/Exam";
import Fees from "../features/fees/pages/Fees";
import Announcements from "../features/announcements/pages/Announcements";

import AddMember from "../features/dashboard/pages/AddMember";
import Users from "../features/dashboard/pages/Users";
import Schools from "../features/dashboard/pages/Schools";
import AddSchool from "../features/dashboard/pages/AddSchool";
import AuditLogs from "../features/dashboard/pages/AuditLogs";

import Profile from "../features/dashboard/pages/Profile";
import AccountSettings from "../features/dashboard/pages/AccountSettings";
import ChangePassword from "../features/dashboard/pages/ChangePassword";
import HelpSupport from "../features/dashboard/pages/HelpSupport";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<LandingPage />}
        />
      </Route>

      <Route element={<GuestRoute />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Route>

      <Route
        path="/verify-email/:token"
        element={<VerifyEmail />}
      />

      <Route
        path="/verify-email-change/:token"
        element={<VerifyEmailChange />}
      />


      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>

        <Route
          element={
            <RoleGuard
              allowedRoles={[
                "super_admin",
                "admin",
                "teacher",
                "student",
              ]}
            />
          }
        >

          <Route element={<MainLayout />}>

            {/* ================= DASHBOARD ================= */}

            <Route
              path="/dashboard"
              element={<DashboardRouter />}
            />


            {/* ================= SUPER ADMIN ================= */}

            <Route
              path="/dashboard/schools"
              element={<Schools />}
            />

            <Route
              path="/dashboard/schools/add"
              element={<AddSchool />}
            />

            <Route
              path="/dashboard/schools/edit/:id"
              element={<AddSchool />}
            />


            {/* ================= SCHOOL FEATURES ================= */}

            <Route
              path="/dashboard/students"
              element={
                <RoleGuard allowedRoles={["admin"]} />
              }
            >
              <Route
                index
                element={<Student />}
              />
            </Route>

            <Route
              path="/dashboard/teachers"
              element={
                <RoleGuard allowedRoles={["admin"]} />
              }
            >
              <Route
                index
                element={<Teacher />}
              />
            </Route>

            <Route
              path="/dashboard/classes"
              element={<Classes />}
            />

            <Route
              path="/dashboard/timetable"
              element={<Timetable />}
            />

            <Route
              path="/dashboard/attendance"
              element={<Attendance />}
            />

            <Route
              path="/dashboard/fees"
              element={<RoleGuard allowedRoles={["super_admin", "admin"]} />}
            >
              <Route index element={<Fees />} />
            </Route>

            <Route
              path="/dashboard/exams"
              element={<Exam />}
            />

            <Route
              path="/dashboard/announcements"
              element={<RoleGuard allowedRoles={["super_admin", "admin"]} />}
            >
              <Route index element={<Announcements />} />
            </Route>


            {/* ================= USER MANAGEMENT ================= */}

            <Route
              path="/dashboard/members"
              element={<Users />}
            />

            <Route
              path="/dashboard/add-member"
              element={<AddMember />}
            />

            <Route
              path="/dashboard/audit-logs"
              element={
                <RoleGuard
                  allowedRoles={["super_admin", "admin"]}
                />
              }
            >
              <Route
                index
                element={<AuditLogs />}
              />
            </Route>


            {/* ================= ACCOUNT ================= */}

            <Route
              path="/dashboard/profile"
              element={<Profile />}
            />

            <Route
              path="/dashboard/account-settings"
              element={<AccountSettings />}
            />

            <Route
              path="/dashboard/change-password"
              element={<ChangePassword />}
            />

            <Route
              path="/dashboard/help-support"
              element={<HelpSupport />}
            />

          </Route>

        </Route>

      </Route>

    </Routes>
  );
}

export default AppRoutes;
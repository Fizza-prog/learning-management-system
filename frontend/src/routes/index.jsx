import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/LandingPage";

import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

import DashboardRouter from "../features/dashboard/DashboardRouter";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

// Dashboard Pages
import Students from "../features/students/pages/Students";
import Teacher from "../features/teacher/pages/Teacher";
import Classes from "../features/classes/pages/Classes";
import Timetable from "../features/timetable/pages/Timetable";
import Attendance from "../features/attendance/pages/Attendance";
 import Exam from "../features/exam/pages/Exam";
import Fees from "../features/fees/pages/Fees";
import Announcements from "../features/Announcements/pages/Announcements";
import Settings from "../features/settings/pages/Settings";
function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicLayout />}>

        <Route path="/" element={<LandingPage />} />

      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
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

            <Route
              path="/dashboard"
              element={<DashboardRouter />}
            />

            <Route
              path="/dashboard/students"
              element={<Students />}
            />

            <Route
              path="/dashboard/teachers"
              element={<Teacher/>}
            />

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
              element={<Fees />}
            />

            <Route
              path="/dashboard/exams"
              element={<Exam />}
            />

            <Route
              path="/dashboard/announcements"
              element={<Announcements />}
            />

            <Route
              path="/dashboard/settings"
              element={<Settings />}
            />

          </Route>
        </Route>

      </Route>

    </Routes>
  );
}

export default AppRoutes;
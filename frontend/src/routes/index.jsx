import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./roleGuard";
function AppRoutes() {
  return (
    <Routes>
    <Route element={<MainLayout/>}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    <Route element={<ProtectedRoute />}>
     <Route element={<ProtectedRoute />}>

  <Route element={
    <RoleGuard 
      allowedRoles={[
        "super_admin",
        "admin",
        "teacher",
        "students"
      ]} 
    />
  }>

    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>

  </Route>

</Route>
    </Route>
    </Routes>
  );
}

export default AppRoutes;
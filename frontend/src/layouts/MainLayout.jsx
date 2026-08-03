import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default MainLayout;
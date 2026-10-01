/**
 * @file PublicLayout.jsx
 * @description Provides the public-site layout surrounding guest routes.
 *
 * Responsibilities:
 * - Render the public navigation and footer.
 * - Display the active public route through an outlet.
 */
import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default PublicLayout;
import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FaGraduationCap, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="logo">
          <FaGraduationCap className="logo-icon" />
          <Link to="/" onClick={closeMenu}>
            EduLMS
          </Link>
        </div>

        {/* Hamburger */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation */}
        <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-links">

            <li>
              <HashLink smooth to="/#features" onClick={closeMenu}>
                Features
              </HashLink>
            </li>

            <li>
              <HashLink smooth to="/#how-it-works" onClick={closeMenu}>
                How It Works
              </HashLink>
            </li>

            <li>
              <HashLink smooth to="/#why-us" onClick={closeMenu}>
                Why Choose Us
              </HashLink>
            </li>

          </ul>

          <div className="nav-actions">

            <Link to="/login" onClick={closeMenu}>
              <button className="login-btn">
                Login
              </button>
            </Link>

            <Link to="/signup" onClick={closeMenu}>
              <button className="primary-btn">
                Get Started
              </button>
            </Link>

          </div>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;
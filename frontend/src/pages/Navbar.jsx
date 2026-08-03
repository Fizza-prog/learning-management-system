import { Link } from "react-router-dom";
import {HashLink} from "react-router-hash-link"
import "./Navbar.css";
import { FaGraduationCap } from "react-icons/fa";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="logo">
          <FaGraduationCap className="logo-icon" />
          <Link to="/">
            EduLMS
          </Link>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <HashLink to="/#features">
                Features
              </HashLink>
            </li>

            <li>
              <HashLink to="/#how-it-works">
                How It Works
              </HashLink>
            </li>

            <li>
              <HashLink to="/#why-us">
                Why Choose Us
              </HashLink>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="primary-btn">
              Get Started
            </button>
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
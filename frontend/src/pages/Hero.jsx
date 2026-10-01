/**
 * @file Hero.jsx
 * @description Renders the main headline and visual on the public homepage.
 *
 * Responsibilities:
 * - Introduce the school-management platform.
 * - Display the dashboard image and key highlights.
 */
import "./Hero.css";
import lmsImage from "../assets/image.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-content">

          <span className="hero-badge">
            Modern Multi-Tenant School LMS
          </span>

          <h1>
            Simplify School Management with One Powerful Platform
          </h1>

          <p>
            Manage students, attendance, fees, grades, timetables, and
            communication from a single, secure, and scalable platform built
            for modern educational institutions.
          </p>
</div>

        <div className="hero-image">
          <img
            src={lmsImage}
            alt="School Management Dashboard"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;
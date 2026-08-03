import "./Hero.css"
import lmsImage from "../assets/image.png";
import { Link } from "react-router-dom";

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

          <div className="hero-buttons">
            <Link to="/signup">
              <button className="primary-btn">Get Started</button>
            </Link>
            <button className="secondary-btn">Book a Demo</button>
          </div>
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
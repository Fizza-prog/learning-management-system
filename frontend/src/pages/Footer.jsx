import "./Footer.css";
import { FaGraduationCap } from "react-icons/fa";

const footerLinks = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#features" },
  { name: "Why Choose Us", href: "#why-us" },
  { name: "How It Works", href: "#how-it-works" },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <div className="footer-logo">
            <FaGraduationCap className="footer-logo-icon" />
            <h3>EduLMS</h3>
          </div>

          <p>
            A scalable school management platform designed to simplify
            educational operations.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>

          <ul>
            {footerLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 EduLMS. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Work" },
  { to: "/contact", label: "Contact" },
];

function BrandLogo() {
  return (
    <span className="brand-symbol" aria-hidden="true">
      <svg
        className="brand-leaf brand-leaf-left"
        viewBox="0 0 24 36"
        fill="none"
      >
        <path
          d="M12 34C12 22 8 12 3 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M5 15C-1 10 1 4 1 4C8 5 11 9 5 15Z"
          fill="currentColor"
        />
        <path
          d="M10 24C4 20 6 14 6 14C13 15 16 19 10 24Z"
          fill="currentColor"
        />
        <path
          d="M8 8C9 3 15 1 15 1C16 7 13 10 8 8Z"
          fill="currentColor"
        />
      </svg>

      <span className="brand-mark">
        <span>K</span>
      </span>

      <svg
        className="brand-leaf brand-leaf-right"
        viewBox="0 0 28 24"
        fill="none"
      >
        <path
          d="M2 22C11 18 17 11 25 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M13 14C12 7 19 3 26 2C26 9 21 15 13 14Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    `navbar-link${isActive ? " active" : ""}`;

  return (
    <header className="navbar">
      <nav className="navbar-inner" aria-label="Main navigation">
        {/* Creative Brand Logo */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setOpen(false)}
          aria-label="Kush Parekh home"
        >
          <BrandLogo />

          <span className="brand-copy">
            <span className="logo-name">
              <span className="logo-first-name">Kush</span>{" "}
              <span className="logo-last-name">Parekh</span>
              <span className="logo-period">.</span>
            </span>

            
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav-wrap">
          <div className="navbar-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Contact Button */}
        <Link to="/contact" className="navbar-cta">
          <span>Let's talk</span>
          <span className="cta-icon" aria-hidden="true">
            ↗
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`navbar-toggle${open ? " is-open" : ""}`}
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`navbar-mobile${open ? " is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mobile-menu-heading">
          <span>EXPLORE</span>
          <span>MENU / 01</span>
        </div>

        <div className="mobile-menu-links">
          {links.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-link-number">
                0{index + 1}
              </span>

              <span>{link.label}</span>

              <span className="mobile-link-arrow" aria-hidden="true">
                ↗
              </span>
            </NavLink>
          ))}
        </div>

        <div className="mobile-menu-bottom">
          <span>HAVE A PROJECT IN MIND?</span>

          <Link to="/contact" onClick={() => setOpen(false)}>
            Let's create something meaningful <span>↗</span>
          </Link>

          <p>SEO · Performance Marketing · Digital Strategy</p>
        </div>
      </div>
    </header>
  );
}
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Work" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) => `navbar-link${isActive ? " active" : ""}`;

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          Kush<span className="gradient-text">Parekh</span>
        </NavLink>

        <div className="navbar-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
          
        </div>

        <button
          className="navbar-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? "open-top" : ""} />
          <span className={open ? "open-mid" : ""} />
          <span className={open ? "open-bottom" : ""} />
        </button>
      </nav>

      {open && (
        <div className="navbar-mobile">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              onClick={() => setOpen(false)}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setOpen(false)} className="navbar-cta">
            Let's talk
          </NavLink>
        </div>
      )}
    </header>
  );
}

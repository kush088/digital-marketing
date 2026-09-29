import React from "react";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-rule" />
      <div className="footer-grid">
        <div className="footer-brand">
          <p>Kush Parekh</p>
          <p>
            Digital Marketer focused on SEO, content, paid media, and strategies that help brands grow online.
          </p>
        </div>

        <div>
          <p className="footer-heading">Get in touch</p>
          <ul className="footer-list">
            <li>
              <a href="mailto:hello@kushparekh.com">kushparekh01@gmail.com</a>
            </li>
            <li>
              <a href="tel:+910000000000">+91 9016480817</a>
            </li>
            <li>Surat , Gujarat , India</li>
          </ul>
        </div>

        <div>
          <p className="footer-heading">Elsewhere</p>
          <ul className="footer-list">
            <li>
              <a href="https://www.linkedin.com/in/kush-parekh-78a322250/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
           
            <li>
              <a href="https://www.instagram.com/kush_0888/?hl=en" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© {year} Kush Parekh. All rights reserved.</div>
    </footer>
  );
}

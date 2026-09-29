import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProjectCard from "../components/ProjectCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Home.css";

const services = [
  {
    name: "SEO & Keyword Research",
    detail: "Keyword research, on-page SEO, technical SEO, and search visibility optimization..",
  },
  {
    name: "Social Media Marketing",
    detail: "Content planning, social media strategy, audience research, and engagement.",
  },
  {
    name: "Google Ads",
    detail: "Search campaign planning, keyword research, ad copy, and campaign structure.",
  },
  {
    name: "Email Marketing",
    detail: "Email campaigns, audience segmentation, newsletters, automated email sequences, and customer engagement.",
  },
];

const stats = [
  { value: "🔍 SEO", label: "Improve search visibility & organic growth" },
  { value: "📊 Analytics", label: "Understand traffic & user behavior" },
  { value: "📢 Google Ads", label: "Plan & optimize paid campaigns" },
];

export default function Home() {
  const { apiBase } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBase}/projects?featured=true&limit=3`)
      .then((res) => setProjects(res.data))
      .catch(() => setProjects([]));
  }, [apiBase]);

  return (
    <div>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid">
          <div>

            <h1 className="hero-headline">
             Turning digital marketing knowledge into practical growth strategies.
            </h1>
            <p className="hero-sub">
              Hi, I’m Kush, a Digital Marketer focused on SEO, content marketing, Google Ads, social media Management, and email marketing..
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-primary">
                See the work
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Let's Connect
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-heading">What can i do </h2>
          <div className="services-grid">
            {services.map((s) => (
              <div key={s.name} className="service-tile">
                <h3>{s.name}</h3>
                <p>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="work-header">
              <h2 className="section-heading">Recent work</h2>
              <Link to="/projects">View all</Link>
            </div>
            <div className="work-grid">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container cta-section">
          <h2 className="section-heading">Have a Digital Marketing Project in Mind?</h2>
          <p>
            Whether you need SEO, keyword research, content strategy, Google Ads, social media, or email marketing, let’s talk about your goals.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}

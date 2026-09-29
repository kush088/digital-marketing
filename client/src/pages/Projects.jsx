import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProjectCard from "../components/ProjectCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Projects.css";

export default function Projects() {
  const { apiBase } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`${apiBase}/projects`)
      .then((res) => setProjects(res.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [apiBase]);

  const categories = useMemo(() => {
    const set = new Set(projects.flatMap((p) => p.tags || []));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered =
    category === "All" ? projects : projects.filter((p) => p.tags?.includes(category));

  return (
    <div className="container projects-page">
      <p className="eyebrow">Work</p>
      <h1 className="projects-title">
        Research. Strategy. Digital Growth.
      </h1>

      <div className="filter-row">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`filter-pill${category === c ? " active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ marginTop: 64, color: "var(--muted)" }}>Loading projects…</p>
      ) : filtered.length === 0 ? (
        <div className="projects-empty">
          <p>Comming Soon.</p>
          <p>Check back soon, or try a different category.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

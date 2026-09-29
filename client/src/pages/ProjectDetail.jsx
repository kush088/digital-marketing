import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const { apiBase } = useAuth();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    axios
      .get(`${apiBase}/projects/${id}`)
      .then((res) => {
        setProject(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [apiBase, id]);

  if (status === "loading") {
    return <p style={{ padding: "96px 24px", textAlign: "center", color: "var(--muted)" }}>Loading…</p>;
  }

  if (status === "error" || !project) {
    return (
      <div className="detail-error">
        <h1>Project not found</h1>
        <p>It may have been moved or removed.</p>
        <Link to="/projects">← Back to all work</Link>
      </div>
    );
  }

  const { title, summary, description, image, tags = [], result, downloadUrl, client, timeline } = project;

  return (
    <div className="container detail-page">
      <Link to="/projects" className="detail-back">
        ← Back to all work
      </Link>

      <div className="detail-tags">
        {tags.map((t) => (
          <span key={t} className="badge">
            {t}
          </span>
        ))}
      </div>

      <h1 className="detail-title">{title}</h1>
      <p className="detail-summary">{summary}</p>

      {image && <img src={image} alt={title} className="detail-image" />}

      <div className="detail-meta">
        {client && (
          <div className="detail-meta-card">
            <p>Client</p>
            <p>{client}</p>
          </div>
        )}
        {timeline && (
          <div className="detail-meta-card">
            <p>Timeline</p>
            <p>{timeline}</p>
          </div>
        )}
        {result && (
          <div className="detail-meta-card">
            <p>Result</p>
            <p className="text-success">{result}</p>
          </div>
        )}
      </div>

      <p className="detail-description">{description}</p>

      {downloadUrl && (
        <a href={downloadUrl} download className="btn btn-primary">
          Download case study
        </a>
      )}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { _id, title, summary, image, tags = [], result, downloadUrl } = project;

  return (
    <article className="project-card">
      <Link to={`/projects/${_id}`} className="project-card-image">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div className="project-card-placeholder">{title?.charAt(0)}</div>
        )}
        {result && <span className="project-card-result">{result}</span>}
      </Link>

      <div className="project-card-body">
        <div className="project-card-tags">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="project-card-title">
          <Link to={`/projects/${_id}`}>{title}</Link>
        </h3>

        <p className="project-card-summary">{summary}</p>

        <div className="project-card-actions">
          <Link to={`/projects/${_id}`} className="project-card-view">
            View case study
          </Link>
          {downloadUrl && (
            <a href={downloadUrl} download className="project-card-download">
              Download
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

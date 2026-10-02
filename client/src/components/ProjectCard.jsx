import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./ProjectCard.css";

export default function ProjectCard({
  project,
  showDownload = true,
}) {
  const { apiBase } = useAuth();

  const {
    _id,
    title,
    description,
    category,
    images = [],
    techStack = [],
    featured,
    downloadFile,
  } = project;

  /*
   * Remove /api from apiBase
   *
   * Example:
   * http://localhost:5000/api
   * becomes:
   * http://localhost:5000
   */
  const backendBase = useMemo(() => {
    if (!apiBase) return "";

    return apiBase.replace(/\/api\/?$/, "");
  }, [apiBase]);

  /*
   * Build image URL
   */
  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${backendBase}${
      image.startsWith("/") ? image : `/${image}`
    }`;
  };

  const imageUrl = getImageUrl(images[0]);

  return (
    <article className="project-card">

      {/* =========================================
          PROJECT IMAGE
      ========================================= */}

      <Link
        to={`/projects/${_id}`}
        className="project-card-image"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Project"}
            loading="lazy"
            onError={(event) => {
              console.error(
                "Project image failed to load:",
                imageUrl
              );

              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="project-card-placeholder">
            {title?.charAt(0)?.toUpperCase() || "P"}
          </div>
        )}

        {/* CATEGORY */}
        {category && (
          <span className="project-card-category">
            {category}
          </span>
        )}

        {/* FEATURED */}
        {featured && (
          <span className="project-card-featured">
            ★ Featured
          </span>
        )}
      </Link>

      {/* =========================================
          CARD BODY
      ========================================= */}

      <div className="project-card-body">

        {/* TECH STACK */}
        {techStack.length > 0 && (
          <div className="project-card-tags">
            {techStack
              .slice(0, 4)
              .map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="badge"
                >
                  {skill}
                </span>
              ))}
          </div>
        )}

        {/* TITLE */}
        <h3 className="project-card-title">
          <Link to={`/projects/${_id}`}>
            {title}
          </Link>
        </h3>

        {/* DESCRIPTION */}
        <p className="project-card-summary">
          {description}
        </p>

        {/* =========================================
            ACTIONS
        ========================================= */}

        <div className="project-card-actions">

          {/* VIEW CASE STUDY */}
          <Link
            to={`/projects/${_id}`}
            className="project-card-view"
          >
            View Case Study
            <span>→</span>
          </Link>

          {/* DOWNLOAD
              Hidden when showDownload={false}
          */}
          {showDownload && downloadFile && (
            <a
              href={`${apiBase}/projects/${_id}/download`}
              className="project-card-download"
              download
            >
              <span>↓</span>
              Download
            </a>
          )}

        </div>
      </div>
    </article>
  );
}
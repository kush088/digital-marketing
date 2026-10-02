import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const { apiBase } = useAuth();

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");

  const backendBase = useMemo(() => {
    if (!apiBase) return "";

    return apiBase.replace(/\/api\/?$/, "");
  }, [apiBase]);

  const getFileUrl = (file) => {
    if (!file) return "";

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    return `${backendBase}${
      file.startsWith("/") ? file : `/${file}`
    }`;
  };

  useEffect(() => {
    const loadProject = async () => {
      try {
        setStatus("loading");

        const response = await axios.get(
          `${apiBase}/projects/${id}`
        );

        setProject(response.data);
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load project:", error);
        setStatus("error");
      }
    };

    if (apiBase && id) {
      loadProject();
    }
  }, [apiBase, id]);

  if (status === "loading") {
    return (
      <div className="detail-loading">
        <div className="detail-spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (status === "error" || !project) {
    return (
      <div className="detail-error">
        <div className="detail-error-icon">!</div>

        <h1>Project not found</h1>

        <p>
          This project may have been moved or removed.
        </p>

        <Link
          to="/projects"
          className="detail-back-button"
        >
          ← Back to all work
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    techStack = [],
    images = [],
    featured,
    downloadFile,
    downloadFileName,
    githubLink,
    liveLink,
  } = project;

  const downloadUrl = downloadFile
    ? `${apiBase}/projects/${id}/download`
    : "";

  return (
    <main className="detail-page">

      {/* =========================================
          BACK
      ========================================= */}

      <div className="container">

        <Link
          to="/projects"
          className="detail-back"
        >
          ← Back to all work
        </Link>


        {/* =======================================
            HEADER
        ======================================= */}

        <header className="detail-header">

          <div className="detail-header-top">

            {category && (
              <span className="detail-category">
                {category}
              </span>
            )}

            {featured && (
              <span className="detail-featured">
                ★ Featured
              </span>
            )}

          </div>

          <h1 className="detail-title">
            {title}
          </h1>

          <p className="detail-summary">
            {description}
          </p>

        </header>


        {/* =======================================
            HERO IMAGE
        ======================================= */}

        {images.length > 0 && (
          <section className="detail-hero">

            <div className="detail-main-image">

              <img
                src={getFileUrl(images[0])}
                alt={title}
              />

            </div>

          </section>
        )}


        {/* =======================================
            CONTENT GRID
        ======================================= */}

        <div className="detail-content-grid">

          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <section className="detail-main-content">

            {/* PROJECT OVERVIEW */}

            <div className="detail-section">

              <p className="detail-eyebrow">
                PROJECT OVERVIEW
              </p>

              <h2>
                About this project
              </h2>

              <p className="detail-description">
                {description}
              </p>

            </div>


            {/* SKILLS */}

            {techStack.length > 0 && (
              <div className="detail-section">

                <p className="detail-eyebrow">
                  SKILLS & TOOLS
                </p>

                <h2>
                  Technologies & Skills
                </h2>

                <div className="detail-skills">

                  {techStack.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="detail-skill"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>
            )}


            {/* IMAGE GALLERY */}

            {images.length > 1 && (
              <div className="detail-section">

                <p className="detail-eyebrow">
                  PROJECT IMAGES
                </p>

                <h2>
                  Project Gallery
                </h2>

                <div className="detail-gallery">

                  {images.map((image, index) => (
                    <div
                      className="detail-gallery-item"
                      key={`${image}-${index}`}
                    >

                      <img
                        src={getFileUrl(image)}
                        alt={`${title} ${index + 1}`}
                      />

                    </div>
                  ))}

                </div>

              </div>
            )}

          </section>


          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="detail-sidebar">

            <div className="detail-sidebar-card">

              {/* PROJECT TYPE */}

              <p className="detail-sidebar-label">
                PROJECT TYPE
              </p>

              <p className="detail-sidebar-value">
                {category || "Digital Marketing"}
              </p>


              {/* SKILLS */}

              {techStack.length > 0 && (
                <>
                  <div className="detail-divider"></div>

                  <p className="detail-sidebar-label">
                    SKILLS
                  </p>

                  <div className="detail-sidebar-skills">

                    {techStack.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    ))}

                  </div>
                </>
              )}


              {/* =================================
                  RESOURCES
              ================================= */}

              {(githubLink ||
                liveLink ||
                downloadFile) && (
                <>
                  <div className="detail-divider"></div>

                  <p className="detail-sidebar-label">
                    RESOURCES
                  </p>

                  <div className="detail-sidebar-links">

                    {/* LIVE PROJECT */}

                    {liveLink && (
                      <a
                        href={liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="detail-action"
                      >
                        <span>
                          View Live Project
                        </span>

                        <span>
                          ↗
                        </span>
                      </a>
                    )}


                    {/* GITHUB */}

                    {githubLink && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="detail-action"
                      >
                        <span>
                          View Source
                        </span>

                        <span>
                          ↗
                        </span>
                      </a>
                    )}


                    {/* DOWNLOAD */}

                    {downloadFile && (
                      <a
                        href={downloadUrl}
                        className="detail-action detail-download"
                        download={downloadFileName || true}
                      >
                        <span>
                          Download Case Study
                        </span>

                        <span>
                          ↓
                        </span>
                      </a>
                    )}

                  </div>
                </>
              )}

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}
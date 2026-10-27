import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const { apiBase } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProject() {
      setLoading(true);
      setError("");
      setProject(null);

      try {
        const response = await axios.get(`${apiBase}/projects/${id}`);

        const data = response.data?.project ?? response.data;

        if (active) {
          setProject(data);
        }
      } catch (err) {
        console.error("Failed to load project:", err);

        if (active) {
          setError("This project could not be loaded.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (apiBase && id) {
      fetchProject();
    } else {
      setLoading(false);
      setError("Project information is unavailable.");
    }

    return () => {
      active = false;
    };
  }, [apiBase, id]);

  if (loading) {
    return (
      <main className="project-detail-page">
        <div className="project-detail-container">
          <div className="project-detail-status" role="status">
            <span className="project-detail-spinner" />
            <p>Loading project...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-detail-page">
        <div className="project-detail-container">
          <div className="project-detail-status">
            <h1>Project unavailable</h1>
            <p>{error || "This project could not be found."}</p>
            <Link to="/projects" className="project-detail-button">
              ← Back to Work
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const {
    title,
    description,
    category,
    images = [],
    techStack = [],
    projectType,
    videoUrl,
    videoSource,
    thumbnail,
    liveUrl,
    websiteUrl,
    projectUrl,
    githubUrl,
    downloadFile,
  } = project;

  const getMediaUrl = (value) => {
    if (!value || typeof value !== "string") return "";

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `${apiBase.replace(/\/api\/?$/, "")}/${value.replace(/^\/+/, "")}`;
  };

  const mainImage = getMediaUrl(images?.[0]);
  const galleryImages = Array.isArray(images)
    ? images.slice(1).map(getMediaUrl).filter(Boolean)
    : [];

  const mediaUrl = getMediaUrl(videoUrl);
  const thumbnailUrl = getMediaUrl(thumbnail);

  const isYouTube =
    videoSource === "external" &&
    /(?:youtube\.com|youtu\.be)/i.test(videoUrl || "");

  const isVimeo =
    videoSource === "external" &&
    /vimeo\.com/i.test(videoUrl || "");

  const getEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
      }

      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube-nocookie.com/embed/${videoId}`;
        }

        if (parsed.pathname.startsWith("/embed/")) {
          return `https://www.youtube-nocookie.com${parsed.pathname}`;
        }
      }

      if (parsed.hostname.includes("vimeo.com")) {
        const videoId = parsed.pathname.split("/").filter(Boolean).pop();

        if (videoId && /^\d+$/.test(videoId)) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }
    } catch {
      return "";
    }

    return "";
  };

  const embedUrl = getEmbedUrl(videoUrl);

  const links = [
    {
      label: "View Live Project",
      url: liveUrl || websiteUrl || projectUrl,
    },
    {
      label: "View Source Code",
      url: githubUrl,
    },
  ].filter((item) => item.url);

  return (
    <main className="project-detail-page">
      <div className="project-detail-container">
        {/* Navigation */}
        <nav className="project-detail-nav" aria-label="Breadcrumb">
          <Link to="/projects" className="project-detail-back">
            <span aria-hidden="true">←</span> Back to Work
          </Link>

          {category && (
            <span className="project-detail-category">{category}</span>
          )}
        </nav>

        {/* Project introduction */}
        <header className="project-detail-header">
          <span className="project-detail-eyebrow">
            PROJECT OVERVIEW
          </span>

          <h1 className="project-detail-title">
            {title || "Untitled Project"}
            <span>.</span>
          </h1>

          {description && (
            <p className="project-detail-description">{description}</p>
          )}

          {techStack.length > 0 && (
            <div className="project-detail-tech">
              {techStack.map((tech, index) => (
                <span key={`${tech}-${index}`} className="project-detail-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Main media */}
        {(projectType === "video" && mediaUrl) || mainImage ? (
          <section
            className="project-detail-media"
            aria-label="Project preview"
          >
            {projectType === "video" && mediaUrl ? (
              isYouTube || isVimeo ? (
                embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={`${title || "Project"} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-detail-media-fallback"
                  >
                    Watch project video ↗
                  </a>
                )
              ) : (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={thumbnailUrl || mainImage || undefined}
                >
                  <source src={mediaUrl} />
                  Your browser does not support video playback.
                </video>
              )
            ) : (
              <img
                src={mainImage}
                alt={title || "Project preview"}
                fetchPriority="high"
              />
            )}
          </section>
        ) : null}

        {/* Additional project images */}
        {galleryImages.length > 0 && (
          <section className="project-detail-gallery">
            <div className="project-detail-section-heading">
              <div>
                <span className="project-detail-eyebrow">
                  VISUALS
                </span>
                <h2>Project gallery</h2>
              </div>

              <span className="project-detail-gallery-count">
                {String(galleryImages.length).padStart(2, "0")} IMAGES
              </span>
            </div>

            <div className="project-detail-gallery-grid">
              {galleryImages.map((image, index) => (
                <figure
                  className="project-detail-gallery-item"
                  key={`${image}-${index}`}
                >
                  <img
                    src={image}
                    alt={`${title || "Project"} preview ${index + 2}`}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Project links */}
        {links.length > 0 && (
          <section className="project-detail-links">
            <div>
              <span className="project-detail-eyebrow">
                EXPLORE FURTHER
              </span>
              <h2>Project links</h2>
            </div>

            <div className="project-detail-link-list">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="project-detail-link"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}

              {downloadFile && (
                <a
                  href={getMediaUrl(downloadFile)}
                  target="_blank"
                  rel="noreferrer"
                  className="project-detail-link"
                >
                  <span>Download project file</span>
                  <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Footer navigation */}
        <footer className="project-detail-footer">
          <p>Interested in my work?</p>
          <Link to="/projects" className="project-detail-footer-link">
            Explore more projects <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
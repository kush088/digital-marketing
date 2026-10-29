import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./ProjectDetail.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const isValidExternalLink = (url) => {
  if (!url || typeof url !== "string") return false;

  try {
    const parsedUrl = new URL(url.trim());

    return (
      parsedUrl.protocol === "https:" ||
      parsedUrl.protocol === "http:"
    );
  } catch {
    return false;
  }
};

const ProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_BASE}/projects/${id}`
        );

        const projectData =
          response.data?.project ||
          response.data?.data ||
          response.data;

        if (!projectData || !projectData._id) {
          throw new Error("Project not found.");
        }

        if (isMounted) {
          setProject(projectData);
        }
      } catch (err) {
        console.error("Error fetching project:", err);

        if (isMounted) {
          setError(
            "Unable to load this project. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="project-detail-page">
        <div className="project-detail-status">
          Loading project...
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-detail-page">
        <div className="project-detail-status">
          <p>{error || "Project not found."}</p>

          <Link to="/projects" className="project-detail-back">
            ← Back to Work
          </Link>
        </div>
      </main>
    );
  }

  const {
    title,
    description,
    category,
    techStack = [],
    images = [],
    projectType = "image",
    videoSource,
    videoUrl,
    thumbnail,
    liveLink,
    githubLink,
    downloadFile,
  } = project;

  const validLiveLink = isValidExternalLink(liveLink)
    ? liveLink.trim()
    : "";

  const validGithubLink = isValidExternalLink(githubLink)
    ? githubLink.trim()
    : "";

  const validVideoLink = isValidExternalLink(videoUrl)
    ? videoUrl.trim()
    : "";

  const projectImages = Array.isArray(images)
    ? images
        .map((image) =>
          typeof image === "string" ? image : image?.url
        )
        .filter(Boolean)
    : [];

  const isVideoProject = projectType === "video";

  const videoIsExternal =
    videoSource === "external" && validVideoLink;

  const videoIsUploaded =
    videoSource === "upload" && validVideoLink;

  const mediaItems = projectImages;

  return (
    <main className="project-detail-page">
      <div className="project-detail-container">
        <div className="project-detail-top">
          <Link to="/projects" className="project-detail-back">
            <span aria-hidden="true">←</span>
            <span>Back to Work</span>
          </Link>

          {category && (
            <span className="project-detail-category">
              {category}
            </span>
          )}
        </div>

        <section className="project-detail-content">
          <div className="project-detail-overview">
            <span className="project-detail-eyebrow">
              PROJECT OVERVIEW
            </span>

            <h1 className="project-detail-title">
              {title}
            </h1>

            {description && (
              <p className="project-detail-description">
                {description}
              </p>
            )}

            {Array.isArray(techStack) && techStack.length > 0 && (
              <div className="project-detail-tech">
                {techStack.map((technology, index) => (
                  <span
                    className="project-detail-tech-item"
                    key={`${technology}-${index}`}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}

            {(validLiveLink || validGithubLink) && (
              <div className="project-detail-actions">
                {validLiveLink && (
                  <a
                    href={validLiveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail-live-button"
                  >
                    <span>Visit Live Project</span>
                    <span
                      className="project-detail-button-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </a>
                )}

                {validGithubLink && (
                  <a
                    href={validGithubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail-github-button"
                  >
                    <span>View Source Code</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="project-detail-media">
            {isVideoProject && videoIsExternal && (
              <div className="project-detail-video">
                <iframe
                  src={validVideoLink}
                  title={`${title} video`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {isVideoProject && videoIsUploaded && (
              <div className="project-detail-video">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={thumbnail || undefined}
                >
                  <source src={validVideoLink} />
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {!videoIsExternal &&
              !videoIsUploaded &&
              mediaItems.length > 0 && (
                <div className="project-detail-gallery">
                  {mediaItems.map((imageUrl, index) => (
                    <figure
                      className="project-detail-image"
                      key={`${imageUrl}-${index}`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${title} - Image ${index + 1}`}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </figure>
                  ))}
                </div>
              )}

            {!videoIsExternal &&
              !videoIsUploaded &&
              mediaItems.length === 0 &&
              thumbnail && (
                <figure className="project-detail-image">
                  <img
                    src={thumbnail}
                    alt={`${title} preview`}
                  />
                </figure>
              )}
          </div>

          {downloadFile && (
            <div className="project-detail-download">
              <a
                href={downloadFile}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail-download-button"
              >
                Download Project File ↗
              </a>
            </div>
          )}
        </section>

        <section className="project-detail-cta">
          <span className="project-detail-eyebrow">
            BUILT FOR GROWTH
          </span>

          <h2>Interested in my work?</h2>

          <p>
            Digital Marketer helping brands reach the right
            audience and grow online.
          </p>

          <Link
            to="/projects"
            className="project-detail-explore-button"
          >
            Explore More Projects
            <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </div>
    </main>
  );
};

export default ProjectDetail;
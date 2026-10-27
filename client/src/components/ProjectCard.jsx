import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./ProjectCard.css";

export default function ProjectCard({
  project,
  showDownload = true,
}) {
  const { apiBase } = useAuth();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    _id,
    title,
    description,
    category,
    images = [],
    techStack = [],
    featured,
    downloadFile,
    projectType = "image",
    videoSource = "upload",
    videoUrl,
    thumbnail,
  } = project;

  const backendBase = useMemo(() => {
    if (!apiBase) return "";
    return apiBase.replace(/\/api\/?$/, "");
  }, [apiBase]);

  const getFileUrl = (file) => {
    if (!file) return "";

    if (/^https?:\/\//i.test(file)) {
      return file;
    }

    return `${backendBase}${file.startsWith("/") ? file : `/${file}`}`;
  };

  const isVideo = projectType === "video";

  const imageFile = isVideo
    ? thumbnail || images[0]
    : images[0] || thumbnail;

  const imageUrl = getFileUrl(imageFile);

  // Only direct uploaded video files can play inside the card.
  const playableVideoUrl =
    isVideo && videoSource === "upload" && videoUrl
      ? getFileUrl(videoUrl)
      : "";

  const handleMouseEnter = async () => {
    if (!playableVideoUrl || !videoRef.current) return;

    try {
      videoRef.current.currentTime = 0;
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      // The user can still open the project to watch the video.
      console.debug("Hover video playback unavailable:", error);
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (!videoRef.current) return;

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <article className={`project-card ${isVideo ? "project-card-video" : ""}`}>
      {/* IMAGE AND VIDEO COVER */}
      <Link
        to={`/projects/${_id}`}
        className={`project-card-image ${isPlaying ? "is-playing" : ""}`}
        aria-label={`${isVideo ? "Watch" : "View"} ${title || "project"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {imageUrl && (
          <img
            className="project-card-cover"
            src={imageUrl}
            alt={title || "Project thumbnail"}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.opacity = "0";
            }}
          />
        )}

        {playableVideoUrl && (
          <video
            ref={videoRef}
            className="project-card-hover-video"
            src={playableVideoUrl}
            poster={imageUrl || undefined}
            muted
            playsInline
            loop
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}

        {!imageUrl && (
          <div className="project-card-placeholder">
            <span>{title?.charAt(0)?.toUpperCase() || "P"}</span>
          </div>
        )}

        {/* SUBTLE THEME OVERLAY */}
        <div className="project-card-image-overlay" />

        {/* CATEGORY AND FEATURED LABELS */}
        <div className="project-card-top">
          {category && (
            <span className="project-card-category">
              {category}
            </span>
          )}

          {featured && (
            <span className="project-card-featured">
              <span>★</span> Featured
            </span>
          )}
        </div>

        {/* VIDEO PLAY INDICATOR */}
        {isVideo && !isPlaying && (
          <div className="project-card-play" aria-hidden="true">
            <span>▶</span>
          </div>
        )}

        {isVideo && isPlaying && (
          <span className="project-card-playing-label">
            NOW PLAYING
          </span>
        )}

        {/* COVER FOOTER */}
        <div className="project-card-image-footer">
          <span className="project-card-image-type">
            {isVideo ? "VIDEO PROJECT" : "PROJECT CASE STUDY"}
          </span>

          <span className="project-card-image-arrow">↗</span>
        </div>
      </Link>

      {/* PROJECT INFORMATION */}
      <div className="project-card-body">
        {techStack.length > 0 && (
          <div className="project-card-tags">
            {techStack.slice(0, 3).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="project-card-tag"
              >
                {skill}
              </span>
            ))}

            {techStack.length > 3 && (
              <span className="project-card-tag project-card-tag-more">
                +{techStack.length - 3}
              </span>
            )}
          </div>
        )}

        <h3 className="project-card-title">
          <Link to={`/projects/${_id}`}>
            {title}
          </Link>
        </h3>

        <p className="project-card-summary">
          {description}
        </p>

        {/* ACTIONS */}
        <div className="project-card-actions">
          <Link
            to={`/projects/${_id}`}
            className="project-card-view"
          >
            <span>
              {isVideo ? "Watch Project" : "Explore Project"}
            </span>

            <span className="project-card-view-arrow">→</span>
          </Link>

          {showDownload && downloadFile && (
            <a
              href={`${apiBase}/projects/${_id}/download`}
              className="project-card-download"
              download
              aria-label="Download project case study"
              title="Download case study"
            >
              ↓
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import "./AdminDashboard.css";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  techStack: "",
  githubLink: "",
  liveLink: "",
  featured: false,
  order: 0,

  existingImages: [],
  removeImages: [],
  newImages: [],
  existingDownloadFile: "",
  existingDownloadFileName: "",
  newDownloadFile: null,
};

function ProjectModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initial,

    techStack: Array.isArray(initial?.techStack)
      ? initial.techStack.join(", ")
      : initial?.techStack || "",

    existingImages: initial?.images || [],
    removeImages: [],
    newImages: [],
    existingDownloadFile: initial?.downloadFile || "",
    existingDownloadFileName:
      initial?.downloadFileName || "",
    newDownloadFile: null,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 8) {
      alert("You can upload a maximum of 8 images.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      newImages: files,
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setForm((prev) => ({
        ...prev,
        newDownloadFile: null,
      }));
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("PDF must be smaller than 25MB.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      newDownloadFile: file,
    }));
  };

  const removeExistingImage = (image) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter(
        (item) => item !== image
      ),
      removeImages: [
        ...prev.removeImages,
        image,
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter project title.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter project description.");
      return;
    }

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "techStack",
        form.techStack || ""
      );

      formData.append(
        "githubLink",
        form.githubLink || ""
      );

      formData.append(
        "liveLink",
        form.liveLink || ""
      );

      formData.append(
        "featured",
        form.featured ? "true" : "false"
      );

      formData.append(
        "order",
        String(form.order || 0)
      );

      if (form.removeImages.length > 0) {
        formData.append(
          "removeImages",
          JSON.stringify(form.removeImages)
        );
      }

      form.newImages.forEach((file) => {
        formData.append("images", file);
      });

      if (form.newDownloadFile) {
        formData.append(
          "downloadFile",
          form.newDownloadFile
        );
      }

      await onSave(formData, form._id);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form
        className="modal-panel project-modal"
        onSubmit={handleSubmit}
      >
        {/* HEADER */}

        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">
              PROJECT MANAGER
            </p>

            <h2>
              {form._id
                ? "Edit Project"
                : "Add New Project"}
            </h2>

            <p className="modal-subtitle">
              {form._id
                ? "Update your project details and media."
                : "Create a new portfolio project."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* PROJECT INFORMATION */}

        <div className="form-section">
          <div className="section-heading">
            <span>01</span>

            <div>
              <h3>Project Information</h3>
              <p>
                Basic information about your project.
              </p>
            </div>
          </div>

          <div className="modal-grid">
            <label className="full">
              Project Title

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. SEO Growth Campaign"
                className="field"
                required
              />
            </label>

            <label>
              Category

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="field"
                required
              >
                <option value="">
                  Select category
                </option>

                <option value="SEO">
                  SEO
                </option>

                <option value="Google Ads">
                  Google Ads
                </option>

                <option value="Social Media Marketing">
                  Social Media Marketing
                </option>

                <option value="Content Marketing">
                  Content Marketing
                </option>

                <option value="Web Development">
                  Web Development
                </option>

                <option value="Graphic Design">
                  Graphic Design
                </option>

                <option value="Video Editing">
                  Video Editing
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </label>

            <label>
              Tech Stack

              <input
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                placeholder="SEO, GA4, GSC, Google Ads"
                className="field"
              />

              <small className="field-help">
                Separate items with commas.
              </small>
            </label>

            <label className="full">
              Project Description

              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project..."
                className="field"
                required
              />
            </label>
          </div>
        </div>

        {/* MEDIA */}

        <div className="form-section">
          <div className="section-heading">
            <span>02</span>

            <div>
              <h3>Project Media</h3>
              <p>
                Upload project images and your case study.
              </p>
            </div>
          </div>

          {/* EXISTING IMAGES */}

          {form.existingImages.length > 0 && (
            <div className="media-block">
              <div className="media-title">
                <h4>Existing Images</h4>

                <span>
                  {form.existingImages.length} image
                  {form.existingImages.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              <div className="image-grid">
                {form.existingImages.map(
                  (image, index) => (
                    <div
                      className="image-preview"
                      key={`${image}-${index}`}
                    >
                      <img
                        src={image}
                        alt={`Project ${index + 1}`}
                      />

                      <button
                        type="button"
                        className="remove-image"
                        onClick={() =>
                          removeExistingImage(image)
                        }
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="upload-grid">
            {/* IMAGE */}

            <label className="upload-box">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                multiple
                onChange={handleImageChange}
              />

              <div className="upload-icon">
                🖼
              </div>

              <strong>
                {form._id
                  ? "Add More Images"
                  : "Upload Images"}
              </strong>

              <span>
                JPG, PNG, WEBP or GIF
              </span>

              <small>
                Maximum 8 images
              </small>

              <div className="upload-button">
                Choose Images
              </div>
            </label>

            {/* PDF */}

            <label className="upload-box">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
              />

              <div className="upload-icon pdf-icon">
                PDF
              </div>

              <strong>
                {form._id
                  ? "Replace Case Study"
                  : "Upload Case Study"}
              </strong>

              <span>
                PDF document only
              </span>

              <small>
                Maximum 25MB
              </small>

              <div className="upload-button">
                Choose PDF
              </div>
            </label>
          </div>

          {/* NEW IMAGES */}

          {form.newImages.length > 0 && (
            <div className="media-block">
              <div className="media-title">
                <h4>New Images</h4>

                <span>
                  {form.newImages.length} selected
                </span>
              </div>

              <div className="image-grid">
                {form.newImages.map(
                  (file, index) => (
                    <div
                      className="image-preview"
                      key={`${file.name}-${index}`}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />

                      <div className="image-file-name">
                        {file.name}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* EXISTING PDF */}

          {form.existingDownloadFile && (
            <div className="file-preview">
              <div className="file-icon">
                PDF
              </div>

              <div className="file-info">
                <strong>
                  {form.existingDownloadFileName ||
                    "Current case study"}
                </strong>

                <span>
                  Current uploaded document
                </span>
              </div>

              <a
                href={form.existingDownloadFile}
                target="_blank"
                rel="noreferrer"
                className="view-file"
              >
                View
              </a>
            </div>
          )}

          {/* NEW PDF */}

          {form.newDownloadFile && (
            <div className="file-preview">
              <div className="file-icon">
                PDF
              </div>

              <div className="file-info">
                <strong>
                  {form.newDownloadFile.name}
                </strong>

                <span>
                  New PDF selected
                </span>
              </div>
            </div>
          )}
        </div>

        {/* LINKS */}

        <div className="form-section">
          <div className="section-heading">
            <span>03</span>

            <div>
              <h3>Project Links</h3>
              <p>
                Add external project links.
              </p>
            </div>
          </div>

          <div className="modal-grid">
            <label>
              GitHub URL

              <input
                type="url"
                name="githubLink"
                value={form.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="field"
              />
            </label>

            <label>
              Live Website URL

              <input
                type="url"
                name="liveLink"
                value={form.liveLink}
                onChange={handleChange}
                placeholder="https://example.com"
                className="field"
              />
            </label>

            <label>
              Display Order

              <input
                type="number"
                name="order"
                min="0"
                value={form.order}
                onChange={handleChange}
                className="field"
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <span>
                <strong>
                  Featured Project
                </strong>

                <small>
                  Show this project prominently.
                </small>
              </span>
            </label>
          </div>
        </div>

        {/* FOOTER */}

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : form._id
              ? "Update Project"
              : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const {
    apiBase,
    token,
    logout,
    admin,
  } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] =
    useState(null);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${apiBase}/projects`
      );

      setProjects(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [apiBase]);

  const handleSave = async (
    formData,
    projectId
  ) => {
    try {
      if (projectId) {
        await axios.put(
          `${apiBase}/projects/${projectId}`,
          formData,
          authHeaders
        );
      } else {
        await axios.post(
          `${apiBase}/projects`,
          formData,
          authHeaders
        );
      }

      setModalProject(null);

      await loadProjects();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to save project."
      );

      throw error;
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this project? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${apiBase}/projects/${id}`,
        authHeaders
      );

      await loadProjects();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  const openAddProject = () => {
    setModalProject({
      ...emptyForm,
    });
  };

  const openEditProject = (project) => {
    setModalProject({
      ...project,

      techStack: Array.isArray(project.techStack)
        ? project.techStack.join(", ")
        : project.techStack || "",

      existingImages:
        project.images || [],

      existingDownloadFile:
        project.downloadFile || "",

      existingDownloadFileName:
        project.downloadFileName || "",

      removeImages: [],
      newImages: [],
      newDownloadFile: null,
    });
  };

  return (
    <div className="admin-dashboard">

      {/* HEADER */}

      <header className="admin-header">
        <div className="admin-header-inner">

          <div className="admin-brand">
            <div className="admin-brand-icon">
              KP
            </div>

            <div>
              <span>ADMIN PANEL</span>
              <strong>
                Portfolio Manager
              </strong>
            </div>
          </div>

          <div className="admin-user">
            <div className="admin-user-info">
              <span>
                Welcome back
              </span>

              <strong>
                {admin?.name || "Admin"}
              </strong>
            </div>

            <button
              onClick={logout}
              className="btn btn-outline"
            >
              Log out
            </button>
          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="admin-main">

        <section className="admin-toolbar">
          <div>
            <p className="eyebrow">
              PORTFOLIO
            </p>

            <h1 className="admin-title">
              Projects
            </h1>

            <p className="admin-description">
              Manage your portfolio projects,
              case studies and media.
            </p>
          </div>

          <button
            onClick={openAddProject}
            className="btn btn-primary"
          >
            + Add Project
          </button>
        </section>

        {/* STATS */}

        <section className="project-stats">

          <div className="stat-card">
            <span>
              Total Projects
            </span>

            <strong>
              {projects.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Featured
            </span>

            <strong>
              {
                projects.filter(
                  (p) => p.featured
                ).length
              }
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Images
            </span>

            <strong>
              {projects.reduce(
                (total, p) =>
                  total +
                  (p.images?.length || 0),
                0
              )}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Case Studies
            </span>

            <strong>
              {
                projects.filter(
                  (p) => p.downloadFile
                ).length
              }
            </strong>
          </div>

        </section>

        {/* PROJECTS */}

        <section className="projects-section">

          <div className="projects-heading">
            <div>
              <h2>
                All Projects
              </h2>

              <p>
                Your portfolio project library
              </p>
            </div>

            <span className="project-count">
              {projects.length} projects
            </span>
          </div>

          {loading ? (
            <div className="empty-row">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-row">
              No projects yet — add your first
              project above.
            </div>
          ) : (
            <div className="admin-project-grid">

              {projects.map((project) => (
                <article
                  className="admin-project-card"
                  key={project._id}
                >

                  {/* IMAGE */}

                  <div className="project-card-image">

                    {project.images?.[0] ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                      />
                    ) : (
                      <div className="no-image">
                        No Image
                      </div>
                    )}

                    <span className="category-badge">
                      {project.category}
                    </span>

                    {project.featured && (
                      <span className="featured-badge">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="project-card-content">

                    <h3>
                      {project.title}
                    </h3>

                    <p>
                      {project.description?.length >
                      130
                        ? `${project.description.substring(
                            0,
                            130
                          )}...`
                        : project.description}
                    </p>

                    {/* TECH */}

                    {project.techStack?.length >
                      0 && (
                      <div className="project-tags">
                        {project.techStack
                          .slice(0, 4)
                          .map(
                            (tech, index) => (
                              <span
                                key={`${tech}-${index}`}
                              >
                                {tech}
                              </span>
                            )
                          )}
                      </div>
                    )}

                    {/* ASSETS */}

                    <div className="project-assets">

                      <span>
                        🖼{" "}
                        {project.images?.length ||
                          0}{" "}
                        Images
                      </span>

                      <span>
                        📄{" "}
                        {project.downloadFile
                          ? "PDF"
                          : "No PDF"}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="project-actions">

                      <button
                        className="edit-link"
                        onClick={() =>
                          openEditProject(
                            project
                          )
                        }
                      >
                        Edit
                      </button>

                      {project.downloadFile && (
                        <a
                          href={
                            project.downloadFile
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="view-link"
                        >
                          View PDF
                        </a>
                      )}

                      <button
                        className="delete-link"
                        onClick={() =>
                          handleDelete(
                            project._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}
        </section>
      </main>

      {/* MODAL */}

      {modalProject && (
        <ProjectModal
          initial={modalProject}
          onClose={() =>
            setModalProject(null)
          }
          onSave={handleSave}
        />
      )}
    </div>
  );
}
import { useCallback, useEffect, useState } from "react";
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
  projectType: "image",
  videoSource: "upload",
  videoUrl: "",
  existingThumbnail: "",
  newThumbnail: null,
  newVideo: null,
  existingImages: [],
  removeImages: [],
  newImages: [],
  existingDownloadFile: "",
  existingDownloadFileName: "",
  newDownloadFile: null,
};

const defaultSeoPages = [
  { slug: "home", pageName: "Home", title: "", description: "" },
  { slug: "about", pageName: "About", title: "", description: "" },
  { slug: "services", pageName: "Services", title: "", description: "" },
  { slug: "projects", pageName: "Projects", title: "", description: "" },
  { slug: "contact", pageName: "Contact", title: "", description: "" },
];

function ProjectModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initial,
    techStack: Array.isArray(initial?.techStack)
      ? initial.techStack.join(", ")
      : initial?.techStack || "",
    existingThumbnail: initial?.thumbnail || "",
    existingImages: initial?.images || [],
    existingDownloadFile: initial?.downloadFile || "",
    existingDownloadFileName: initial?.downloadFileName || "",
    projectType: initial?.projectType || "image",
    videoSource: initial?.videoSource || "upload",
    videoUrl: initial?.videoUrl || "",
    newThumbnail: null,
    newVideo: null,
    newImages: [],
    removeImages: [],
    newDownloadFile: null,
  }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initial?.thumbnail || ""
  );
  const [videoPreview, setVideoPreview] = useState("");

  useEffect(() => {
    if (!form.newThumbnail) {
      setThumbnailPreview(form.existingThumbnail || "");
      return;
    }

    const url = URL.createObjectURL(form.newThumbnail);
    setThumbnailPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [form.newThumbnail, form.existingThumbnail]);

  useEffect(() => {
    if (!form.newVideo) {
      setVideoPreview("");
      return;
    }

    const url = URL.createObjectURL(form.newVideo);
    setVideoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [form.newVideo]);

  const changeField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 8) {
      setError("You can select a maximum of 8 images at a time.");
      event.target.value = "";
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setError("Please select valid image files.");
      event.target.value = "";
      return;
    }

    if (files.some((file) => file.size > 25 * 1024 * 1024)) {
      setError("Each image must be smaller than 25 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setForm((previous) => ({ ...previous, newImages: files }));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid thumbnail image.");
      event.target.value = "";
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("The thumbnail must be smaller than 25 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setForm((previous) => ({ ...previous, newThumbnail: file }));
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".mp4", ".webm", ".mov", ".m4v"];
    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (
      !allowedExtensions.includes(extension) ||
      !file.type.startsWith("video/")
    ) {
      setError("Use a valid MP4, WEBM, MOV, or M4V video.");
      event.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("The video must be smaller than 100 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setForm((previous) => ({
      ...previous,
      newVideo: file,
      videoUrl: "",
    }));
  };

  const handlePdfChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("The PDF must be smaller than 25 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setForm((previous) => ({ ...previous, newDownloadFile: file }));
  };

  const removeExistingImage = (image) => {
    setForm((previous) => ({
      ...previous,
      existingImages: previous.existingImages.filter(
        (item) => item !== image
      ),
      removeImages: [...previous.removeImages, image],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a project title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a project description.");
      return;
    }

    if (!form.category) {
      setError("Please select a project category.");
      return;
    }

    if (
      form.projectType === "video" &&
      form.videoSource === "external" &&
      !/^https?:\/\//i.test(form.videoUrl.trim())
    ) {
      setError("Enter a valid external video URL starting with http:// or https://.");
      return;
    }

    if (
      form.projectType === "video" &&
      form.videoSource === "upload" &&
      !form.newVideo &&
      !initial?.video
    ) {
      setError("Please upload a video file.");
      return;
    }

    if (
      form.projectType === "video" &&
      form.videoSource === "external" &&
      !form.videoUrl.trim()
    ) {
      setError("Please enter an external video URL.");
      return;
    }

    const data = new FormData();

    const fields = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      techStack: form.techStack,
      githubLink: form.githubLink,
      liveLink: form.liveLink,
      featured: String(form.featured),
      order: String(Number(form.order) || 0),
      projectType: form.projectType,
      videoSource: form.videoSource,
      videoUrl: form.videoUrl.trim(),
    };

    Object.entries(fields).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (form.removeImages.length) {
      data.append("removeImages", JSON.stringify(form.removeImages));
    }

    form.newImages.forEach((file) => data.append("images", file));

    if (form.newThumbnail) {
      data.append("thumbnail", form.newThumbnail);
    }

    if (form.newVideo) {
      data.append("video", form.newVideo);
    }

    if (form.newDownloadFile) {
      data.append("downloadFile", form.newDownloadFile);
    }

    setSaving(true);

    try {
      await onSave(data, initial?._id);
    } catch (saveError) {
      setError(
        saveError.response?.data?.message || "Unable to save this project."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <form className="modal-panel" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">PROJECT MANAGER</p>
            <h2>{initial?._id ? "Edit Project" : "Add New Project"}</h2>
            <p>Manage project information, media and links.</p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="dashboard-alert error-alert" role="alert">
              {error}
            </div>
          )}

          <div className="modal-grid">
            <label className="form-field full">
              Project title *
              <input
                name="title"
                value={form.title}
                onChange={changeField}
                required
                maxLength={150}
                placeholder="e.g. SEO Growth Campaign"
              />
            </label>

            <label className="form-field">
              Category *
              <select
                name="category"
                value={form.category}
                onChange={changeField}
                required
              >
                <option value="">Select category</option>
                {[
                  "SEO",
                  "Google Ads",
                  "Social Media Marketing",
                  "Content Marketing",
                  "Web Development",
                  "Graphic Design",
                  "Video Editing",
                  "Other",
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              Technologies / tools
              <input
                name="techStack"
                value={form.techStack}
                onChange={changeField}
                placeholder="SEO, GA4, GSC, Google Ads"
              />
              <small>Separate items with commas.</small>
            </label>

            <label className="form-field full">
              Project description *
              <textarea
                name="description"
                value={form.description}
                onChange={changeField}
                rows={5}
                required
                placeholder="Describe your project..."
              />
            </label>

            <label className="form-field">
              GitHub URL
              <input
                name="githubLink"
                value={form.githubLink}
                onChange={changeField}
                type="url"
                placeholder="https://github.com/..."
              />
            </label>

            <label className="form-field">
              Live project URL
              <input
                name="liveLink"
                value={form.liveLink}
                onChange={changeField}
                type="url"
                placeholder="https://example.com"
              />
            </label>

            <label className="form-field">
              Project type
              <select
                name="projectType"
                value={form.projectType}
                onChange={(event) => {
                  const projectType = event.target.value;
                  setForm((previous) => ({
                    ...previous,
                    projectType,
                    newVideo: null,
                    videoUrl: projectType === "video" ? previous.videoUrl : "",
                  }));
                }}
              >
                <option value="image">Image / Case Study</option>
                <option value="video">Video Project</option>
              </select>
            </label>

            {form.projectType === "video" && (
              <>
                <label className="form-field">
                  Video source
                  <select
                    name="videoSource"
                    value={form.videoSource}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        videoSource: event.target.value,
                        newVideo: null,
                      }))
                    }
                  >
                    <option value="upload">Upload video</option>
                    <option value="external">External video URL</option>
                  </select>
                </label>

                {form.videoSource === "external" ? (
                  <label className="form-field full">
                    External video URL
                    <input
                      name="videoUrl"
                      type="url"
                      value={form.videoUrl}
                      onChange={changeField}
                      placeholder="https://..."
                    />
                  </label>
                ) : (
                  <label className="form-field full upload-field">
                    Upload video (MP4, WEBM, MOV, M4V; max 100 MB)
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,.m4v"
                      onChange={handleVideoChange}
                    />
                    {form.newVideo && <small>{form.newVideo.name}</small>}
                    {!form.newVideo && initial?.video && (
                      <small>Existing video will be retained if no new file is selected.</small>
                    )}
                  </label>
                )}

                {videoPreview && (
                  <div className="full">
                    <video
                      src={videoPreview}
                      controls
                      style={{ width: "100%", maxHeight: 260, borderRadius: 10 }}
                    />
                  </div>
                )}
              </>
            )}

            <label className="form-field full upload-field">
              Project thumbnail
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              <small>Optional. Maximum 25 MB.</small>
            </label>

            {thumbnailPreview && (
              <div className="full">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: 220,
                    borderRadius: 10,
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <label className="form-field full upload-field">
              Project images (maximum 8 per selection)
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <small>
                Select images to upload. Existing images are shown below.
              </small>
            </label>

            {form.existingImages.length > 0 && (
              <div className="full">
                <p className="eyebrow">EXISTING IMAGES</p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))",
                  gap: 12,
                }}>
                  {form.existingImages.map((image, index) => {
                    const src = typeof image === "string" ? image : image.url;
                    return (
                      <div key={`${src}-${index}`}>
                        <img
                          src={src}
                          alt={`Project ${index + 1}`}
                          style={{
                            width: "100%",
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ marginTop: 6, width: "100%" }}
                          onClick={() => removeExistingImage(image)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {form.newImages.length > 0 && (
              <div className="full">
                <small>
                  {form.newImages.length} new image(s) selected
                </small>
              </div>
            )}

            <label className="form-field full upload-field">
              Downloadable PDF (optional)
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handlePdfChange}
              />
              <small>
                Maximum 25 MB.
                {form.existingDownloadFile &&
                  ` Existing file: ${form.existingDownloadFileName || "PDF attached"}`}
              </small>
              {form.newDownloadFile && (
                <small>Selected: {form.newDownloadFile.name}</small>
              )}
            </label>

            <label className="form-field">
              Display order
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={changeField}
                min="0"
              />
              <small>Lower numbers appear first if your public page sorts by order.</small>
            </label>

            <label className="form-field checkbox-field">
              <input
                type="checkbox"
                name="featured"
                checked={Boolean(form.featured)}
                onChange={changeField}
              />
              <span>
                <strong>Featured project</strong>
                <small>Mark this project as featured.</small>
              </span>
            </label>
          </div>
        </div>

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
            {saving ? "Saving..." : initial?._id ? "Save Changes" : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const { apiBase, token, logout, admin } = useAuth();

  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [seoPages, setSeoPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoSaving, setSeoSaving] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [seoError, setSeoError] = useState("");
  const [seoMessage, setSeoMessage] = useState("");

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const loadProjects = useCallback(async () => {
    if (!apiBase) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${apiBase}/projects`, authHeaders);
      const data = response.data;

      setProjects(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.projects)
            ? data.projects
            : []
      );
    } catch (err) {
      console.error("Unable to load projects:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load projects. Check the backend projects endpoint."
      );
    } finally {
      setLoading(false);
    }
  }, [apiBase, token]);

  const loadContacts = useCallback(async () => {
    if (!apiBase || !token) return;

    setContactsLoading(true);

    try {
      const response = await axios.get(`${apiBase}/contact`, authHeaders);
      const data = response.data;

      setContacts(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.contacts)
            ? data.contacts
            : []
      );
    } catch (err) {
      console.error("Unable to load messages:", err);
      setError(
        err.response?.data?.message || "Unable to load contact messages."
      );
    } finally {
      setContactsLoading(false);
    }
  }, [apiBase, token]);

  const loadSEOSettings = useCallback(async () => {
    if (!apiBase || !token) return;

    setSeoLoading(true);
    setSeoError("");
    setSeoMessage("");

    try {
      const response = await axios.get(`${apiBase}/seo`, authHeaders);
      const savedPages = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.pages)
          ? response.data.pages
          : [];

      const mergedPages = defaultSeoPages.map((page) => {
        const saved = savedPages.find((item) => item.slug === page.slug);
        return saved ? { ...page, ...saved } : page;
      });

      const additionalPages = savedPages.filter(
        (saved) => !defaultSeoPages.some((page) => page.slug === saved.slug)
      );

      setSeoPages([...mergedPages, ...additionalPages]);
    } catch (err) {
      console.error("Unable to load SEO settings:", err);
      setSeoError(
        err.response?.data?.message ||
          "Unable to load SEO settings. Check that the backend SEO route exists."
      );
      setSeoPages(defaultSeoPages);
    } finally {
      setSeoLoading(false);
    }
  }, [apiBase, token]);

  useEffect(() => {
    if (activeTab === "projects") loadProjects();
    if (activeTab === "messages") loadContacts();
    if (activeTab === "seo") loadSEOSettings();
  }, [activeTab, loadProjects, loadContacts, loadSEOSettings]);

  const openAddProject = () => {
    setEditingProject(null);
    setProjectModalOpen(true);
    setError("");
    setSuccess("");
  };

  const openEditProject = (project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
    setError("");
    setSuccess("");
  };

  const saveProject = async (formData, id) => {
    if (!apiBase || !token) {
      throw new Error("You must be logged in to manage projects.");
    }

    const url = id
      ? `${apiBase}/projects/${encodeURIComponent(id)}`
      : `${apiBase}/projects`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (id) {
      await axios.put(url, formData, config);
    } else {
      await axios.post(url, formData, config);
    }

    setProjectModalOpen(false);
    setEditingProject(null);
    setSuccess(id ? "Project updated successfully." : "Project added successfully.");
    await loadProjects();
  };

  const deleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await axios.delete(
        `${apiBase}/projects/${encodeURIComponent(project._id)}`,
        authHeaders
      );
      setSuccess("Project deleted successfully.");
      await loadProjects();
    } catch (err) {
      console.error("Unable to delete project:", err);
      setError(
        err.response?.data?.message || "Unable to delete this project."
      );
    }
  };

  const updateSEOField = (slug, field, value) => {
    setSeoPages((current) =>
      current.map((page) =>
        page.slug === slug ? { ...page, [field]: value } : page
      )
    );
  };

  const saveSEOSettings = async (page) => {
    if (!page.title?.trim()) {
      setSeoError(`Please enter a title for the ${page.pageName} page.`);
      return;
    }

    setSeoSaving(page.slug);
    setSeoError("");
    setSeoMessage("");

    try {
      await axios.put(
        `${apiBase}/seo/${encodeURIComponent(page.slug)}`,
        {
          pageName: page.pageName,
          title: page.title.trim(),
          description: (page.description || "").trim(),
        },
        authHeaders
      );

      setSeoMessage(`${page.pageName} SEO settings saved successfully.`);
    } catch (err) {
      console.error("Unable to save SEO settings:", err);
      setSeoError(
        err.response?.data?.message ||
          `Unable to save ${page.pageName} SEO settings.`
      );
    } finally {
      setSeoSaving("");
    }
  };

  const getCoverImage = (project) => {
    if (project.thumbnail) return project.thumbnail;

    if (Array.isArray(project.images) && project.images.length) {
      const first = project.images[0];
      return typeof first === "string" ? first : first?.url || "";
    }

    return "";
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-brand-icon">KP</div>
            <div>
              <span>PORTFOLIO MANAGEMENT</span>
              <strong>Admin Dashboard</strong>
            </div>
          </div>

          <div className="admin-user">
            <div className="admin-user-info">
              <span>Logged in as</span>
              <strong>{admin?.email || "Administrator"}</strong>
            </div>
            <button type="button" className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-toolbar">
          <div>
            <p className="eyebrow">ADMIN PANEL</p>
            <h1 className="admin-title">Dashboard</h1>
            <p className="admin-description">
              Manage your portfolio projects, messages and SEO settings.
            </p>
          </div>

          {activeTab === "projects" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={openAddProject}
            >
              + Add Project
            </button>
          )}
        </section>

        <nav className="admin-tabs" aria-label="Admin sections">
          <button
            type="button"
            className={`admin-tab ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            Projects <span className="tab-count">{projects.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages <span className="tab-count">{contacts.length}</span>
          </button>

          <button
            type="button"
            className={`admin-tab ${activeTab === "seo" ? "active" : ""}`}
            onClick={() => setActiveTab("seo")}
          >
            SEO Settings
          </button>
        </nav>

        {error && (
          <div className="dashboard-alert error-alert" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="dashboard-alert success-alert" role="status">
            {success}
          </div>
        )}

        {activeTab === "projects" && (
          <>
            <div className="project-stats">
              <article className="stat-card">
                <span>Total projects</span>
                <strong>{projects.length}</strong>
              </article>
              <article className="stat-card">
                <span>Featured projects</span>
                <strong>{projects.filter((project) => project.featured).length}</strong>
              </article>
              <article className="stat-card">
                <span>Video projects</span>
                <strong>{projects.filter((project) => project.projectType === "video").length}</strong>
              </article>
              <article className="stat-card">
                <span>Projects with PDF</span>
                <strong>{projects.filter((project) => project.downloadFile).length}</strong>
              </article>
            </div>

            <section className="projects-section">
              <div className="projects-heading">
                <div>
                  <h2>Projects</h2>
                  <p>Manage the projects displayed in your portfolio.</p>
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={loadProjects}
                  disabled={loading}
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {loading ? (
                <div className="empty-row">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="empty-row empty-projects">
                  <div className="empty-icon">+</div>
                  <h3>No projects yet</h3>
                  <p>Add your first portfolio project to get started.</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openAddProject}
                  >
                    Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="admin-project-grid">
                  {projects.map((project) => {
                    const coverImage = getCoverImage(project);
                    const techStack = Array.isArray(project.techStack)
                      ? project.techStack
                      : String(project.techStack || "")
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean);

                    return (
                      <article className="admin-project-card" key={project._id}>
                        <div className="project-card-image">
                          {coverImage ? (
                            <img src={coverImage} alt={project.title || "Project"} />
                          ) : (
                            <div className="no-image">
                              {project.projectType === "video"
                                ? "Video Project"
                                : "No Image"}
                            </div>
                          )}

                          <span className="category-badge">
                            {project.category || "Uncategorized"}
                          </span>

                          {project.featured && (
                            <span className="featured-badge">★ Featured</span>
                          )}
                        </div>

                        <div className="project-card-content">
                          <div className="project-card-meta">
                            <span>
                              {project.projectType === "video" ? "Video" : "Image / Case Study"}
                            </span>
                            <span>Order: {project.order ?? 0}</span>
                          </div>

                          <h3>{project.title}</h3>

                          <p className="project-description">
                            {project.description || "No description provided."}
                          </p>

                          {techStack.length > 0 && (
                            <div className="project-tags">
                              {techStack.slice(0, 4).map((tech, index) => (
                                <span key={`${tech}-${index}`}>{tech}</span>
                              ))}
                            </div>
                          )}

                          <div className="project-card-meta">
                            <span>{project.images?.length || 0} images</span>
                            <span>{project.downloadFile ? "PDF attached" : "No PDF"}</span>
                          </div>

                          <div className="project-actions">
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => openEditProject(project)}
                            >
                              Edit Project
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => deleteProject(project)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "messages" && (
          <section className="projects-section">
            <div className="projects-heading">
              <div>
                <h2>Messages</h2>
                <p>Messages submitted through your website contact form.</p>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={loadContacts}
                disabled={contactsLoading}
              >
                {contactsLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {contactsLoading ? (
              <div className="empty-row">Loading messages...</div>
            ) : contacts.length === 0 ? (
              <div className="empty-row">No contact messages found.</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact, index) => (
                      <tr key={contact._id || index}>
                        <td>{contact.name || "—"}</td>
                        <td>{contact.email || "—"}</td>
                        <td>{contact.message || "—"}</td>
                        <td>
                          {contact.createdAt
                            ? new Date(contact.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "seo" && (
          <section className="projects-section">
            <div className="projects-heading">
              <div>
                <h2>SEO Settings</h2>
                <p>Manage page titles and meta descriptions.</p>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={loadSEOSettings}
                disabled={seoLoading}
              >
                {seoLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {seoMessage && (
              <div className="dashboard-alert success-alert" role="status">
                {seoMessage}
              </div>
            )}

            {seoError && (
              <div className="dashboard-alert error-alert" role="alert">
                {seoError}
              </div>
            )}

            {seoLoading ? (
              <div className="empty-row">Loading SEO settings...</div>
            ) : (
              <div className="seo-settings-list">
                {seoPages.map((page) => (
                  <article className="seo-setting-card" key={page.slug}>
                    <p className="eyebrow">PAGE: {page.slug.toUpperCase()}</p>
                    <h3>{page.pageName}</h3>

                    <label className="form-field">
                      Page title
                      <input
                        value={page.title || ""}
                        maxLength={70}
                        placeholder={`${page.pageName} | Your Brand`}
                        onChange={(event) =>
                          updateSEOField(page.slug, "title", event.target.value)
                        }
                      />
                      <small>{(page.title || "").length}/70 characters</small>
                    </label>

                    <label className="form-field" style={{ marginTop: 18 }}>
                      Meta description
                      <textarea
                        rows={4}
                        maxLength={320}
                        value={page.description || ""}
                        placeholder={`Write a search description for the ${page.pageName} page.`}
                        onChange={(event) =>
                          updateSEOField(
                            page.slug,
                            "description",
                            event.target.value
                          )
                        }
                      />
                      <small>
                        {(page.description || "").length}/320 characters
                      </small>
                    </label>

                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={seoSaving === page.slug}
                      onClick={() => saveSEOSettings(page)}
                    >
                      {seoSaving === page.slug ? "Saving..." : "Save SEO Settings"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {projectModalOpen && (
        <ProjectModal
          initial={editingProject}
          onClose={() => {
            setProjectModalOpen(false);
            setEditingProject(null);
          }}
          onSave={saveProject}
        />
      )}
    </div>
  );
}
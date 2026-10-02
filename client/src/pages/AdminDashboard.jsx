
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import "./AdminDashboard.css";

const emptyForm = {
  title: "",
  summary: "",
  description: "",
  category: "",
  image: "",
  tags: "",
  result: "",
  client: "",
  timeline: "",
  downloadUrl: "",
  featured: false,
};

function ProjectModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        ...form,
        tags:
          typeof form.tags === "string"
            ? form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : form.tags || [],
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-panel">
        <div className="modal-header">
          <h2>{form._id ? "Edit project" : "New project"}</h2>

          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-grid">
          <label className="full">
            Title
            <input
              name="title"
              required
              value={form.title || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label className="full">
            Summary (shown on cards)
            <input
              name="summary"
              required
              value={form.summary || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label className="full">
            Full description
            <textarea
              name="description"
              rows={4}
              value={form.description || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label>
            Category
            <select
              name="category"
              required
              value={form.category || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            >
              <option value="">Select category</option>
              <option value="Web Development">Web Development</option>
              <option value="SEO">SEO</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Social Media Marketing">
                Social Media Marketing
              </option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Video Editing">Video Editing</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Image URL
            <input
              name="image"
              value={form.image || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label>
            Download URL (PDF/case study)
            <input
              name="downloadUrl"
              value={form.downloadUrl || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label>
            Tags (comma separated)
            <input
              name="tags"
              value={
                Array.isArray(form.tags)
                  ? form.tags.join(", ")
                  : form.tags || ""
              }
              onChange={handleChange}
              placeholder="SEO, Paid Media"
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label>
            Result (e.g. "+42% traffic")
            <input
              name="result"
              value={form.result || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label>
            Client
            <input
              name="client"
              value={form.client || ""}
              onChange={handleChange}
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label>
            Timeline
            <input
              name="timeline"
              value={form.timeline || ""}
              onChange={handleChange}
              placeholder="3 months"
              className="field"
              style={{ marginTop: 8 }}
            />
          </label>

          <label className="modal-checkbox">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured || false}
              onChange={handleChange}
            />
            Feature on homepage
          </label>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving…" : "Save project"}
        </button>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const { apiBase, token, logout, admin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState(null);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadProjects = () => {
    setLoading(true);

    axios
      .get(`${apiBase}/projects`)
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, [apiBase]);

  const handleSave = async (data) => {
    if (data._id) {
      await axios.put(
        `${apiBase}/projects/${data._id}`,
        data,
        authHeaders
      );
    } else {
      await axios.post(
        `${apiBase}/projects`,
        data,
        authHeaders
      );
    }

    setModalProject(null);
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This can't be undone.")) {
      return;
    }

    await axios.delete(
      `${apiBase}/projects/${id}`,
      authHeaders
    );

    loadProjects();
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <p className="eyebrow">Admin</p>

            <h1 className="admin-title">
              {admin?.name
                ? `Welcome, ${admin.name}`
                : "Dashboard"}
            </h1>
          </div>

          <button onClick={logout} className="btn btn-outline">
            Log out
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-toolbar">
          <h2>
            Projects <span>({projects.length})</span>
          </h2>

          <button
            onClick={() => setModalProject({ ...emptyForm })}
            className="btn btn-primary"
          >
            + Add project
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Featured</th>
                <th style={{ textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="empty-row">
                    Loading…
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-row">
                    No projects yet — add your first one above.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>

                    <td>
                      {p.category || "—"}
                    </td>

                    <td>
                      {Array.isArray(p.tags)
                        ? p.tags.join(", ")
                        : p.tags || "—"}
                    </td>

                    <td>
                      {p.featured ? (
                        <span className="text-success">
                          Yes
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "var(--muted)",
                          }}
                        >
                          No
                        </span>
                      )}
                    </td>

                    <td className="actions">
                      <button
                        onClick={() =>
                          setModalProject({
                            ...p,
                            tags: Array.isArray(p.tags)
                              ? p.tags.join(", ")
                              : p.tags || "",
                          })
                        }
                        className="edit-link"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(p._id)
                        }
                        className="delete-link"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {modalProject && (
        <ProjectModal
          initial={modalProject}
          onClose={() => setModalProject(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}


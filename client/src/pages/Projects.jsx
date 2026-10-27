import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import "./Projects.css";

export default function Projects() {
  const { apiBase } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      if (!apiBase) {
        setProjects([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${apiBase}/projects`);

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.projects)
            ? response.data.projects
            : [];

        if (!cancelled) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);

        if (!cancelled) {
          setProjects([]);
          setError("We couldn't load the projects. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [apiBase, retry]);

  const categories = useMemo(() => {
    const categoryMap = new Map();

    projects.forEach((project) => {
      const rawCategory =
        typeof project.category === "string"
          ? project.category.trim()
          : "";

      if (!rawCategory) return;

      const name =
        rawCategory.toLowerCase() === "seo"
          ? "SEO"
          : rawCategory;

      const key = name.toLowerCase();

      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          name,
          count: 0,
        });
      }

      categoryMap.get(key).count += 1;
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [projects]);

  const selectedProjects = useMemo(() => {
    if (!selectedCategory) return [];

    return projects.filter((project) => {
      const category =
        typeof project.category === "string"
          ? project.category.trim()
          : "";

      return category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [projects, selectedCategory]);

  const totalProjects = projects.length;

  return (
    <main className="projects-page">
      {/* Hero */}
      <section className="projects-hero">
        <div className="projects-container">
          <div className="projects-hero-layout">
            <div className="projects-hero-content">
              <div className="projects-eyebrow">
                <span className="projects-eyebrow-dot" />
                MY PORTFOLIO
              </div>

              <h1 className="projects-hero-title">
                Selected
                <br />
                <span>Work.</span>
              </h1>

              <p className="projects-hero-description">
                A collection of digital marketing projects, strategies,
                and creative work focused on building stronger brands
                and achieving meaningful results.
              </p>

              <a href="#projects-content" className="projects-hero-link">
                Explore my work
                <span aria-hidden="true">↘</span>
              </a>
            </div>

            <div className="projects-hero-visual" aria-hidden="true">
              <div className="projects-visual-orbit projects-orbit-one" />
              <div className="projects-visual-orbit projects-orbit-two" />

              <div className="projects-visual-center">
                <span className="projects-visual-symbol">✳</span>
              </div>

              <span className="projects-visual-label projects-label-top">
                STRATEGY
              </span>

              <span className="projects-visual-label projects-label-right">
                CREATIVITY
              </span>

              <span className="projects-visual-label projects-label-bottom">
                PERFORMANCE
              </span>

              <span className="projects-visual-index">WORK / 01</span>
            </div>
          </div>

          <div className="projects-hero-footer">
            <span>SEO & DIGITAL MARKETING</span>
            <span className="projects-hero-footer-right">
              IDEAS INTO IMPACT <span>↗</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section
        className="projects-content-section"
        id="projects-content"
      >
        <div className="projects-container">
          {!selectedCategory ? (
            <>
              <div className="projects-section-header">
                <div>
                  <span className="projects-section-eyebrow">
                    DISCOVER MY WORK
                  </span>

                  <h2 className="projects-section-title">
                    Explore by <span>category.</span>
                  </h2>

                  <p className="projects-section-description">
                    Choose a category to explore the projects and
                    marketing work behind it.
                  </p>
                </div>

                {!loading && !error && (
                  <div className="projects-total">
                    <span className="projects-total-number">
                      {String(totalProjects).padStart(2, "0")}
                    </span>
                    <span className="projects-total-label">
                      {totalProjects === 1 ? "PROJECT" : "PROJECTS"}
                    </span>
                  </div>
                )}
              </div>

              {loading && (
                <div
                  className="projects-status"
                  role="status"
                  aria-live="polite"
                >
                  <span className="projects-spinner" />
                  <p>Loading my work...</p>
                </div>
              )}

              {!loading && error && (
                <div className="projects-status projects-status-error">
                  <span className="projects-status-symbol">!</span>
                  <h3>Unable to load projects</h3>
                  <p>{error}</p>

                  <button
                    type="button"
                    className="projects-button"
                    onClick={() => setRetry((value) => value + 1)}
                  >
                    Try again <span>↗</span>
                  </button>
                </div>
              )}

              {!loading && !error && categories.length === 0 && (
                <div className="projects-status">
                  <span className="projects-status-symbol">✳</span>
                  <h3>Work is coming soon.</h3>
                  <p>
                    Projects will appear here once they have been added
                    through the admin panel with a category.
                  </p>
                </div>
              )}

              {!loading && !error && categories.length > 0 && (
                <div className="projects-category-grid">
                  {categories.map((category, index) => (
                    <button
                      type="button"
                      key={category.name}
                      className="projects-category-card"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <div className="projects-category-top">
                        <span className="projects-category-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="projects-category-arrow">
                          ↗
                        </span>
                      </div>

                      <div className="projects-category-bottom">
                        <span className="projects-category-initial">
                          {category.name.charAt(0).toUpperCase()}
                        </span>

                        <div className="projects-category-info">
                          <h3>{category.name}</h3>
                          <p>
                            {String(category.count).padStart(2, "0")}{" "}
                            {category.count === 1 ? "project" : "projects"}
                          </p>
                        </div>
                      </div>

                      <span className="projects-category-accent" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="projects-back-row">
                <button
                  type="button"
                  className="projects-back-button"
                  onClick={() => setSelectedCategory(null)}
                >
                  <span>←</span> All categories
                </button>

                <span className="projects-collection-index">
                  PORTFOLIO / COLLECTION
                </span>
              </div>

              <div className="projects-collection-header">
                <div>
                  <span className="projects-section-eyebrow">
                    SELECTED CATEGORY
                  </span>

                  <h2 className="projects-collection-title">
                    {selectedCategory}
                    <span>.</span>
                  </h2>

                  <p className="projects-section-description">
                    Explore the projects in this collection.
                  </p>
                </div>

                <div className="projects-total">
                  <span className="projects-total-number">
                    {String(selectedProjects.length).padStart(2, "0")}
                  </span>

                  <span className="projects-total-label">
                    {selectedProjects.length === 1
                      ? "PROJECT"
                      : "PROJECTS"}
                  </span>
                </div>
              </div>

              {selectedProjects.length > 0 ? (
                <div className="projects-grid">
                  {selectedProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                    />
                  ))}
                </div>
              ) : (
                <div className="projects-status">
                  <span className="projects-status-symbol">✳</span>
                  <h3>No projects found.</h3>
                  <p>
                    There are currently no projects in this category.
                  </p>

                  <button
                    type="button"
                    className="projects-button"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Browse categories <span>↗</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import "./Projects.css";

export default function Projects() {
  const { apiBase } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axios.get(`${apiBase}/projects`);

        console.log("PROJECTS FROM API:", response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        console.log("FIRST PROJECT:", data[0]);
        console.log("FIRST PROJECT CATEGORY:", data[0]?.category);

        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (apiBase) {
      loadProjects();
    }
  }, [apiBase]);

  /* =========================================
     CREATE CATEGORY CARDS
  ========================================= */

  const categories = useMemo(() => {
    const categoryMap = {};

    projects.forEach((project) => {
      const category =
        typeof project.category === "string"
          ? project.category.trim()
          : "";

      console.log(
        "Project:",
        project.title,
        "Category:",
        category
      );

      if (!category) {
        return;
      }

      /*
       * Normalize category names.
       * Example:
       * seo
       * SEO
       * Seo
       *
       * will all become SEO.
       */
      const normalizedCategory =
        category.toLowerCase() === "seo"
          ? "SEO"
          : category;

      if (!categoryMap[normalizedCategory]) {
        categoryMap[normalizedCategory] = 0;
      }

      categoryMap[normalizedCategory]++;
    });

    return Object.entries(categoryMap).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
  }, [projects]);

  /* =========================================
     PROJECTS FOR SELECTED CATEGORY
  ========================================= */

  const selectedProjects = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return projects.filter((project) => {
      const category =
        typeof project.category === "string"
          ? project.category.trim()
          : "";

      if (
        selectedCategory === "SEO" &&
        category.toLowerCase() === "seo"
      ) {
        return true;
      }

      return category === selectedCategory;
    });
  }, [projects, selectedCategory]);

  return (
    <main className="projects-page">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="projects-hero">
        <div className="container">
          <div className="projects-hero-content">

            <span className="projects-eyebrow">
              WORK
            </span>

            <h1 className="projects-hero-title">
              Digital Marketing Projects
              <br />
              <span>&amp; Case Studies</span>
            </h1>

            <p className="projects-hero-description">
              Explore digital marketing and SEO projects by
              Kush Parekh, including SEO, keyword research,
              content strategy, Google Ads, and performance
              analysis case studies.
            </p>

          </div>
        </div>
      </section>


      {/* =========================================
          CONTENT
      ========================================= */}

      <section className="projects-section">
        <div className="container">

          {/* =========================================
              CATEGORY CARDS
          ========================================= */}

          {!selectedCategory && (
            <>
              <div className="projects-section-header">

                <div>
                  <span className="projects-section-label">
                    EXPLORE MY WORK
                  </span>

                  <h2>
                    Projects &amp; Case Studies
                  </h2>
                </div>

                <p className="projects-count">
                  {projects.length}{" "}
                  {projects.length === 1
                    ? "project"
                    : "projects"}
                </p>

              </div>


              {/* LOADING */}

              {loading && (
                <div className="projects-loading">
                  <div className="projects-loader"></div>
                  <p>Loading projects...</p>
                </div>
              )}


              {/* CATEGORY EMPTY */}

              {!loading && categories.length === 0 && (
                <div className="projects-empty">

                  <div className="projects-empty-icon">
                    +
                  </div>

                  <h3>
                    No project categories found
                  </h3>

                  <p>
                    The project was loaded, but no category
                    was returned by the API.
                  </p>

                </div>
              )}


              {/* CATEGORY CARDS */}

              {!loading && categories.length > 0 && (
                <div className="project-categories-grid">

                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category.name}
                      className="project-category-card"
                      onClick={() =>
                        setSelectedCategory(category.name)
                      }
                    >

                      <div className="project-category-card-icon">
                        {category.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="project-category-card-content">

                        <h3>
                          {category.name}
                        </h3>

                        <p>
                          {category.count}{" "}
                          {category.count === 1
                            ? "Project"
                            : "Projects"}
                        </p>

                      </div>

                      <span className="project-category-card-arrow">
                        →
                      </span>

                    </button>
                  ))}

                </div>
              )}
            </>
          )}


          {/* =========================================
              SELECTED CATEGORY
          ========================================= */}

          {selectedCategory && (
            <>

              <div className="selected-category-top">

                <button
                  type="button"
                  className="back-to-categories"
                  onClick={() =>
                    setSelectedCategory(null)
                  }
                >
                  ← Back to Categories
                </button>

              </div>


              <div className="selected-category-header">

                <div>

                  <span className="projects-section-label">
                    CATEGORY
                  </span>

                  <h2>
                    {selectedCategory}
                  </h2>

                  <p>
                    {selectedProjects.length}{" "}
                    {selectedProjects.length === 1
                      ? "project"
                      : "projects"}{" "}
                    in this category
                  </p>

                </div>

              </div>


              {selectedProjects.length > 0 && (
                <div className="projects-grid">

                  {selectedProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                    />
                  ))}

                </div>
              )}


              {selectedProjects.length === 0 && (
                <div className="projects-empty">

                  <div className="projects-empty-icon">
                    +
                  </div>

                  <h3>
                    No projects found
                  </h3>

                  <p>
                    There are currently no projects in
                    this category.
                  </p>

                </div>
              )}

            </>
          )}

        </div>
      </section>

    </main>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProjectCard from "../components/ProjectCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Home.css";

const services = [
  {
    number: "01",
    name: "Search Engine Optimization",
    description:
      "Improve search visibility and help the right people discover your business.",
  },
  {
    number: "02",
    name: "Google Ads",
    description:
      "Reach potential customers with focused campaigns and ongoing optimization.",
  },
  {
    number: "03",
    name: "Social Media Marketing",
    description:
      "Build brand awareness and connect with your audience through relevant content.",
  },
  {
    number: "04",
    name: "Content Marketing",
    description:
      "Share useful content that communicates your value and supports your marketing goals.",
  },
];

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M7 7h10v10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarketingVisual() {
  return (
    <div className="home-visual">
      <div className="home-visual-top">
        <div>
          <span className="home-visual-overline">
            DIGITAL MARKETING
          </span>
          <h2>A clearer direction.</h2>
        </div>

        <span className="home-visual-index">01 / 03</span>
      </div>

      <div className="home-visual-main" aria-hidden="true">
        <div className="home-orbit home-orbit-outer" />
        <div className="home-orbit home-orbit-middle" />
        <div className="home-orbit home-orbit-inner" />

        <span className="home-orbit-point home-point-one" />
        <span className="home-orbit-point home-point-two" />
        <span className="home-orbit-point home-point-three" />

        <div className="home-visual-core">
          <span className="home-core-symbol">↗</span>
          <span>GROWTH</span>
          <small>WITH PURPOSE</small>
        </div>

        <article className="home-floating-note home-note-one">
          <div className="home-note-icon">⌕</div>

          <div className="home-note-content">
            <small>01 / VISIBILITY</small>
            <strong>Be easier to discover.</strong>
            <p>Build a stronger search presence.</p>
            <span className="home-note-tag">SEARCH ENGINE OPTIMIZATION</span>
          </div>
        </article>

        <article className="home-floating-note home-note-two">
          <div className="home-note-icon">↗</div>

          <div className="home-note-content">
            <small>02 / PERFORMANCE</small>
            <strong>Make every decision count.</strong>
            <p>Use insights to improve campaigns.</p>
            <span className="home-note-tag">STRATEGY MEETS ACTION</span>
          </div>
        </article>
      </div>

      <div className="home-visual-bottom">
        <span className="home-live-dot" />
        <span>RESEARCH</span>
        <span>·</span>
        <span>STRATEGY</span>
        <span>·</span>
        <span>OPTIMIZATION</span>
      </div>
    </div>
  );
}

/**
 * Loads SEO settings saved in the admin dashboard.
 */
function usePageSEO(apiBase, slug = "home") {
  useEffect(() => {
    if (!apiBase) return undefined;

    let cancelled = false;

    async function loadSEO() {
      try {
        const response = await axios.get(
          `${apiBase}/seo/public/${encodeURIComponent(slug)}`
        );

        if (cancelled) return;

        const page = response.data?.page;

        if (!page) return;

        if (typeof page.title === "string" && page.title.trim()) {
          document.title = page.title.trim();
        }

        let descriptionMeta = document.head.querySelector(
          'meta[name="description"]'
        );

        if (!descriptionMeta) {
          descriptionMeta = document.createElement("meta");
          descriptionMeta.setAttribute("name", "description");
          document.head.appendChild(descriptionMeta);
        }

        if (
          typeof page.description === "string" &&
          page.description.trim()
        ) {
          descriptionMeta.setAttribute(
            "content",
            page.description.trim()
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Unable to load homepage SEO settings:",
            error.response?.data?.message || error.message
          );
        }
      }
    }

    loadSEO();

    return () => {
      cancelled = true;
    };
  }, [apiBase, slug]);
}

export default function Home() {
  const { apiBase } = useAuth();
  const [projects, setProjects] = useState([]);

  usePageSEO(apiBase, "home");

  // Load featured projects from the backend.
  useEffect(() => {
    if (!apiBase) return undefined;

    let active = true;

    async function loadFeaturedProjects() {
      try {
        const response = await axios.get(
          `${apiBase}/projects?featured=true&limit=3`
        );

        if (!active) return;

        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.projects)
            ? response.data.projects
            : [];

        setProjects(data.slice(0, 3));
      } catch (error) {
        if (active) {
          console.error(
            "Failed to load featured projects:",
            error.response?.data?.message || error.message
          );

          setProjects([]);
        }
      }
    }

    loadFeaturedProjects();

    return () => {
      active = false;
    };
  }, [apiBase]);

  return (
    <main className="home-page">
      {/* HERO */}
      <section className="home-hero" id="top">
        <div className="home-hero-grid">
          <div className="home-hero-copy home-reveal">
            <div className="home-eyebrow">
              <span className="home-live-dot" />
              INDEPENDENT DIGITAL MARKETER
            </div>

            <h1 className="home-hero-title">
              Growing Brands
              <br />
              <span>in a Digital World.</span>
            </h1>

            <p className="home-hero-description">
              I'm Kush Parekh. I help businesses build a stronger
              online presence through SEO, digital advertising,
              and thoughtful marketing strategies.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/projects"
                className="home-button home-button-primary"
              >
                View my work
                <ArrowIcon />
              </Link>

              <Link
                to="/contact"
                className="home-button home-button-ghost"
              >
                Let's talk
                <ArrowIcon />
              </Link>
            </div>

            <div className="home-hero-footnote">
              <span className="home-footnote-line" />
              <span>Clear strategy. Meaningful growth.</span>
            </div>
          </div>

          <div className="home-hero-art home-reveal home-reveal-delay">
            <MarketingVisual />
          </div>
        </div>

        <div className="home-hero-index">
          <span>KUSH PAREKH / DIGITAL MARKETING</span>
          <span>01 — INTRODUCTION</span>
        </div>
      </section>

      {/* ABOUT / APPROACH */}
      <section className="home-section home-intro" id="approach">
        <div className="home-section-topline">
          <span>01 / ABOUT</span>
          <span>A PRACTICAL APPROACH TO MARKETING</span>
        </div>

        <div className="home-intro-grid">
          <div className="home-intro-heading">
            <span className="home-section-kicker">
              THE WAY I WORK
            </span>

            <h2>
              Marketing with
              <br />
              <span>purpose.</span>
            </h2>
          </div>

          <div className="home-intro-content">
            <p className="home-intro-lead">
              Good marketing starts with understanding people.
            </p>

            <p>
              I bring research, creative thinking, and performance
              insights together to help businesses make more informed
              digital marketing decisions.
            </p>

            <Link to="/about" className="home-inline-link">
              More about me
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <div className="home-principles">
          <article className="home-principle">
            <span className="home-principle-number">01</span>
            <div>
              <h3>Understand</h3>
              <p>Start with the audience and business goals.</p>
            </div>
            <span className="home-principle-arrow">↗</span>
          </article>

          <article className="home-principle">
            <span className="home-principle-number">02</span>
            <div>
              <h3>Strategize</h3>
              <p>Choose the right channels and priorities.</p>
            </div>
            <span className="home-principle-arrow">↗</span>
          </article>

          <article className="home-principle">
            <span className="home-principle-number">03</span>
            <div>
              <h3>Improve</h3>
              <p>Learn from results and refine the approach.</p>
            </div>
            <span className="home-principle-arrow">↗</span>
          </article>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {projects.length > 0 && (
        <section className="home-section home-work" id="work">
          <div className="home-section-topline">
            <span>02 / SELECTED WORK</span>
            <span>PROJECTS AND CASE STUDIES</span>
          </div>

          <div className="home-heading-row">
            <div>
              <span className="home-section-kicker">
                A FEW HIGHLIGHTS
              </span>

              <h2>
                Selected
                <br />
                <span>work.</span>
              </h2>
            </div>

            <Link to="/projects" className="home-inline-link">
              View all projects
              <ArrowIcon />
            </Link>
          </div>

          <div className="home-project-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                showDownload={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section className="home-section home-services" id="services">
        <div className="home-section-topline">
          <span>03 / SERVICES</span>
          <span>HOW I CAN HELP</span>
        </div>

        <div className="home-heading-row home-services-heading">
          <div>
            <span className="home-section-kicker">
              DIGITAL MARKETING
            </span>

            <h2>
              The right strategy.
              <br />
              <span>The right channels.</span>
            </h2>
          </div>

          <p>
            Practical services to improve online visibility,
            reach relevant audiences, and support business goals.
          </p>
        </div>

        <div className="home-service-list">
          {services.map((service) => (
            <article className="home-service" key={service.number}>
              <span className="home-service-number">
                {service.number}
              </span>

              <div className="home-service-copy">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>

              <span className="home-service-icon" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="home-contact" id="contact-cta">
        <div className="home-contact-inner">
          <div className="home-contact-decoration" aria-hidden="true">
            KP<span>.</span>
          </div>

          <span className="home-section-kicker">
            LET'S CONNECT
          </span>

          <h2>
            Have a project
            <br />
            <span>in mind?</span>
          </h2>

          <div className="home-contact-bottom">
            <p>
              Tell me about your goals, and let's explore how
              digital marketing can help your business move forward.
            </p>

            <Link
              to="/contact"
              className="home-button home-button-primary"
            >
              Start a conversation
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

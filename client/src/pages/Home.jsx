
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
    label: "SEO & ORGANIC GROWTH",
    description:
      "Build lasting search visibility with keyword research, technical SEO, on-page improvements, and a clear content strategy.",
    icon: "↗",
  },
  {
    number: "02",
    name: "Google Ads",
    label: "PAID ADVERTISING",
    description:
      "Reach the right audience with relevant keywords, persuasive ads, and carefully optimized campaigns.",
    icon: "◎",
  },
  {
    number: "03",
    name: "Social Media Marketing",
    label: "SOCIAL & CONTENT",
    description:
      "Build a recognizable brand through content planning, audience research, and purposeful social campaigns.",
    icon: "◈",
  },
  {
    number: "04",
    name: "Email Marketing",
    label: "RETENTION & ENGAGEMENT",
    description:
      "Strengthen customer relationships with thoughtful email campaigns and performance-driven improvements.",
    icon: "✳",
  },
];

const capabilities = [
  "SEO",
  "Google Ads",
  "Meta Ads",
  "Content Marketing",
  "Social Media",
  "Performance Analysis",
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

function AnalyticsVisual() {
  return (
    <div className="home-visual">
      <div className="home-visual-top">
        <div>
          <span className="home-visual-overline">
            THE DIGITAL PLAYBOOK
          </span>
          <h2>Growth, by design.</h2>
        </div>

        <span className="home-visual-index">KP / 01</span>
      </div>

      <div className="home-visual-main">
        <div className="home-orbit home-orbit-outer" />
        <div className="home-orbit home-orbit-middle" />
        <div className="home-orbit home-orbit-inner" />

        <div className="home-visual-core">
          <span className="home-core-symbol">✳</span>
          <span>STRATEGY</span>
          <small>MEETS CREATIVITY</small>
        </div>

        <span className="home-orbit-point home-point-one" />
        <span className="home-orbit-point home-point-two" />
        <span className="home-orbit-point home-point-three" />

        <div className="home-floating-note home-note-one">
          <span className="home-note-icon">↗</span>
          <div>
            <small>01 / VISIBILITY</small>
            <strong>Be discovered.</strong>
          </div>
        </div>

        <div className="home-floating-note home-note-two">
          <span className="home-note-icon">◎</span>
          <div>
            <small>02 / CONNECTION</small>
            <strong>Reach the right people.</strong>
          </div>
        </div>
      </div>

      <div className="home-visual-bottom">
        <span>RESEARCH</span>
        <span>/</span>
        <span>STRATEGY</span>
        <span>/</span>
        <span>OPTIMIZATION</span>
      </div>
    </div>
  );
}

/**
 * Loads SEO settings saved through the admin dashboard.
 * Updates the document title and meta description in the browser.
 */
function usePageSEO(apiBase, slug = "home") {
  useEffect(() => {
    if (!apiBase) return undefined;

    let cancelled = false;

    const loadSEO = async () => {
      try {
        const response = await axios.get(
          `${apiBase}/seo/public/${encodeURIComponent(slug)}`
        );

        if (cancelled) return;

        const page = response.data?.page;

        if (!page) {
          console.warn(`No SEO settings found for "${slug}".`);
          return;
        }

        // Update the browser tab title.
        if (typeof page.title === "string" && page.title.trim()) {
          document.title = page.title.trim();
        }

        // Find or create the meta description element.
        let descriptionMeta = document.head.querySelector(
          'meta[name="description"]'
        );

        if (!descriptionMeta) {
          descriptionMeta = document.createElement("meta");
          descriptionMeta.setAttribute("name", "description");
          document.head.appendChild(descriptionMeta);
        }

        // Update the meta description.
        if (typeof page.description === "string") {
          descriptionMeta.setAttribute(
            "content",
            page.description.trim()
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Unable to load Home page SEO settings:",
            error.response?.data?.message || error.message
          );
        }
      }
    };

    loadSEO();

    return () => {
      cancelled = true;
    };
  }, [apiBase, slug]);
}

export default function Home() {
  const { apiBase } = useAuth();

  const [projects, setProjects] = useState([]);

  // Apply the SEO settings saved in the admin dashboard.
  usePageSEO(apiBase, "home");

  // Load featured projects.
  useEffect(() => {
    if (!apiBase) return undefined;

    let active = true;

    const loadFeaturedProjects = async () => {
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
    };

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
              DIGITAL MARKETING STRATEGIST
            </div>

            <h1 className="home-hero-title">
              Making digital
              <br />
              <span>work smarter.</span>
            </h1>

            <p className="home-hero-description">
              I'm Kush Parekh. I combine strategic thinking, creativity,
              and performance-led marketing to help brands reach the
              right audience and build a stronger online presence.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/projects"
                className="home-button home-button-primary"
              >
                Explore my work
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
              <span>Strategy first. Meaningful growth always.</span>
            </div>
          </div>

          <div className="home-hero-art home-reveal home-reveal-delay">
            <AnalyticsVisual />
          </div>

          <div className="home-hero-index">
            <span>INDEPENDENT DIGITAL MARKETER</span>
            <span>01 — INTRODUCTION</span>
          </div>
        </div>

        <a
          className="home-scroll-cue"
          href="#approach"
          aria-label="Scroll to learn about my approach"
        >
          <span />
          Scroll to explore
        </a>
      </section>

      {/* CAPABILITIES */}
      <section
        className="home-capabilities"
        aria-label="Marketing capabilities"
      >
        <div className="home-capabilities-label">
          WHAT I WORK WITH
        </div>

        <div className="home-capabilities-list">
          {capabilities.map((capability, index) => (
            <span className="home-capability" key={capability}>
              {capability}

              {index < capabilities.length - 1 && (
                <span className="home-capability-dot">✳</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* ABOUT / APPROACH */}
      <section className="home-section home-intro" id="approach">
        <div className="home-section-topline">
          <span>01 / THE APPROACH</span>
          <span>THINK CLEARLY. MARKET INTENTIONALLY.</span>
        </div>

        <div className="home-intro-grid">
          <div className="home-intro-heading">
            <span className="home-section-kicker">
              BEHIND THE STRATEGY
            </span>

            <h2>
              Good marketing
              <br />
              starts with
              <br />
              <span>understanding.</span>
            </h2>
          </div>

          <div className="home-intro-content">
            <p className="home-intro-lead">
              The best marketing doesn't begin with a channel.
              It begins with people.
            </p>

            <p>
              Understanding your audience, market, and business goals
              creates a stronger foundation for every campaign,
              message, and decision.
            </p>

            <p>
              My approach combines research, thoughtful execution,
              and performance analysis to support real business
              objectives.
            </p>

            <Link to="/about" className="home-inline-link">
              More about my approach
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <div className="home-principles">
          <article className="home-principle">
            <span className="home-principle-number">01</span>
            <div>
              <h3>Understand</h3>
              <p>Learn about the audience, market, and business.</p>
            </div>
            <span className="home-principle-arrow">↗</span>
          </article>

          <article className="home-principle">
            <span className="home-principle-number">02</span>
            <div>
              <h3>Strategize</h3>
              <p>Choose channels and actions with a clear purpose.</p>
            </div>
            <span className="home-principle-arrow">↗</span>
          </article>

          <article className="home-principle">
            <span className="home-principle-number">03</span>
            <div>
              <h3>Optimize</h3>
              <p>Measure performance and identify opportunities.</p>
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
            <span>IDEAS INTO ACTION</span>
          </div>

          <div className="home-heading-row">
            <div>
              <span className="home-section-kicker">
                PROJECT HIGHLIGHTS
              </span>

              <h2>
                Selected work.
                <br />
                <span>Real thinking.</span>
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
          <span>03 / EXPERTISE</span>
          <span>FROM PLANNING TO PERFORMANCE</span>
        </div>

        <div className="home-heading-row home-services-heading">
          <div>
            <span className="home-section-kicker">
              WHAT I CAN HELP WITH
            </span>

            <h2>
              The right tools.
              <br />
              <span>A clearer direction.</span>
            </h2>
          </div>

          <p>
            Every brand has different needs. The right mix of marketing
            channels should support your goals, audience, and stage
            of growth.
          </p>
        </div>

        <div className="home-service-list">
          {services.map((service) => (
            <article className="home-service" key={service.number}>
              <span className="home-service-number">
                {service.number}
              </span>

              <div className="home-service-copy">
                <span className="home-service-label">
                  {service.label}
                </span>

                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>

              <span className="home-service-icon" aria-hidden="true">
                {service.icon}
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="home-contact" id="contact-cta">
        <div className="home-contact-inner">
          <div className="home-contact-decoration" aria-hidden="true">
            KP<span>.</span>
          </div>

          <span className="home-section-kicker">
            HAVE A PROJECT IN MIND?
          </span>

          <h2>
            Let's make your
            <br />
            next move <span>meaningful.</span>
          </h2>

          <div className="home-contact-bottom">
            <p>
              Let's talk about your goals and explore how a thoughtful
              digital strategy can help your brand move forward.
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

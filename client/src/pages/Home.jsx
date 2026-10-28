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

const principles = [
  {
    number: "01",
    title: "Understand",
    text: "Start with the audience and the business goals behind every campaign.",
  },
  {
    number: "02",
    title: "Strategize",
    text: "Choose the right channels and priorities before spending a rupee.",
  },
  {
    number: "03",
    title: "Improve",
    text: "Learn from the results and keep refining the approach.",
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
        strokeWidth="1.8"
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
          <span className="home-visual-overline">DIGITAL MARKETING</span>
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
          <span className="home-core-label">GROWTH</span>
        </div>

        <article className="home-floating-note home-note-one">
          <div className="home-note-icon">⌕</div>
          <div className="home-note-content">
            <small>VISIBILITY</small>
            <strong>Be easier to discover.</strong>
            <p>Build a stronger search presence.</p>
          </div>
        </article>

        <article className="home-floating-note home-note-two">
          <div className="home-note-icon">↗</div>
          <div className="home-note-content">
            <small>PERFORMANCE</small>
            <strong>Make every decision count.</strong>
            <p>Use insights to improve campaigns.</p>
          </div>
        </article>
      </div>

      <div className="home-visual-bottom">
        <span className="home-live-dot" />
        <span>Research</span>
        <span className="home-sep">·</span>
        <span>Strategy</span>
        <span className="home-sep">·</span>
        <span>Optimization</span>
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

        if (typeof page.description === "string" && page.description.trim()) {
          descriptionMeta.setAttribute("content", page.description.trim());
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

/**
 * Fades elements in as they scroll into view.
 * Elements opt in with the data-reveal attribute.
 * Content stays visible if IntersectionObserver is unavailable.
 */
function useScrollReveal(dependency) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    setArmed(true);

    const targets = document.querySelectorAll(
      ".home-page [data-reveal]:not(.is-visible)"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [dependency]);

  return armed;
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

  const armed = useScrollReveal(projects.length);

  return (
    <main className={`home-page${armed ? " is-armed" : ""}`}>
      {/* HERO */}
      <section className="home-hero" id="top">
        <div className="home-hero-grid">
          <div className="home-hero-copy home-reveal">
            <div className="home-eyebrow">
              <span className="home-live-dot" />
              Independent digital marketer
            </div>

            <h1 className="home-hero-title">
              Growing brands
              <br />
              <span>in a digital world.</span>
            </h1>

            <p className="home-hero-description">
              I'm Kush Parekh. I help businesses build a stronger online
              presence through SEO, digital advertising, and thoughtful
              marketing strategies.
            </p>

            <div className="home-hero-actions">
              <Link to="/projects" className="home-button home-button-primary">
                View my work
                <ArrowIcon />
              </Link>

              <Link to="/contact" className="home-button home-button-ghost">
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

        <ul className="home-strip" aria-label="Areas of focus">
          <li>SEO</li>
          <li>Google Ads</li>
          <li>Social Media</li>
          <li>Content</li>
        </ul>
      </section>

      {/* ABOUT / APPROACH */}
      <section className="home-section home-intro" id="approach">
        <div className="home-intro-grid" data-reveal>
          <div className="home-intro-heading">
            <span className="home-section-kicker">THE WAY I WORK</span>
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
              I bring research, creative thinking, and performance insights
              together to help businesses make more informed digital
              marketing decisions.
            </p>
            <Link to="/about" className="home-inline-link">
              More about me
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <div className="home-principles">
          {principles.map((item, index) => (
            <article
              className="home-principle"
              key={item.number}
              data-reveal
              style={{ "--delay": `${index * 90}ms` }}
            >
              <span className="home-principle-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {projects.length > 0 && (
        <section className="home-section home-work" id="work">
          <div className="home-heading-row" data-reveal>
            <div>
              <span className="home-section-kicker">A FEW HIGHLIGHTS</span>
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
            {projects.map((project, index) => (
              <div
                className="home-project-item"
                key={project._id}
                data-reveal
                style={{ "--delay": `${index * 90}ms` }}
              >
                <ProjectCard project={project} showDownload={false} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section className="home-section home-services" id="services">
        <div className="home-heading-row" data-reveal>
          <div>
            <span className="home-section-kicker">DIGITAL MARKETING</span>
            <h2>
              The right strategy.
              <br />
              <span>The right channels.</span>
            </h2>
          </div>

          <p className="home-heading-note">
            Practical services to improve online visibility, reach relevant
            audiences, and support business goals.
          </p>
        </div>

        <div className="home-service-list">
          {services.map((service, index) => (
            <article
              className="home-service"
              key={service.number}
              data-reveal
              style={{ "--delay": `${index * 70}ms` }}
            >
              <span className="home-service-number">{service.number}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className="home-service-icon" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="home-contact" id="contact-cta">
        <div className="home-contact-inner" data-reveal>
          <div className="home-contact-decoration" aria-hidden="true">
            KP<span>.</span>
          </div>

          <span className="home-section-kicker">LET'S CONNECT</span>

          <h2>
            Have a project
            <br />
            <span>in mind?</span>
          </h2>

          <div className="home-contact-bottom">
            <p>
              Tell me about your goals, and let's explore how digital
              marketing can help your business move forward.
            </p>

            <Link to="/contact" className="home-button home-button-primary">
              Start a conversation
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
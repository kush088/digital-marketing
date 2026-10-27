import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const approach = [
  {
    number: "01",
    step: "Understand",
    detail:
      "Learn about your business, audience, goals, and the challenges that matter most.",
    symbol: "◎",
  },
  {
    number: "02",
    step: "Research",
    detail:
      "Explore keywords, competitors, audience behavior, and market opportunities.",
    symbol: "⌕",
  },
  {
    number: "03",
    step: "Strategize",
    detail:
      "Develop a focused marketing strategy aligned with your business objectives.",
    symbol: "✳",
  },
  {
    number: "04",
    step: "Execute",
    detail:
      "Turn insights into practical campaigns, content, and optimization activities.",
    symbol: "↗",
  },
  {
    number: "05",
    step: "Measure",
    detail:
      "Review performance, identify opportunities, and continuously improve.",
    symbol: "⌁",
  },
];

const capabilities = [
  "Search Engine Optimization",
  "Google Ads",
  "Meta Ads",
  "Content Marketing",
  "Social Media Marketing",
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

function AboutVisual() {
  return (
    <div className="about-visual">
      <div className="about-visual-label">
        <span>THE DIGITAL LANDSCAPE</span>
        <span>KP / 01</span>
      </div>

      <div className="about-visual-stage">
        <div className="about-visual-grid" />

        <div className="about-visual-orbit about-orbit-a" />
        <div className="about-visual-orbit about-orbit-b" />
        <div className="about-visual-orbit about-orbit-c" />

        <span className="about-orbit-dot about-dot-a" />
        <span className="about-orbit-dot about-dot-b" />
        <span className="about-orbit-dot about-dot-c" />

        <div className="about-visual-center">
          <span className="about-center-symbol">KP.</span>
          <span className="about-center-line" />
          <small>THINK · CREATE · GROW</small>
        </div>

        <div className="about-floating about-floating-top">
          <span className="about-floating-icon">↗</span>
          <div>
            <small>01 / DIRECTION</small>
            <strong>Strategy</strong>
            <span>Start with insight</span>
          </div>
        </div>

        <div className="about-floating about-floating-bottom">
          <span className="about-floating-icon">✳</span>
          <div>
            <small>02 / PROGRESS</small>
            <strong>Growth</strong>
            <span>Improve with purpose</span>
          </div>
        </div>
      </div>

      <div className="about-visual-caption">
        <span>GOOD THINKING.</span>
        <span>BETTER MARKETING.</span>
      </div>

      <div className="about-visual-index">SURAT, INDIA — 2026</div>
    </div>
  );
}

export default function About() {
  return (
    <main className="about-page">
      {/* HERO */}

      <section className="about-hero">
        <div className="about-container">
          <div className="about-topline">
            <span>ABOUT ME / 01</span>
            <span>DIGITAL MARKETING & STRATEGY</span>
          </div>

          <div className="about-hero-grid">
            <div className="about-intro about-reveal">
              <div className="about-eyebrow">
                <span className="about-dot" />
                A LITTLE ABOUT WHAT I DO
              </div>

              <h1>
                Hey, I'm
                <br />
                <span>Kush Parekh.</span>
              </h1>

              <p className="about-lead">
                Curious about people. Passionate about digital growth.
                Interested in turning marketing insights into meaningful
                opportunities for brands.
              </p>

              <div className="about-hero-actions">
                <Link to="/contact" className="about-primary-btn">
                  Let's connect
                  <ArrowIcon />
                </Link>

                <a href="#my-approach" className="about-secondary-link">
                  Explore my approach
                  <span aria-hidden="true">↓</span>
                </a>
              </div>

              <div className="about-hero-note">
                <span />
                <p>
                  Research thoughtfully. Create intentionally.
                  Improve continuously.
                </p>
              </div>
            </div>

            <div className="about-hero-art about-reveal about-reveal-delay">
              <AboutVisual />
            </div>
          </div>

          <div className="about-bottomline">
            <span>BASED IN SURAT, GUJARAT, INDIA</span>
            <span>BUILDING KNOWLEDGE, ONE STRATEGY AT A TIME.</span>
          </div>
        </div>
      </section>

      {/* PERSONAL INTRODUCTION */}

      <section className="about-story about-container">
        <div className="about-section-label">
          <span>02 / MY STORY</span>
          <span>THE THINKING BEHIND THE WORK</span>
        </div>

        <div className="about-story-grid">
          <div className="about-story-heading">
            <span className="about-mini-label">A POINT OF VIEW</span>

            <h2>
              Good marketing begins with
              <span> understanding.</span>
            </h2>

            <div className="about-story-mark" aria-hidden="true">
              KP<span>.</span>
            </div>
          </div>

          <div className="about-story-copy">
            <p className="about-story-lead">
              I'm a digital marketing enthusiast interested in helping
              brands strengthen their online presence through research,
              creativity, and data-informed decisions.
            </p>

            <p>
              My areas of focus include SEO, Google Ads, Meta Ads,
              content marketing, and social media marketing. I'm
              interested in how thoughtful strategy and continuous
              improvement can help businesses connect with the right
              audiences.
            </p>

            <p>
              My approach is simple: understand the goal, research
              the opportunity, build a plan, and learn from the results.
            </p>

            <Link to="/contact" className="about-text-link">
              Let's discuss your goals
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}

      <section className="about-capabilities">
        <div className="about-container">
          <div className="about-section-label">
            <span>03 / AREAS OF FOCUS</span>
            <span>THE DIGITAL TOOLKIT</span>
          </div>

          <div className="about-capabilities-heading">
            <div>
              <span className="about-mini-label">
                WHAT I'M FOCUSED ON
              </span>

              <h2>
                Curiosity meets
                <br />
                <span>digital strategy.</span>
              </h2>
            </div>

            <p>
              Exploring the channels, techniques, and insights that
              help businesses improve their digital presence.
            </p>
          </div>

          <div className="about-capabilities-list">
            {capabilities.map((capability, index) => (
              <div className="about-capability" key={capability}>
                <span className="about-capability-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{capability}</h3>

                <span
                  className="about-capability-arrow"
                  aria-hidden="true"
                >
                  <ArrowIcon />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKING APPROACH */}

      <section
        className="about-approach about-container"
        id="my-approach"
      >
        <div className="about-section-label">
          <span>04 / MY PROCESS</span>
          <span>FROM INSIGHT TO IMPROVEMENT</span>
        </div>

        <div className="about-approach-heading">
          <div>
            <span className="about-mini-label">
              HOW I APPROACH THE WORK
            </span>

            <h2>
              A thoughtful process.
              <br />
              <span>A clearer direction.</span>
            </h2>
          </div>

          <p>
            A structured approach helps keep marketing activities
            focused, purposeful, and connected to business goals.
          </p>
        </div>

        <div className="about-approach-grid">
          {approach.map((item) => (
            <article
              className="about-approach-card"
              key={item.number}
            >
              <div className="about-approach-card-top">
                <span className="about-approach-number">
                  {item.number}
                </span>

                <span className="about-approach-symbol">
                  {item.symbol}
                </span>
              </div>

              <div className="about-approach-card-content">
                <h3>{item.step}</h3>
                <p>{item.detail}</p>
              </div>

              <span className="about-approach-bottom-line" />
            </article>
          ))}
        </div>

        <div className="about-process-footer">
          <span className="about-process-footer-symbol">✳</span>
          <p>
            Every insight is an opportunity to make the next decision
            better.
          </p>
        </div>
      </section>

      {/* CONTACT CTA */}

      <section className="about-contact-wrap">
        <div className="about-contact">
          <div className="about-contact-topline">
            <span className="about-mini-label">
              HAVE A PROJECT IN MIND?
            </span>
            <span className="about-contact-number">05 / LET'S TALK</span>
          </div>

          <h2>
            Let's make
            <br />
            something <span>meaningful.</span>
          </h2>

          <div className="about-contact-bottom">
            <p>
              Have a business goal, a marketing challenge, or an idea
              you'd like to explore? Let's start a conversation.
            </p>

            <Link
              to="/contact"
              className="about-primary-btn about-cta-btn"
            >
              Get in touch
              <ArrowIcon />
            </Link>
          </div>

          <span className="about-contact-decoration" aria-hidden="true">
            KP.
          </span>

          <div className="about-contact-footer">
            <span>THINK CLEARLY.</span>
            <span>MARKET INTENTIONALLY.</span>
            <span>GROW PURPOSEFULLY.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
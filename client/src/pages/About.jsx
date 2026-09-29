import React from "react";
import "./About.css";

const approach = [
  {
    step: "Understand",
    detail: "Understand your business and audience.",
  },
  {
    step: "Research",
    detail: "Research before creating a strategy.",
  },
  {
    step: "Strategize",
    detail: "Build a clear marketing strategy.",
  },
  {
    step: "Execute",
    detail: "Put the strategy into action.",
  },
  {
    step: "Measure",
    detail: "Track, learn, and improve.",
  },
];

export default function About() {
  return (
    <div>
      <section className="container section" style={{ borderTop: "none" }}>
        <div className="about-hero">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="about-headline">
              Kush Parekh
            </h1>
            <div className="about-copy">
              <p>
                I’m a digital marketing enthusiast focused on building practical
                experience through hands-on projects, marketing research, and
                real-world case studies.
              </p>

            </div>
          </div>

          <div className="facts-card">
            <p className="facts-title">Quick facts</p>
            <dl className="facts-list">
              <div className="facts-row">
                <dt>Based in</dt>
                <dd>Surat, Gujarat, India</dd>
              </div>
              <div className="facts-row">
                <dt>Focus</dt>
                <dd>SEO • Meta Ads • Google Ads • Meta Ads</dd>
              </div>

              <div className="facts-row">
                <dt>Availability</dt>
                <dd className="text-success">Ready to create new projects</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-heading">How I work</h2>
          <div className="approach-grid">
            {approach.map((a) => (
              <div key={a.step} className="approach-card">
                <h3>{a.step}</h3>
                <p>{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

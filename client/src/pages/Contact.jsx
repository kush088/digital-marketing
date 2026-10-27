
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import "./Contact.css";

const initialForm = {
  name: "",
  email: "",
  budget: "",
  message: "",
};

export default function Contact() {
  const { apiBase } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (status === "error" || status === "sent") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiBase) {
      setStatus("error");
      setErrorMessage(
        "The contact service is currently unavailable. Please try again later."
      );
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      await axios.post(`${apiBase}/contact`, {
        name: form.name.trim(),
        email: form.email.trim(),
        budget: form.budget.trim(),
        message: form.message.trim(),
      });

      setStatus("sent");
      setForm(initialForm);
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "We couldn't send your message. Please try again."
      );
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-background-shape contact-shape-one" />
      <div className="contact-background-shape contact-shape-two" />

      <div className="container contact-container">
        {/* Page introduction */}
        <div className="contact-top">
          <span className="contact-eyebrow">
            <span className="contact-eyebrow-line" />
            LET'S CONNECT
          </span>

          <h1 className="contact-main-heading">
            Good things start
            <br />
            with a <span>conversation.</span>
          </h1>

          <p className="contact-main-description">
            Have a business to grow or an idea to bring to life?
            Let's talk about your goals and find the right digital
            marketing strategy for your brand.
          </p>
        </div>

        {/* Main contact layout */}
        <div className="contact-grid">
          {/* Left information panel */}
          <section className="contact-info">
            <div className="contact-info-top">
              <span className="contact-card-label">
                YOUR NEXT CHAPTER
              </span>

              <h2>
                Let's make
                <br />
                <span>something happen.</span>
              </h2>

              <p>
                Every successful project starts with understanding
                what matters to you. Share your vision, challenges,
                or goals, and let's explore how digital marketing
                can help.
              </p>
            </div>

            <div className="contact-pill-list">
              <span>01 / Strategy</span>
              <span>02 / Creativity</span>
              <span>03 / Growth</span>
            </div>

            <div className="contact-visual">
              <div className="contact-orbit contact-orbit-outer" />
              <div className="contact-orbit contact-orbit-inner" />

              <div className="contact-visual-center">
                <span className="contact-visual-icon">↗</span>
              </div>

              <span className="contact-orbit-dot contact-dot-one" />
              <span className="contact-orbit-dot contact-dot-two" />
              <span className="contact-orbit-dot contact-dot-three" />

              <div className="contact-visual-caption">
                <span className="contact-status-dot" />
                OPEN TO NEW PROJECTS
              </div>
            </div>

            <div className="contact-bottom-note">
              <span className="contact-bottom-note-icon">✳</span>
              <div>
                <strong>Have a goal in mind?</strong>
                <p>Let's find a way to get you there.</p>
              </div>
            </div>
          </section>

          {/* Contact form */}
          <section className="contact-form-wrapper">
            <div className="contact-form-heading">
              <span className="contact-form-kicker">
                START A CONVERSATION
              </span>

              <h2>Tell me about your project.</h2>

              <p>
                A few details will help me understand how I can help
                your business move forward.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-fields-row">
                <div className="contact-field-group">
                  <label htmlFor="name" className="contact-field-label">
                    Your name <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    className="contact-field"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>

                <div className="contact-field-group">
                  <label htmlFor="email" className="contact-field-label">
                    Email address <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={handleChange}
                    className="contact-field"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="contact-field-group">
                <label htmlFor="budget" className="contact-field-label">
                  Monthly marketing budget
                  <span className="contact-optional">(Optional)</span>
                </label>

                <select
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="contact-field contact-select"
                >
                  <option value="">Select your approximate budget</option>
                  <option value="Under ₹10,000">Under ₹10,000</option>
                  <option value="₹10,000 – ₹25,000">
                    ₹10,000 – ₹25,000
                  </option>
                  <option value="₹25,000 – ₹50,000">
                    ₹25,000 – ₹50,000
                  </option>
                  <option value="₹50,000 – ₹1,00,000">
                    ₹50,000 – ₹1,00,000
                  </option>
                  <option value="Above ₹1,00,000">
                    Above ₹1,00,000
                  </option>
                  <option value="Not decided yet">Not decided yet</option>
                </select>
              </div>

              <div className="contact-field-group">
                <label htmlFor="message" className="contact-field-label">
                  Tell me about your project <span>*</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={form.message}
                  onChange={handleChange}
                  className="contact-field contact-textarea"
                  placeholder="What are you working on? What would you like to achieve?"
                />

                <span className="contact-character-count">
                  {form.message.length}/5000
                </span>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="contact-submit"
              >
                <span>
                  {status === "sending"
                    ? "Sending your message..."
                    : "Let's talk about your project"}
                </span>

                {status !== "sending" && (
                  <span className="contact-submit-arrow" aria-hidden="true">
                    ↗
                  </span>
                )}

                {status === "sending" && (
                  <span className="contact-spinner" aria-hidden="true" />
                )}
              </button>

              {status === "sent" && (
                <p className="contact-feedback contact-feedback-success" role="status">
                  <span aria-hidden="true">✓</span>
                  Message sent successfully! I'll get back to you soon.
                </p>
              )}

              {status === "error" && (
                <p className="contact-feedback contact-feedback-error" role="alert">
                  {errorMessage}
                </p>
              )}

              <p className="contact-privacy-note">
                Your information will only be used to respond to your inquiry.
              </p>
            </form>
          </section>
        </div>

        {/* Closing message */}
        <div className="contact-footer-note">
          <span>HAVE A BIG IDEA?</span>
          <p>
            Every big result begins with a small first step.
            <strong> Let's take yours.</strong>
          </p>
        </div>
      </div>
    </main>
  );
}

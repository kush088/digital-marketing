import React, { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("sending");

    try {
      const response = await axios.post(`${apiBase}/contact`, form);

      console.log("Contact response:", response.data);

      setStatus("sent");
      setForm(initialForm);
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus("error");
    }
  };

  return (
    <div className="container contact-grid">
      <div className="contact-intro">
        <p className="eyebrow">Contact</p>

        <h1 className="contact-headline">
          Let’s Grow Your Brand
        </h1>

        <p>
          Have a business, brand, or marketing goal in mind? Let’s turn your ideas into a digital strategy that reaches the right audience

          Let’s talk about your goals and explore what we can achieve together.
        </p>

        <div className="contact-details">
          <p>🎯 Strategy.</p>
          <p>💡 Creativity.</p>
          <p>📈 Growth.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="field-group">
          <label htmlFor="name" className="field-label">
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="field"
            placeholder="Your name"
          />
        </div>

        <div className="field-group">
          <label htmlFor="email" className="field-label">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="field"
            placeholder="Enter your email"
          />
        </div>

        <div className="field-group">
          <label htmlFor="budget" className="field-label">
            Monthly budget (optional)
          </label>

          <input
            id="budget"
            name="budget"
            type="text"
            value={form.budget}
            onChange={handleChange}
            className="field"
            placeholder="e.g. ₹10,000 - ₹25,000"
          />
        </div>

        <div className="field-group">
          <label htmlFor="message" className="field-label">
            Tell me about your project
          </label>

          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={form.message}
            onChange={handleChange}
            className="field"
            placeholder="Project goals, requirements, timeline…"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>

        {status === "sent" && (
          <p className="contact-form-message text-success">
            Message sent successfully. I'll get back to you soon.
          </p>
        )}

        {status === "error" && (
          <p className="contact-form-message text-error">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
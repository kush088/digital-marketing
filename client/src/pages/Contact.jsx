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

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // SUBMIT CONTACT FORM
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("sending");

    try {
      await axios.post(`${apiBase}/contact`, form);

      setStatus("sent");

      setForm(initialForm);
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus("error");
    }
  };

  return (
    <div className="container contact-grid">

      {/* --------------------------------------------------
          CONTACT INTRO
      -------------------------------------------------- */}

      <div className="contact-intro">

        <p className="eyebrow">
          Contact
        </p>

        <h1 className="contact-headline">
          Tell me about your project
        </h1>

        <p>
          Have a project, business idea, or digital marketing
          challenge? Tell me what you’re working on, and let’s
          explore how I can help.
        </p>

       

      </div>

      {/* --------------------------------------------------
          CONTACT FORM
      -------------------------------------------------- */}

      <form
        onSubmit={handleSubmit}
        className="contact-form"
      >

        {/* NAME */}

        <div className="field-group">

          <label
            htmlFor="name"
            className="field-label"
          >
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

        {/* EMAIL */}

        <div className="field-group">

          <label
            htmlFor="email"
            className="field-label"
          >
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
            placeholder="Enter your E-mail"
          />

        </div>

        {/* BUDGET */}

        <div className="field-group">

          <label
            htmlFor="budget"
            className="field-label"
          >
            Monthly budget (optional)
          </label>

          <input
            id="budget"
            name="budget"
            type="text"
            value={form.budget}
            onChange={handleChange}
            className="field"
            placeholder="Rs:"
          />

        </div>

        {/* MESSAGE */}

        <div className="field-group">

          <label
            htmlFor="message"
            className="field-label"
          >
            Share your project details, goals, and key requirements.
          </label>

          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="field"
            placeholder="Project details, goals, budget…"
          />

        </div>

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary"
        >
          {status === "sending"
            ? "Sending..."
            : "Send message"}
        </button>

        {/* SUCCESS MESSAGE */}

        {status === "sent" && (
          <p className="contact-form-message text-success">
            Sent — I'll get back to you within two business days.
          </p>
        )}

        {/* ERROR MESSAGE */}

        {status === "error" && (
          <p className="contact-form-message text-error">
            That didn't go through. Please try again.
          </p>
        )}

      </form>

    </div>
  );
}
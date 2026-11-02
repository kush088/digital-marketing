import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <p className="eyebrow">Admin</p>
        <h1 className="admin-login-title">Sign in</h1>
        <p className="admin-login-sub">Manage projects and site content.</p>

        <div className="admin-login-fields">
          <div className="field-group">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="field"
            />
          </div>
          <div className="field-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="field"
            />
          </div>
        </div>

        {error && <p className="admin-login-error text-error">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

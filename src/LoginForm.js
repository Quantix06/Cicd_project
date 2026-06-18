import React, { useState } from "react";

const ADMIN_EMAIL = "loise.fenoll@ynov.com";
const ADMIN_PASSWORD = "PvdrTAzTeR247sDnAZBr";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLogin("admin");
    } else {
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="form-card login-card">
      <div className="login-icon">🔐</div>
      <h2>Connexion Admin</h2>
      <p className="form-subtitle">Accès réservé aux administrateurs</p>

      <form onSubmit={handleSubmit} id="login-form">
        <div className="form-group full-width">
          <label htmlFor="login-email">Adresse e-mail</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ynov.com"
            required
          />
        </div>

        <div className="form-group full-width" style={{ marginTop: "1rem" }}>
          <label htmlFor="login-password">Mot de passe</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Se connecter
        </button>

        {error && (
          <div className="error-message">
            ✕ {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import UserList from "./UserList";
import axios from "axios";

function Navigation({ adminToken, onLogout }) {
  const location = useLocation();

  return (
    <nav className="app-nav">
      <Link
        to="/"
        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
      >
        Inscription
      </Link>
      <Link
        to="/users"
        className={`nav-link ${location.pathname === "/users" ? "active" : ""}`}
      >
        Utilisateurs
      </Link>
      {!adminToken ? (
        <Link
          to="/login"
          className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
        >
          Admin
        </Link>
      ) : (
        <button className="nav-link nav-logout" onClick={onLogout}>
          Déconnexion
        </button>
      )}
    </nav>
  );
}

function AppContent() {
  // 1. Logique et État
  const [count, setCount] = useState(0);
  const port = process.env.REACT_APP_SERVER_PORT || 8000;
  const apiBaseUrl = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://cicd-project-epmtgw9zh-quantix06s-projects.vercel.app' : `http://localhost:${port}`);
  let [usersCount, setUsersCount] = useState(0);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({
          baseURL: apiBaseUrl,
        });
        const response = await api.get(`/users`);
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error(error);
      }
    }
    countUsers();
  }, [port]);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleLogin = (token) => {
    setAdminToken(token);
  };

  const handleLogout = () => {
    setAdminToken(null);
  };

  // 2. Rendu
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="counter-section">
          <p>
            Compteur actuel : <span data-testid="count">{count}</span>
          </p>

          <button onClick={incrementCount} className="btn-primary">
            Click me
          </button>

          <h1>Users manager</h1>
          <p>{usersCount} user(s) already registered</p>
        </div>

        <Navigation adminToken={adminToken} onLogout={handleLogout} />

        {/* ===== Routes ===== */}
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route
            path="/login"
            element={
              adminToken ? (
                <div className="form-card">
                  <div className="login-icon">✅</div>
                  <h2>Connecté en tant qu'admin</h2>
                  <p className="form-subtitle">
                    Vous avez accès aux fonctionnalités d'administration
                  </p>
                  <button className="btn-submit" onClick={handleLogout}>
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/users"
            element={
              <UserList adminToken={adminToken} onLogout={handleLogout} />
            }
          />
        </Routes>
      </header>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

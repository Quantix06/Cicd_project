import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import RegistrationForm from "./RegistrationForm";
import axios from "axios";

function App() {
  // 1. Logique et État
  const [count, setCount] = useState(0);
  const port = process.env.REACT_APP_SERVER_PORT;
  let [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({
          baseURL: `http://localhost:${port}`,
        });
        const response = await api.get(`/users`);
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error(error);
      }
    }
    countUsers();
  }, []);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
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

        {/* ===== Formulaire d'inscription ===== */}
        <RegistrationForm />
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

export default App;

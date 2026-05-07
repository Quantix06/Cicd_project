import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import RegistrationForm from "./RegistrationForm";

function App() {
  // 1. Logique et État
  const [count, setCount] = useState(0);

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
        </div>

        {/* ===== Formulaire d'inscription ===== */}
        <RegistrationForm />

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

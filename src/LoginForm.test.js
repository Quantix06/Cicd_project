import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche le titre 'Connexion Admin'", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    expect(screen.getByText("Connexion Admin")).toBeInTheDocument();
  });

  test("affiche le sous-titre", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    expect(
      screen.getByText("Accès réservé aux administrateurs")
    ).toBeInTheDocument();
  });

  test("affiche le champ email", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    const emailInput = document.getElementById("login-email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();
  });

  test("affiche le champ mot de passe", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    const passwordInput = document.getElementById("login-password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toBeRequired();
  });

  test("affiche le bouton 'Se connecter'", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    const btn = screen.getByRole("button", { name: /se connecter/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "submit");
  });

  test("met à jour le champ email lors de la saisie", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    const emailInput = document.getElementById("login-email");
    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });
    expect(emailInput.value).toBe("test@example.com");
  });

  test("met à jour le champ mot de passe lors de la saisie", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    const passwordInput = document.getElementById("login-password");
    fireEvent.change(passwordInput, { target: { value: "secret" } });
    expect(passwordInput.value).toBe("secret");
  });

  test("appelle onLogin('admin') avec les bons identifiants", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    fireEvent.change(document.getElementById("login-email"), {
      target: { value: "loise.fenoll@ynov.com" },
    });
    fireEvent.change(document.getElementById("login-password"), {
      target: { value: "PvdrTAzTeR247sDnAZBr" },
    });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    expect(mockOnLogin).toHaveBeenCalledWith("admin");
  });

  test("affiche une erreur avec des identifiants invalides", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    fireEvent.change(document.getElementById("login-email"), {
      target: { value: "mauvais@email.com" },
    });
    fireEvent.change(document.getElementById("login-password"), {
      target: { value: "mauvaismdp" },
    });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test("n'appelle pas onLogin si le mot de passe est mauvais", () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    fireEvent.change(document.getElementById("login-email"), {
      target: { value: "loise.fenoll@ynov.com" },
    });
    fireEvent.change(document.getElementById("login-password"), {
      target: { value: "mauvaismdp" },
    });
    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});

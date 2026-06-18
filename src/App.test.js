import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock axios before importing App - use arrow functions to avoid TDZ
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: (...args) => mockGet(...args),
      post: (...args) => mockPost(...args),
      delete: (...args) => mockDelete(...args),
    }),
  },
}));

// Import App after mocks are set up
const App = require("./App").default;

describe("Composant App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({ data: { utilisateurs: [] } });
    mockPost.mockResolvedValue({ data: {} });
  });

  test("rend les balises statiques correctement (logo, lien)", async () => {
    await act(async () => {
      render(<App />);
    });

    const logoElement = screen.getByAltText("logo");
    expect(logoElement).toBeInTheDocument();

    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://reactjs.org");
  });

  test("affiche la valeur initiale du compteur à 0", async () => {
    await act(async () => {
      render(<App />);
    });
    const countValue = screen.getByTestId("count");
    expect(countValue).toHaveTextContent("0");
  });

  test("incrémente le compteur lors du clic sur le bouton 'Click me'", async () => {
    await act(async () => {
      render(<App />);
    });
    const countValue = screen.getByTestId("count");
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(countValue).toHaveTextContent("1");
    fireEvent.click(button);
    expect(countValue).toHaveTextContent("2");
  });

  test("affiche les liens de navigation", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getAllByText("Inscription").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Utilisateurs")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("affiche le formulaire d'inscription par défaut", async () => {
    await act(async () => {
      render(<App />);
    });
    const title = screen.getByRole("heading", { name: /inscription/i });
    expect(title).toBeInTheDocument();
  });

  test("gère gracieusement une erreur API lors du comptage des utilisateurs (L58)", async () => {
    mockGet.mockRejectedValue(new Error("Network Error"));
    // L'appli ne doit pas crasher même si l'API échoue
    await act(async () => {
      render(<App />);
    });
    // Le compteur reste à 0
    expect(screen.getByText(/0 user\(s\) already registered/i)).toBeInTheDocument();
  });

  test("connecte l'admin via LoginForm et affiche 'Déconnexion' dans la nav (L71)", async () => {
    await act(async () => {
      render(<App />);
    });
    // Navigue vers /login
    fireEvent.click(screen.getByText("Admin"));

    // Remplit le formulaire de connexion admin
    await act(async () => {
      fireEvent.change(document.getElementById("login-email"), {
        target: { value: "loise.fenoll@ynov.com" },
      });
      fireEvent.change(document.getElementById("login-password"), {
        target: { value: "PvdrTAzTeR247sDnAZBr" },
      });
      fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    });

    // Après login, le lien "Admin" est remplacé par "Déconnexion"
    expect(screen.getByRole("button", { name: /déconnexion/i })).toBeInTheDocument();
  });

  test("déconnecte l'admin via le bouton Déconnexion dans la nav (L75)", async () => {
    await act(async () => {
      render(<App />);
    });
    // Login
    fireEvent.click(screen.getByText("Admin"));
    await act(async () => {
      fireEvent.change(document.getElementById("login-email"), {
        target: { value: "loise.fenoll@ynov.com" },
      });
      fireEvent.change(document.getElementById("login-password"), {
        target: { value: "PvdrTAzTeR247sDnAZBr" },
      });
      fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));
    });
    // Logout
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /déconnexion/i }));
    });
    // Le lien "Admin" réapparaît
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});

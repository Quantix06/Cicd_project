import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock axios before importing App - use arrow functions to avoid TDZ
const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: (...args) => mockGet(...args),
      post: (...args) => mockPost(...args),
    })),
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

    // Vérifie que le logo est présent via son attribut alt
    const logoElement = screen.getByAltText("logo");
    expect(logoElement).toBeInTheDocument();

    // Vérifie que le lien "Learn React" est présent
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://reactjs.org");
  });

  test("affiche la valeur initiale du compteur à 0", async () => {
    await act(async () => {
      render(<App />);
    });

    // Utilise le data-testid défini dans la balise qui contient le compteur
    const countValue = screen.getByTestId("count");
    expect(countValue).toHaveTextContent("0");
  });

  test("incrémente le compteur lors du clic sur le bouton 'Click me'", async () => {
    await act(async () => {
      render(<App />);
    });

    const countValue = screen.getByTestId("count");
    const button = screen.getByRole("button", { name: /click me/i });

    // Premier clic
    fireEvent.click(button);
    expect(countValue).toHaveTextContent("1");

    // Deuxième clic
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

    // Le formulaire d'inscription est affiché sur la page d'accueil via le heading
    const title = screen.getByRole("heading", { name: /inscription/i });
    expect(title).toBeInTheDocument();
  });
});

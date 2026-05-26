import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App"; // Assurez-vous que App possède bien un "export default"

describe("Composant App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("rend les balises statiques correctement (logo, lien)", () => {
    render(<App />);

    // Vérifie que le logo est présent via son attribut alt
    const logoElement = screen.getByAltText("logo");
    expect(logoElement).toBeInTheDocument();

    // Vérifie que le lien "Learn React" est présent
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://reactjs.org");
  });

  test("affiche la valeur initiale du compteur à 0", () => {
    render(<App />);

    // Utilise le data-testid défini dans la balise qui contient le compteur
    const countValue = screen.getByTestId("count");
    expect(countValue).toHaveTextContent("0");
  });

  test("incrémente le compteur lors du clic sur le bouton 'Click me'", () => {
    render(<App />);

    const countValue = screen.getByTestId("count");
    const button = screen.getByRole("button", { name: /click me/i });

    // Premier clic
    fireEvent.click(button);
    expect(countValue).toHaveTextContent("1");

    // Deuxième clic
    fireEvent.click(button);
    expect(countValue).toHaveTextContent("2");
  });
});

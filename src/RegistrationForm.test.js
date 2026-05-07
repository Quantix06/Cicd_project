import { render, screen, fireEvent } from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";

// ===== Rendu des champs =====

test("renders the registration form title", () => {
  render(<RegistrationForm />);
  const title = screen.getByText("Inscription");
  expect(title).toBeInTheDocument();
});

test("renders the subtitle", () => {
  render(<RegistrationForm />);
  const subtitle = screen.getByText("Remplissez vos informations personnelles");
  expect(subtitle).toBeInTheDocument();
});

test("renders the nom field", () => {
  render(<RegistrationForm />);
  const input = document.getElementById("champ_nom");
  expect(input).toBeInTheDocument();
  expect(input).toBeRequired();
});

test("renders the prenom field", () => {
  render(<RegistrationForm />);
  const input = document.getElementById("champ_prenom");
  expect(input).toBeInTheDocument();
  expect(input).toBeRequired();
});

test("renders the email field", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Adresse e-mail");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_adresse_email");
  expect(input).toHaveAttribute("type", "email");
  expect(input).toBeRequired();
});

test("renders the date de naissance field", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Date de naissance");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_date_de_naissance");
  expect(input).toHaveAttribute("type", "date");
  expect(input).toBeRequired();
});

test("renders the ville field", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Ville");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_ville");
  expect(input).toBeRequired();
});

test("renders the code postal field", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Code postal");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_code_postal");
  expect(input).toHaveAttribute("pattern", "[0-9]{5}");
  expect(input).toBeRequired();
});

test("renders the submit button", () => {
  render(<RegistrationForm />);
  const button = screen.getByRole("button", { name: /envoyer/i });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute("type", "submit");
});

// ===== gestion des réponses au formulaire =====
/**
 * @function managetextinput
 * @description Teste la gestion de la saisie dans les champs de texte
 */
test("check when the name contains special characters", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Nom");
  fireEvent.change(input, { target: { value: "Dupont!" } });
  const errorMessage = screen.getByText(
    "Le texte ne doit pas contenir de caractères spéciaux.",
  );
  expect(errorMessage).toBeInTheDocument();
});
test("check the prenom contains special characters", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Prénom");
  fireEvent.change(input, { target: { value: "Jean!" } });
  const errorMessage = screen.getByText(
    "Le texte ne doit pas contenir de caractères spéciaux.",
  );
  expect(errorMessage).toBeInTheDocument();
});
test("check the prenom contains special characters", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Prénom");
  fireEvent.change(input, { target: { value: "Jean!" } });
  const errorMessage = screen.getByText(
    "Le texte ne doit pas contenir de caractères spéciaux.",
  );
  expect(errorMessage).toBeInTheDocument();
});
test("check the ville contains special characters", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Ville");
  fireEvent.change(input, { target: { value: "Paris!" } });
  const errorMessage = screen.getByText(
    "Le texte ne doit pas contenir de caractères spéciaux.",
  );
  expect(errorMessage).toBeInTheDocument();
});

test("check the email format is invalid", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Adresse e-mail");
  fireEvent.change(input, { target: { value: "invalidemail" } });
  const errorMessage = screen.getByText(
    "Le format de l'adresse e-mail est invalide.",
  );
  expect(errorMessage).toBeInTheDocument();
});

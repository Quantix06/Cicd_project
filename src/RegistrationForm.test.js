import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegistrationForm from "./RegistrationForm";

// Mock the formStorage module with a jest.fn() accessible from tests
const mockSaveFormToDatabase = jest.fn();
jest.mock("./formStorage.js", () => ({
  saveFormToDatabase: (...args) => mockSaveFormToDatabase(...args),
}));

beforeEach(() => {
  mockSaveFormToDatabase.mockReset();
  mockSaveFormToDatabase.mockResolvedValue({ message: "OK", id: 1 });
});

// ===== Rendu des champs =====

test("renders the registration form title", () => {
  render(<RegistrationForm />);
  expect(screen.getByText("Inscription")).toBeInTheDocument();
});

test("renders the subtitle", () => {
  render(<RegistrationForm />);
  expect(screen.getByText("Remplissez vos informations personnelles")).toBeInTheDocument();
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

// ===== Validation des champs =====

test("check when the name contains special characters", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Dupont!" } });
  expect(screen.getByText("Le texte ne doit pas contenir de caractères spéciaux.")).toBeInTheDocument();
});

test("check the prenom contains special characters", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Jean!" } });
  expect(screen.getByText("Le texte ne doit pas contenir de caractères spéciaux.")).toBeInTheDocument();
});

test("check the ville contains special characters", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Ville"), { target: { value: "Paris!" } });
  expect(screen.getByText("Le texte ne doit pas contenir de caractères spéciaux.")).toBeInTheDocument();
});

test("check the date of birth is under 18", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Date de naissance"), { target: { value: "2015-01-01" } });
  expect(screen.getByText("Vous devez avoir au moins 18 ans pour vous inscrire.")).toBeInTheDocument();
});

test("check the date of birth is in the future", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Date de naissance"), { target: { value: "2050-01-01" } });
  expect(screen.getByText("La date de naissance ne peut pas être dans le futur.")).toBeInTheDocument();
});

test("check the postal code format is invalid", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Code postal"), { target: { value: "1234A" } });
  expect(screen.getByText("Le code postal doit contenir 5 chiffres.")).toBeInTheDocument();
});

test("check the email format is invalid", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Adresse e-mail"), { target: { value: "invalidemail" } });
  expect(screen.getByText("Le format de l'adresse e-mail est invalide.")).toBeInTheDocument();
});

// ===== Soumission du formulaire =====

function fillForm() {
  fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Dupont" } });
  fireEvent.change(screen.getByLabelText("Prénom"), { target: { value: "Jean" } });
  fireEvent.change(screen.getByLabelText("Adresse e-mail"), { target: { value: "jean.dupont@email.com" } });
  fireEvent.change(screen.getByLabelText("Date de naissance"), { target: { value: "1990-01-01" } });
  fireEvent.change(screen.getByLabelText("Ville"), { target: { value: "Paris" } });
  fireEvent.change(screen.getByLabelText("Code postal"), { target: { value: "75001" } });
}

test("check if the data is sent to the API when the form is submitted", async () => {
  render(<RegistrationForm />);
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

  await waitFor(() => {
    expect(mockSaveFormToDatabase).toHaveBeenCalledWith({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@email.com",
      dateNaissance: "1990-01-01",
      ville: "Paris",
      codePostal: "75001",
    });
  });
});

test("affiche le message de succès après soumission valide", async () => {
  render(<RegistrationForm />);
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

  await waitFor(() => {
    expect(screen.getByText(/formulaire envoyé avec succès/i)).toBeInTheDocument();
  });
});

test("affiche le message d'erreur serveur si l'API échoue (L72)", async () => {
  mockSaveFormToDatabase.mockRejectedValueOnce(new Error("Erreur de connexion au serveur"));
  render(<RegistrationForm />);
  fillForm();
  fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));

  await waitFor(() => {
    expect(screen.getByText(/erreur de connexion au serveur/i)).toBeInTheDocument();
  });
});

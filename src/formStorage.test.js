import { saveFormToLocalStorage } from "./formStorage";

describe("formStorage", () => {
  beforeEach(() => {
    // Nettoyage du localStorage avant chaque test
    localStorage.clear();
  });

  test("vérifie si les données sont correctement stockées dans le localStorage", () => {
    const mockFormData = {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@email.com",
      dateNaissance: "1990-01-01",
      ville: "Paris",
      codePostal: "75001",
    };

    saveFormToLocalStorage(mockFormData);

    const storedData = localStorage.getItem("registrationForm");
    expect(storedData).not.toBeNull();
    expect(JSON.parse(storedData)).toEqual(mockFormData);
  });
});

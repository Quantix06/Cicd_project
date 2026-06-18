import { saveFormToLocalStorage } from "./formStorage";

// Mock axios - use a stable reference that jest.mock can access
const mockAxiosPost = jest.fn();
const mockAxiosGet = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: () => ({
      post: (...args) => mockAxiosPost(...args),
      get: (...args) => mockAxiosGet(...args),
    }),
  },
}));

describe("saveFormToDatabase", () => {
  let saveFormToDatabase;

  beforeAll(() => {
    const mod = require("./formStorage");
    saveFormToDatabase = mod.saveFormToDatabase;
  });

  const mockFormData = {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    dateNaissance: "1990-01-01",
    ville: "Paris",
    codePostal: "75001",
  };

  beforeEach(() => {
    mockAxiosPost.mockReset();
    mockAxiosGet.mockReset();
  });

  test("appelle l'API avec les bonnes données", async () => {
    mockAxiosPost.mockResolvedValue({
      data: { message: "Utilisateur inscrit avec succès", id: 1 },
    });

    await saveFormToDatabase(mockFormData);

    expect(mockAxiosPost).toHaveBeenCalledWith("/register", mockFormData);
  });

  test("retourne les données de la réponse en cas de succès", async () => {
    const mockResponse = { message: "Utilisateur inscrit avec succès", id: 1 };
    mockAxiosPost.mockResolvedValue({ data: mockResponse });

    const result = await saveFormToDatabase(mockFormData);

    expect(result).toEqual(mockResponse);
  });

  test("lance une erreur avec le message du serveur", async () => {
    mockAxiosPost.mockRejectedValue({
      response: { data: { detail: "Cet email est déjà utilisé" } },
    });

    await expect(saveFormToDatabase(mockFormData)).rejects.toThrow(
      "Cet email est déjà utilisé"
    );
  });

  test("lance une erreur de connexion si pas de réponse serveur", async () => {
    mockAxiosPost.mockRejectedValue(new Error("Network Error"));

    await expect(saveFormToDatabase(mockFormData)).rejects.toThrow(
      "Erreur de connexion au serveur"
    );
  });

  test("lance une erreur générique si response.data existe mais sans 'detail' (L33)", async () => {
    mockAxiosPost.mockRejectedValue({
      response: { data: {} }, // data présent mais sans detail
    });

    await expect(saveFormToDatabase(mockFormData)).rejects.toThrow(
      "Erreur lors de l'inscription"
    );
  });
});

describe("saveFormToLocalStorage (deprecated)", () => {
  beforeEach(() => {
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

  test("vérifie si les données sont non correctes", () => {
    const storedData = localStorage.getItem("registrationForm");
    expect(storedData).toBeNull();
  });
});

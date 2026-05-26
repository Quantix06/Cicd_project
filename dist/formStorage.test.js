"use strict";

var _formStorage = require("./formStorage");
test("vérifie si les données sont correctement stockées dans le localStorage", () => {
  const mockFormData = {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    dateNaissance: "1990-01-01",
    ville: "Paris",
    codePostal: "75001"
  };
  (0, _formStorage.saveFormToLocalStorage)(mockFormData);
  const storedData = localStorage.getItem("registrationForm");
  expect(storedData).not.toBeNull();
  expect(JSON.parse(storedData)).toEqual(mockFormData);
});
/*pensez à ajouter un before each pour nettoyer le localStorage avant chaque test*/
beforeEach(() => {
  localStorage.clear();
});
test("vérifie si les données sont non correctes", () => {
  const storedData = localStorage.getItem("registrationForm");
  expect(storedData).toBeNull();
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveFormToLocalStorage = saveFormToLocalStorage;
function saveFormToLocalStorage(formData) {
  try {
    localStorage.setItem("registrationForm", JSON.stringify(formData));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans le localStorage :", error);
  }
}
import axios from "axios";

const port = process.env.REACT_APP_SERVER_PORT || 8000;
const api = axios.create({
  baseURL: `http://localhost:${port}`,
});

/**
 * Save form data to the database via API call.
 * @param {Object} formData - The registration form data
 * @returns {Promise} - The API response
 */
export async function saveFormToDatabase(formData) {
  try {
    const response = await api.post("/register", formData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Erreur lors de l'inscription");
    }
    throw new Error("Erreur de connexion au serveur");
  }
}

/**
 * @deprecated Use saveFormToDatabase instead
 */
export function saveFormToLocalStorage(formData) {
  try {
    localStorage.setItem("registrationForm", JSON.stringify(formData));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans le localStorage :", error);
  }
}

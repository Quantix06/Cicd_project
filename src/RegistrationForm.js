import React, { useState } from "react";
import { managetextinput } from "./formchecker.js";
function RegistrationForm() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    dateNaissance: "",
    ville: "",
    codePostal: "",
  });
  const [nomError, setNomError] = useState("");
  const [prenomError, setPrenomError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dateNaissanceError, setDateNaissanceError] = useState("");
  const [villeError, setVilleError] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errormsg = managetextinput(value);
    if (name === "nom") setNomError(errormsg);
    else if (name === "prenom") setPrenomError(errormsg);
    else if (name === "email") setEmailError(errormsg);
    else if (name === "dateNaissance") setDateNaissanceError(errormsg);
    else if (name === "ville") setVilleError(errormsg);
  };
    const handleChangeMail = (e) => {
    const { mail, value } = e.target;
    setFormData((prev) => ({ ...prev, [mail]: value }));
    const errormsg = checkemailformat(value);
    if (mail === "email") setEmailError(errormsg);
  };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis :", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="form-card">
      <h2>Inscription</h2>
      <p className="form-subtitle">Remplissez vos informations personnelles</p>

      <form onSubmit={handleSubmit} id="registration-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="champ_nom">Nom</label>
            <input
              type="text"
              id="champ_nom"
              name="nom"
              placeholder="Dupont"
              value={formData.nom}
              onChange={(e) => handleChange(e)}
              required
            />
            {nomError && (
              <span
                className="error-text"
                style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}
              >
                {nomError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="champ_prenom">Prénom</label>
            <input
              type="text"
              id="champ_prenom"
              name="prenom"
              placeholder="Jean"
              value={formData.prenom}
              onChange={(e) => handleChange(e)}
              required
            />
            {prenomError && (
              <span
                className="error-text"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  marginTop: "5px",
                  display: "block",
                }}
              >
                {prenomError}
              </span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="champ_adresse_email">Adresse e-mail</label>
            <input
              type="email"
              id="champ_adresse_email"
              name="email"
              placeholder="jean.dupont@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="champ_date_de_naissance">Date de naissance</label>
            <input
              type="date"
              id="champ_date_de_naissance"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="champ_ville">Ville</label>
            <input
              type="text"
              id="champ_ville"
              name="ville"
              placeholder="Paris"
              value={formData.ville}
              onChange={(e) => handleChange(e)}
              required
            />
            {villeError && (
              <span
                className="error-text"
                style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}
              >
                {villeError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="champ_code_postal">Code postal</label>
            <input
              type="text"
              id="champ_code_postal"
              name="codePostal"
              placeholder="75001"
              value={formData.codePostal}
              onChange={handleChange}
              pattern="[0-9]{5}"
              title="Le code postal doit contenir 5 chiffres"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Envoyer
        </button>

        {submitted && (
          <div className="success-message">
            ✓ Formulaire envoyé avec succès !
          </div>
        )}
      </form>
    </div>
  );
}

export default RegistrationForm;

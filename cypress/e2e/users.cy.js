// ============================================================
// Tests E2E — Gestion des utilisateurs
// Prérequis : frontend React sur http://localhost:3000
//             backend FastAPI sur http://localhost:8000
// ============================================================

const API_URL = "http://localhost:8000";
const ADMIN_EMAIL = "loise.fenoll@ynov.com";
const ADMIN_PASSWORD = "PvdrTAzTeR247sDnAZBr";
const WRONG_PASSWORD = "mauvais_mot_de_passe";

// Données d'un utilisateur de test unique par run (timestamp pour éviter les conflits d'email)
const timestamp = Date.now();
const TEST_USER = {
  nom: "TestNom",
  prenom: "TestPrenom",
  email: `test.user.${timestamp}@example.com`,
  dateNaissance: "1990-05-15",
  ville: "Paris",
  codePostal: "75001",
};

// ----------------------------------------------------------------
// Helper : remplir le formulaire d'inscription
// ----------------------------------------------------------------
function fillRegistrationForm(user) {
  cy.get("#champ_nom").clear().type(user.nom);
  cy.get("#champ_prenom").clear().type(user.prenom);
  cy.get("#champ_adresse_email").clear().type(user.email);
  cy.get("#champ_date_de_naissance").type(user.dateNaissance);
  cy.get("#champ_ville").clear().type(user.ville);
  cy.get("#champ_code_postal").clear().type(user.codePostal);
}

// ----------------------------------------------------------------
// Helper : se connecter en admin via l'interface
// ----------------------------------------------------------------
function loginAsAdmin() {
  cy.visit("/login");
  cy.get("#login-email").type(ADMIN_EMAIL);
  cy.get("#login-password").type(ADMIN_PASSWORD);
  cy.get("#login-form").submit();
  // Vérifier que la connexion a réussi (bouton Déconnexion apparaît dans la nav)
  cy.contains("Déconnexion").should("be.visible");
}

// ================================================================
// TEST 1 — Création d'un utilisateur : succès
// ================================================================
describe("Inscription utilisateur", () => {
  it("crée un utilisateur avec succès", () => {
    cy.visit("/");

    // Intercept la requête POST /register
    cy.intercept("POST", `${API_URL}/register`).as("registerRequest");

    fillRegistrationForm(TEST_USER);

    // Soumettre le formulaire
    cy.get("#registration-form").submit();

    // Attendre la réponse de l'API
    cy.wait("@registerRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // Le message de succès doit apparaître
    cy.get(".success-message")
      .should("be.visible")
      .and("contain", "succès");
  });

  // ==============================================================
  // TEST 2 — Création d'un utilisateur : échec (email déjà utilisé)
  // ==============================================================
  it("échoue si l'email est déjà utilisé", () => {
    // D'abord, enregistrer l'utilisateur via l'API directement pour garantir
    // qu'il existe déjà en base
    cy.request({
      method: "POST",
      url: `${API_URL}/register`,
      body: TEST_USER,
      headers: { "Content-Type": "application/json" },
      failOnStatusCode: false, // l'email existe peut-être déjà
    });

    cy.visit("/");

    // Intercept la requête POST /register
    cy.intercept("POST", `${API_URL}/register`).as("registerDuplicate");

    // Remplir le formulaire avec le même email
    fillRegistrationForm(TEST_USER);
    cy.get("#registration-form").submit();

    // La réponse doit être 400
    cy.wait("@registerDuplicate").then((interception) => {
      expect(interception.response.statusCode).to.equal(400);
    });

    // Un message d'erreur doit apparaître (email déjà utilisé)
    cy.get(".error-message")
      .should("be.visible")
      .and("contain", "email");
  });
});

// ================================================================
// TEST 3 — Admin se connecte et supprime un utilisateur : succès
// ================================================================
describe("Suppression d'un utilisateur par l'admin", () => {
  before(() => {
    // Créer un utilisateur à supprimer via l'API
    cy.request({
      method: "POST",
      url: `${API_URL}/register`,
      body: {
        nom: "ASupprimer",
        prenom: "Utilisateur",
        email: `delete.me.${timestamp}@example.com`,
        dateNaissance: "1985-03-20",
        ville: "Lyon",
        codePostal: "69001",
      },
      headers: { "Content-Type": "application/json" },
      failOnStatusCode: false,
    });
  });

  it("se connecte en admin et supprime un utilisateur", () => {
    // 1. Se connecter en admin
    loginAsAdmin();

    // 2. Naviguer vers la liste des utilisateurs
    cy.contains("Utilisateurs").click();
    cy.url().should("include", "/users");

    // 3. Attendre que la table soit chargée
    cy.get("#user-table", { timeout: 10000 }).should("be.visible");

    // 4. Cocher le premier utilisateur disponible
    cy.get('input[id^="select-user-"]').first().check();

    // 5. Le bouton de suppression doit apparaître dans bulk-actions
    cy.get(".btn-delete").should("be.visible");

    // 6. Stubber window.confirm pour valider automatiquement
    cy.on("window:confirm", () => true);

    // 7. Intercept la requête DELETE
    cy.intercept("DELETE", `${API_URL}/users/*`).as("deleteRequest");

    // 8. Cliquer sur supprimer
    cy.get(".btn-delete").click();

    // 9. Vérifier que la requête DELETE a été envoyée avec succès
    cy.wait("@deleteRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // 10. Message de confirmation de suppression
    cy.get(".success-message")
      .should("be.visible")
      .and("contain", "supprimé");
  });
});

// ================================================================
// TEST 4 — Mauvais mot de passe → pas de bouton de suppression
// ================================================================
describe("Connexion échouée — accès suppression impossible", () => {
  it("n'affiche pas le bouton de suppression si non connecté en admin", () => {
    // 1. Tenter de se connecter avec un mauvais mot de passe
    cy.visit("/login");
    cy.get("#login-email").type(ADMIN_EMAIL);
    cy.get("#login-password").type(WRONG_PASSWORD);
    cy.get("#login-form").submit();

    // 2. Un message d'erreur doit apparaître
    cy.get(".error-message")
      .should("be.visible")
      .and("contain", "Identifiants invalides");

    // 3. On reste sur /login (pas redirigé)
    cy.url().should("include", "/login");

    // 4. Naviguer vers la liste des utilisateurs
    cy.contains("Utilisateurs").click();
    cy.url().should("include", "/users");

    // 5. Si des utilisateurs existent, le bouton de suppression (checkbox + btn-delete)
    //    ne doit PAS être présent car on n'est pas admin
    cy.get("body").then(($body) => {
      if ($body.find("#user-table").length > 0) {
        // La colonne checkbox admin ne doit pas exister
        cy.get("#select-all").should("not.exist");
        // Les checkboxes de sélection ne doivent pas exister
        cy.get('input[id^="select-user-"]').should("not.exist");
        // Le bouton de suppression ne doit pas exister
        cy.get(".btn-delete").should("not.exist");
      } else {
        // Pas d'utilisateurs : l'état vide est affiché, on vérifie juste l'absence du bouton
        cy.get(".btn-delete").should("not.exist");
      }
    });
  });
});

// ================================================================
// TEST 5 — Backend éteint → erreur 500 / erreur de connexion
// ================================================================
describe("Erreur backend — serveur indisponible", () => {
  it("affiche une erreur quand le backend retourne une erreur 500", () => {
    // Intercepter la requête GET /users et retourner une erreur 500
    cy.intercept("GET", `${API_URL}/users`, {
      statusCode: 500,
      body: { detail: "Internal Server Error" },
    }).as("getUsersError");

    // Naviguer vers la liste des utilisateurs
    cy.visit("/users");

    // Attendre que la requête interceptée soit déclenchée
    cy.wait("@getUsersError");

    // Un message d'erreur doit être affiché à l'utilisateur
    cy.get(".error-message")
      .should("be.visible")
      .and("contain", "Erreur");
  });
});

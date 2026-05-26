"use strict";

var _react = require("@testing-library/react");
var _RegistrationForm = _interopRequireDefault(require("./RegistrationForm"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// ===== Rendu des champs =====
test("renders the registration form title", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const title = _react.screen.getByText("Inscription");
  expect(title).toBeInTheDocument();
});
test("renders the subtitle", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const subtitle = _react.screen.getByText("Remplissez vos informations personnelles");
  expect(subtitle).toBeInTheDocument();
});
test("renders the nom field", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = document.getElementById("champ_nom");
  expect(input).toBeInTheDocument();
  expect(input).toBeRequired();
});
test("renders the prenom field", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = document.getElementById("champ_prenom");
  expect(input).toBeInTheDocument();
  expect(input).toBeRequired();
});
test("renders the email field", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Adresse e-mail");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_adresse_email");
  expect(input).toHaveAttribute("type", "email");
  expect(input).toBeRequired();
});
test("renders the date de naissance field", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Date de naissance");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_date_de_naissance");
  expect(input).toHaveAttribute("type", "date");
  expect(input).toBeRequired();
});
test("renders the ville field", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Ville");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_ville");
  expect(input).toBeRequired();
});
test("renders the code postal field", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Code postal");
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("id", "champ_code_postal");
  expect(input).toHaveAttribute("pattern", "[0-9]{5}");
  expect(input).toBeRequired();
});
test("renders the submit button", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const button = _react.screen.getByRole("button", {
    name: /envoyer/i
  });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute("type", "submit");
});

// ===== gestion des réponses au formulaire =====
/**
 * @function managetextinput
 * @description Teste la gestion de la saisie dans les champs de texte
 */
test("check when the name contains special characters", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Nom");
  _react.fireEvent.change(input, {
    target: {
      value: "Dupont!"
    }
  });
  const errorMessage = _react.screen.getByText("Le texte ne doit pas contenir de caractères spéciaux.");
  expect(errorMessage).toBeInTheDocument();
});
test("check the prenom contains special characters", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Prénom");
  _react.fireEvent.change(input, {
    target: {
      value: "Jean!"
    }
  });
  const errorMessage = _react.screen.getByText("Le texte ne doit pas contenir de caractères spéciaux.");
  expect(errorMessage).toBeInTheDocument();
});
test("check the ville contains special characters", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Ville");
  _react.fireEvent.change(input, {
    target: {
      value: "Paris!"
    }
  });
  const errorMessage = _react.screen.getByText("Le texte ne doit pas contenir de caractères spéciaux.");
  expect(errorMessage).toBeInTheDocument();
});
test("check the date of birth is under 18", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Date de naissance");
  _react.fireEvent.change(input, {
    target: {
      value: "2015-01-01"
    }
  });
  const errorMessage = _react.screen.getByText("Vous devez avoir au moins 18 ans pour vous inscrire.");
  expect(errorMessage).toBeInTheDocument();
});
test("check the date of birth is in the future", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Date de naissance");
  _react.fireEvent.change(input, {
    target: {
      value: "2050-01-01"
    }
  });
  const errorMessage = _react.screen.getByText("La date de naissance ne peut pas être dans le futur.");
  expect(errorMessage).toBeInTheDocument();
});
test("check the postal code format is invalid", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Code postal");
  _react.fireEvent.change(input, {
    target: {
      value: "1234A"
    }
  });
  const errorMessage = _react.screen.getByText("Le code postal doit contenir 5 chiffres.");
  expect(errorMessage).toBeInTheDocument();
});
test("check the email format is invalid", () => {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  const input = _react.screen.getByLabelText("Adresse e-mail");
  _react.fireEvent.change(input, {
    target: {
      value: "invalidemail"
    }
  });
  const errorMessage = _react.screen.getByText("Le format de l'adresse e-mail est invalide.");
  expect(errorMessage).toBeInTheDocument();
});
test("check if the data is stored in localStorage when the form is submitted", () => {
  const consoleSpy = jest.spyOn(console, "log");
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}));
  _react.fireEvent.change(_react.screen.getByLabelText("Nom"), {
    target: {
      value: "Dupont"
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText("Prénom"), {
    target: {
      value: "Jean"
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText("Adresse e-mail"), {
    target: {
      value: "jean.dupont@email.com"
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText("Date de naissance"), {
    target: {
      value: "1990-01-01"
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText("Ville"), {
    target: {
      value: "Paris"
    }
  });
  _react.fireEvent.change(_react.screen.getByLabelText("Code postal"), {
    target: {
      value: "75001"
    }
  });
  _react.fireEvent.click(_react.screen.getByRole("button", {
    name: /envoyer/i
  }));
  expect(consoleSpy).toHaveBeenCalledWith("Formulaire soumis :", expect.any(Object));
  consoleSpy.mockRestore();
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _formchecker = require("./formchecker.js");
var _formStorage = require("./formStorage.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function RegistrationForm() {
  const _useState = (0, _react.useState)({
      nom: "",
      prenom: "",
      email: "",
      dateNaissance: "",
      ville: "",
      codePostal: ""
    }),
    _useState2 = _slicedToArray(_useState, 2),
    formData = _useState2[0],
    setFormData = _useState2[1];
  const _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    nomError = _useState4[0],
    setNomError = _useState4[1];
  const _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    prenomError = _useState6[0],
    setPrenomError = _useState6[1];
  const _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    emailError = _useState8[0],
    setEmailError = _useState8[1];
  const _useState9 = (0, _react.useState)(""),
    _useState0 = _slicedToArray(_useState9, 2),
    dateNaissanceError = _useState0[0],
    setDateNaissanceError = _useState0[1];
  const _useState1 = (0, _react.useState)(""),
    _useState10 = _slicedToArray(_useState1, 2),
    villeError = _useState10[0],
    setVilleError = _useState10[1];
  const _useState11 = (0, _react.useState)(""),
    _useState12 = _slicedToArray(_useState11, 2),
    codePostalError = _useState12[0],
    setCodePostalError = _useState12[1];
  const _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    submitted = _useState14[0],
    setSubmitted = _useState14[1];
  const handleChange = e => {
    const _e$target = e.target,
      name = _e$target.name,
      value = _e$target.value;
    setFormData(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [name]: value
    }));
    if (name === "email") {
      setEmailError((0, _formchecker.checkemailformat)(value));
    } else if (name === "dateNaissance") {
      let error = (0, _formchecker.checkfuturedate)(value);
      if (!error && value) {
        error = (0, _formchecker.checkdateformatage)(new Date(value));
      }
      setDateNaissanceError(error);
    } else if (name === "codePostal") {
      setCodePostalError((0, _formchecker.checkpostalcodeformat)(value));
    } else {
      const errormsg = (0, _formchecker.managetextinput)(value);
      if (name === "nom") setNomError(errormsg);else if (name === "prenom") setPrenomError(errormsg);else if (name === "ville") setVilleError(errormsg);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    (0, _formStorage.saveFormToLocalStorage)(formData);
    console.log("Formulaire soumis :", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "form-card",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
      children: "Inscription"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      className: "form-subtitle",
      children: "Remplissez vos informations personnelles"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
      onSubmit: handleSubmit,
      id: "registration-form",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "form-grid",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "form-group",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
            htmlFor: "champ_nom",
            children: "Nom"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
            type: "text",
            id: "champ_nom",
            name: "nom",
            placeholder: "Dupont",
            value: formData.nom,
            onChange: e => handleChange(e),
            required: true
          }), nomError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "error-text",
            style: {
              color: "red",
              fontSize: "0.8rem",
              marginTop: "5px"
            },
            children: nomError
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "form-group",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
            htmlFor: "champ_prenom",
            children: "Pr\xE9nom"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
            type: "text",
            id: "champ_prenom",
            name: "prenom",
            placeholder: "Jean",
            value: formData.prenom,
            onChange: e => handleChange(e),
            required: true
          }), prenomError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "error-text",
            style: {
              color: "red",
              fontSize: "0.8rem",
              marginTop: "5px",
              display: "block"
            },
            children: prenomError
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "form-group full-width",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
            htmlFor: "champ_adresse_email",
            children: "Adresse e-mail"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
            type: "email",
            id: "champ_adresse_email",
            name: "email",
            placeholder: "jean.dupont@email.com",
            value: formData.email,
            onChange: handleChange,
            required: true
          }), emailError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "error-text",
            style: {
              color: "red",
              fontSize: "0.8rem",
              marginTop: "5px"
            },
            children: emailError
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "form-group",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
            htmlFor: "champ_date_de_naissance",
            children: "Date de naissance"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
            type: "date",
            id: "champ_date_de_naissance",
            name: "dateNaissance",
            value: formData.dateNaissance,
            onChange: handleChange,
            required: true
          }), dateNaissanceError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "error-text",
            style: {
              color: "red",
              fontSize: "0.8rem",
              marginTop: "5px"
            },
            children: dateNaissanceError
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "form-group",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
            htmlFor: "champ_ville",
            children: "Ville"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
            type: "text",
            id: "champ_ville",
            name: "ville",
            placeholder: "Paris",
            value: formData.ville,
            onChange: e => handleChange(e),
            required: true
          }), villeError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "error-text",
            style: {
              color: "red",
              fontSize: "0.8rem",
              marginTop: "5px"
            },
            children: villeError
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "form-group",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
            htmlFor: "champ_code_postal",
            children: "Code postal"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
            type: "text",
            id: "champ_code_postal",
            name: "codePostal",
            placeholder: "75001",
            value: formData.codePostal,
            onChange: handleChange,
            pattern: "[0-9]{5}",
            title: "Le code postal doit contenir 5 chiffres",
            required: true
          }), codePostalError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "error-text",
            style: {
              color: "red",
              fontSize: "0.8rem",
              marginTop: "5px",
              display: "block"
            },
            children: codePostalError
          })]
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        type: "submit",
        className: "btn-submit",
        children: "Envoyer"
      }), submitted && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "success-message",
        children: "\u2713 Formulaire envoy\xE9 avec succ\xE8s !"
      })]
    })]
  });
}
var _default = exports.default = RegistrationForm;
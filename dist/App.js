"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _logo = _interopRequireDefault(require("./logo.svg"));
require("./App.css");
var _RegistrationForm = _interopRequireDefault(require("./RegistrationForm"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function App() {
  // 1. Logique et État
  const _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    count = _useState2[0],
    setCount = _useState2[1];
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };

  // 2. Rendu
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "App",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("header", {
      className: "App-header",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
        src: _logo.default,
        className: "App-logo",
        alt: "logo"
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "counter-section",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
          children: ["Compteur actuel : ", /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            "data-testid": "count",
            children: count
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
          onClick: incrementCount,
          className: "btn-primary",
          children: "Click me"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_RegistrationForm.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("a", {
        className: "App-link",
        href: "https://reactjs.org",
        target: "_blank",
        rel: "noopener noreferrer",
        children: "Learn React"
      })]
    })
  });
}
var _default = exports.default = App;
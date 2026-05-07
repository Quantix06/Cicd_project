export function managetextinput(text) {
  //const specialCharRegex = /[^a-zA-ZÀ-ÿ\s-]/;
  if (text.match(/[^a-zA-Z\s]/)) {
    return "Le texte ne doit pas contenir de caractères spéciaux.";
  }

  return "";
}

export function checkemailformat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Le format de l'adresse e-mail est invalide.";
  }
  return "";
}

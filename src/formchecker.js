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

export function checkdateformatage(date) {
  let age = Math.abs(new Date().getUTCFullYear() - date.getUTCFullYear());
  if (age < 18) {
    return "Vous devez avoir au moins 18 ans pour vous inscrire.";
  }
  return "";
}

export function checkfuturedate(date) {
  const today = new Date();
  const inputDate = new Date(date);
  if (inputDate > today) {
    return "La date de naissance ne peut pas être dans le futur.";
  }
  return "";
}
export function checkpostalcodeformat(postalCode) {
  const postalCodeRegex = /^\d{5}$/;
  if (!postalCodeRegex.test(postalCode)) {
    return "Le code postal doit contenir 5 chiffres.";
  }
  return "";
}

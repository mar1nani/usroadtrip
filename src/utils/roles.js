const ROLE_EMAILS = {
  "marouanenani@gmail.com": "marouane",
  "sureau.isabelle1@gmail.com": "isabelle",
};

// Non connecté (ou email non reconnu) = invité, accès restreint. Seuls les
// deux emails ci-dessus donnent accès complet — l'authentification Supabase
// étant maintenant active en production, on ne peut plus se permettre de
// retomber sur "marouane" par défaut (ça exposait ses données à qui ouvrait
// le lien sans être connecté).
export function roleForUser(user) {
  if (!user) return "guest";
  const email = user.email?.toLowerCase();
  return ROLE_EMAILS[email] || "guest";
}

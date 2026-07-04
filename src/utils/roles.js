const ROLE_EMAILS = {
  "marouanenani@gmail.com": "marouane",
  "sureau.isabelle1@gmail.com": "isabelle",
};

// Non connecté (ou Supabase pas encore configuré) = comportement actuel de
// l'app, pas un mode invité verrouillé — voir le plan pour le raisonnement.
export function roleForUser(user) {
  if (!user) return "marouane";
  const email = user.email?.toLowerCase();
  return ROLE_EMAILS[email] || "guest";
}

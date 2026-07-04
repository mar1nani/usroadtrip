import { supabase } from "./client";

export async function signInWithPassword(email, password) {
  if (!supabase) throw new Error("Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// Envoie un email avec un lien de récupération — sert à la fois pour "mot de
// passe oublié" et pour définir un premier mot de passe (les comptes créés
// avant ce changement n'en avaient pas). Le clic établit une session
// temporaire ("PASSWORD_RECOVERY") détectée dans AuthContext.
export async function sendPasswordReset(email) {
  if (!supabase) throw new Error("Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).");
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if (error) throw error;
}

// Fonctionne aussi bien en session normale (changer son mot de passe) qu'en
// session de récupération (le définir pour la première fois).
export async function updatePassword(password) {
  if (!supabase) throw new Error("Supabase n'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export function onAuthStateChange(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null, event);
  });
  return () => data.subscription.unsubscribe();
}

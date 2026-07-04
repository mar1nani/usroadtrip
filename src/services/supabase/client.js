import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null si les variables d'env sont absentes : auth.js et supabaseSync.js
// deviennent alors des no-op silencieux, l'app tourne comme avant.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

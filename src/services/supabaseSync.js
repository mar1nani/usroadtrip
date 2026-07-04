import { supabase } from "./supabase/client";
import { getCurrentUser } from "./supabase/auth";
import { getCached, getCachedUpdatedAt, setCachedWithTimestamp } from "./offline/localCache";

const DOMAINS = ["day_progress", "reservations", "shopping", "settings"];

export async function pullAll(userId) {
  for (const domain of DOMAINS) {
    const { data: row } = await supabase
      .from("user_data")
      .select("data, updated_at")
      .eq("user_id", userId)
      .eq("domain", domain)
      .maybeSingle();
    if (!row) continue;

    const localUpdatedAt = await getCachedUpdatedAt(domain);
    if (!localUpdatedAt || new Date(row.updated_at) > new Date(localUpdatedAt)) {
      await setCachedWithTimestamp(domain, row.data, row.updated_at);
    }
  }
}

export async function pushAll(userId) {
  for (const domain of DOMAINS) {
    const localUpdatedAt = await getCachedUpdatedAt(domain);
    if (!localUpdatedAt) continue;

    const { data: row } = await supabase
      .from("user_data")
      .select("updated_at")
      .eq("user_id", userId)
      .eq("domain", domain)
      .maybeSingle();

    if (!row || new Date(localUpdatedAt) > new Date(row.updated_at)) {
      const value = await getCached(domain);
      await supabase.from("user_data").upsert({ user_id: userId, domain, data: value, updated_at: localUpdatedAt });
    }
  }
}

export async function syncAll() {
  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) return;
  try {
    await pushAll(user.id);
    await pullAll(user.id);
  } catch (e) {
    console.warn("Sync Supabase échouée, réessai au prochain déclenchement :", e);
  }
}

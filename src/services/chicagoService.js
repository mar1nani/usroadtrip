import { getCached, setCached } from "./offline/localCache";

const KEY = "chicago_progress";

// Progression indépendante du road trip principal (clé localCache séparée) :
// { [stopId]: { checked: bool, note: string } }
export async function loadChicagoProgress() {
  return getCached(KEY, {});
}

export async function saveChicagoStopPatch(stopId, patch) {
  const all = await loadChicagoProgress();
  const current = all[stopId] || { checked: false, note: "" };
  const updated = { ...all, [stopId]: { ...current, ...patch } };
  await setCached(KEY, updated);
  return updated;
}

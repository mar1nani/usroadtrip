import { getCached, setCached } from "./offline/localCache";

const KEY = "day_progress";

export function defaultDayEntry() {
  return {
    checks: {},
    rating: 0,
    photo: "",
    weather: "",
    temp: "",
    notes: { shared: "", marouane: "", isabelle: "" },
    spend: { shared: {}, marouane: {}, isabelle: {} },
  };
}

// Ramène une entrée éventuellement à l'ancien format (note: string, spend
// plat) vers le nouveau format scopé, sans perdre les données existantes.
function normalizeEntry(raw) {
  if (!raw) return defaultDayEntry();

  const notes =
    raw.notes && typeof raw.notes === "object"
      ? { shared: "", marouane: "", isabelle: "", ...raw.notes }
      : { shared: raw.note || "", marouane: "", isabelle: "" };

  const spend =
    raw.spend && ("shared" in raw.spend || "marouane" in raw.spend || "isabelle" in raw.spend)
      ? { shared: {}, marouane: {}, isabelle: {}, ...raw.spend }
      : { shared: raw.spend || {}, marouane: {}, isabelle: {} };

  return {
    checks: raw.checks || {},
    rating: raw.rating || 0,
    photo: raw.photo || "",
    weather: raw.weather || "",
    temp: raw.temp || "",
    notes,
    spend,
  };
}

// Toutes les entrées, indexées par "d"+numéroDuJour (ex: "d1") — format brut,
// pas forcément normalisé (utilisé par les agrégations dans utils/spend.js).
export async function loadDayProgress() {
  return getCached(KEY, {});
}

export async function getDayEntry(dayNumber) {
  const all = await loadDayProgress();
  return normalizeEntry(all["d" + dayNumber]);
}

export async function saveDayPatch(dayNumber, patch) {
  const all = await loadDayProgress();
  const dayKey = "d" + dayNumber;
  const current = normalizeEntry(all[dayKey]);
  const updated = { ...all, [dayKey]: { ...current, ...patch } };
  await setCached(KEY, updated);
  return updated;
}

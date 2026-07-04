import { getCached, setCached } from "./offline/localCache";
import defaultSettings from "../data/settingsDefaults.json";

const KEY = "settings";

export async function loadSettings() {
  return getCached(KEY, defaultSettings);
}

export async function saveSettingsPatch(patch) {
  const current = await loadSettings();
  const next = { ...current, ...patch };
  await setCached(KEY, next);
  return next;
}

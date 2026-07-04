import Dexie from "dexie";

// Cache local simple : une seule table clé/valeur (pas de schéma par domaine,
// pas de flags "dirty"/queue — un objet par domaine suffit pour cette app).
const db = new Dexie("roadtripUsaCache");
db.version(1).stores({
  kv: "key",
});

export async function getCached(key, fallback) {
  const row = await db.kv.get(key);
  return row ? row.value : fallback;
}

export async function setCached(key, value) {
  await db.kv.put({ key, value, updatedAt: new Date().toISOString() });
  return value;
}

export async function getCachedUpdatedAt(key) {
  const row = await db.kv.get(key);
  return row ? row.updatedAt : null;
}

// Utilisé uniquement par la synchro Supabase lors d'un pull : réécrit l'entrée
// avec l'horodatage du serveur (pas "maintenant"), sinon la valeur tirée
// paraîtrait plus récente localement et serait repoussée pour rien au sync suivant.
export async function setCachedWithTimestamp(key, value, updatedAt) {
  await db.kv.put({ key, value, updatedAt });
  return value;
}

// Réinitialisation complète (bouton "Réinitialiser les données" dans Paramètres).
export async function clearAll() {
  await db.kv.clear();
}

export default db;

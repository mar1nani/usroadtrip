import DAYS from "../data/days.json";
import CHICAGO_DAYS from "../data/chicagoPreTrip.json";

export const SPEND_CATS = [
  ["fuel", "⛽", "Essence"],
  ["food", "🛒", "Courses"],
  ["camp", "🏕️", "Camping"],
  ["fun", "🎟️", "Activités"],
  ["misc", "🔧", "Autres"],
];

export const BUDGET_PLAN = 4700;

// Pseudo-jours pour agréger les dépenses du pré-roadtrip Chicago (clés
// "dchi0"/"dchi1"/"dchi2" dans day_progress) avec les 22 jours du road trip
// dans les mêmes totaux (Budget, Statistiques, Accueil).
export const CHICAGO_SPEND_DAYS = CHICAGO_DAYS.map((d) => ({ n: `chi${d.day}` }));
export const ALL_SPEND_DAYS = [...DAYS, ...CHICAGO_SPEND_DAYS];

// Additionne les 3 scopes (shared/marouane/isabelle) pour obtenir le budget
// global partagé — reste compatible avec l'ancien format plat (pré-scoping).
export function computeSpendByCat(progress, days) {
  const byCat = {};
  SPEND_CATS.forEach(([k]) => (byCat[k] = 0));
  days.forEach((d) => {
    const spend = (progress["d" + d.n] || {}).spend;
    if (!spend) return;
    const isScoped = "shared" in spend || "marouane" in spend || "isabelle" in spend;
    const buckets = isScoped ? [spend.shared, spend.marouane, spend.isabelle] : [spend];
    buckets.forEach((sp) => {
      if (!sp) return;
      SPEND_CATS.forEach(([k]) => (byCat[k] += parseFloat(sp[k]) || 0));
    });
  });
  return byCat;
}

export function computeSpendTotal(byCat) {
  return Object.values(byCat).reduce((a, b) => a + b, 0);
}

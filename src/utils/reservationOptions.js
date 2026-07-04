export const CATEGORY_OPTIONS = [
  { value: "voiture", label: "🚗 Voiture" },
  { value: "hotel", label: "🏨 Hôtel" },
  { value: "camping", label: "🏕️ Camping" },
  { value: "parc", label: "🏞️ Parc national" },
  { value: "restaurant", label: "🍽️ Restaurant" },
  { value: "activite", label: "🎟️ Activité" },
  { value: "billet", label: "🎫 Billet" },
  { value: "autre", label: "📌 Autre" },
];

export const STATUS_OPTIONS = [
  { value: "a_reserver", label: "À réserver", color: "#e0542a" },
  { value: "reserve", label: "Réservé", color: "#3a8f5c" },
  { value: "annule", label: "Annulé", color: "#767b93" },
];

export function categoryLabel(value) {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label || value;
}

export function statusMeta(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];
}

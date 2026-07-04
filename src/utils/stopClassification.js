// Heuristique par mots-clés — pas une vraie taxonomie, juste assez pour
// choisir une icône cohérente à partir du texte libre des arrêts existants.
const PARK_KEYWORDS = [
  "national park",
  "national monument",
  "canyon",
  "arches",
  "yellowstone",
  "yosemite",
  "monument valley",
  "teton",
  "devils tower",
  "badlands",
  "canyonlands",
];
const CAMPING_KEYWORDS = ["campground", "camping", "camp ", "blm", "national forest"];
const CITY_KEYWORDS = ["downtown", "city", "square", "strip"];

export function classifyStop(text) {
  const t = (text || "").toLowerCase();

  if (PARK_KEYWORDS.some((k) => t.includes(k))) {
    return { icon: "🏞️", label: "Parc national" };
  }
  if (CAMPING_KEYWORDS.some((k) => t.includes(k))) {
    return { icon: "🏕️", label: "Camping" };
  }
  if (CITY_KEYWORDS.some((k) => t.includes(k))) {
    return { icon: "🏙️", label: "Ville" };
  }
  return { icon: "📍", label: "Attraction" };
}

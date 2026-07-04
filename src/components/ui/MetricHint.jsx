import { C } from "../../styles/theme";

// Petit rappel de conversion (miles → km) affiché à côté d'une distance —
// jamais utilisé pour l'argent (dollars uniquement, sur demande explicite).
export default function MetricHint({ miles, style }) {
  if (!miles) return null;
  const km = Math.round(miles * 1.60934);
  return (
    <span style={{ fontSize: 10, color: C.dim, ...style }}>
      (≈ {km.toLocaleString()} km)
    </span>
  );
}

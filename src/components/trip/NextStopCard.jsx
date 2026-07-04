import { C } from "../../styles/theme";
import DAYS from "../../data/days.json";
import MAP_PTS from "../../data/mapPoints.json";
import MetricHint from "../ui/MetricHint";
import WeatherPill from "../ui/WeatherPill";

// Distance/temps repris directement de days.json (vraie distance routière
// planifiée pour ce jour), plus fiable qu'un calcul à vol d'oiseau.
// `idx` = jour actif (0-based, ex: 0 tant que St. Louis n'est pas atteint) —
// DAYS[idx] est donc la PROCHAINE étape, pas DAYS[idx+1].
export default function NextStopCard({ idx }) {
  const next = DAYS[idx];
  const pt = MAP_PTS[idx];

  if (!next) {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.gold}`, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 13, color: C.gold, fontWeight: 700 }}>🏁 Toutes les étapes sont atteintes</div>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.gold}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>
        Next stop
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 16, color: C.cream, fontWeight: 700 }}>{next.to}</div>
        {pt && <WeatherPill lat={pt.lat} lon={pt.lon} />}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 13, color: C.gold, fontWeight: 600 }}>
        <span>
          📍 {next.miles} mi <MetricHint miles={next.miles} style={{ color: C.dim, fontWeight: 500 }} />
        </span>
        <span>⏱ {next.drive}</span>
      </div>
    </div>
  );
}

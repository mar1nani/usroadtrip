import Modal from "../ui/Modal";
import { C } from "../../styles/theme";
import { classifyStop } from "../../utils/stopClassification";
import { usStateName } from "../../utils/usStateNames";

export default function StateStopsPanel({ stateAb, days, mapPoints, onClose }) {
  const stops = mapPoints.filter((p) => p.st === stateAb).sort((a, b) => a.n - b.n);

  return (
    <Modal open={!!stateAb} onClose={onClose} title={stateAb ? `📍 ${usStateName(stateAb)}` : ""}>
      {stops.length === 0 ? (
        <div style={{ fontSize: 13, color: C.dim, textAlign: "center", padding: "20px 0" }}>
          Aucune étape du road trip dans cet État.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {stops.map((mp) => {
            const day = days.find((d) => d.n === mp.n);
            return (
              <div key={mp.n}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: C.gold,
                      color: "#1a1200",
                      fontSize: 11,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {mp.n}
                  </span>
                  <span style={{ fontSize: 14, color: C.cream, fontWeight: 700 }}>{mp.label}</span>
                </div>
                {day && (
                  <div style={{ display: "grid", gap: 5, paddingLeft: 30 }}>
                    {day.stops.map((stopText, i) => {
                      const { icon } = classifyStop(stopText);
                      return (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, color: C.dim, lineHeight: 1.4 }}>
                          <span>{icon}</span>
                          <span>{stopText}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

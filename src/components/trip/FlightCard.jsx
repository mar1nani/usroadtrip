import { useEffect, useState } from "react";
import { C } from "../../styles/theme";
import { loadFlights, isLegFilled } from "../../services/flightsService";

function formatDuration(departureUtc, arrivalUtc) {
  const ms = new Date(arrivalUtc) - new Date(departureUtc);
  const totalMinutes = Math.round(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h${m ? String(m).padStart(2, "0") : ""}`;
}

function FlightLeg({ leg, label }) {
  if (!isLegFilled(leg)) {
    return (
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>
          ✈️ {label}
        </div>
        <div style={{ fontSize: 12.5, color: C.dim }}>Vol non renseigné — à compléter dans Paramètres</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
          ✈️ {label}
        </div>
        <div style={{ fontSize: 12, color: C.dim }}>{leg.displayDate}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: "0 0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 20, color: C.cream, fontWeight: 800 }}>{leg.departure.airportCode}</div>
          <div style={{ fontSize: 15, color: C.gold, fontWeight: 700, marginTop: 2 }}>{leg.departure.time}</div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, padding: "0 6px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.gold}, ${C.line})` }} />
          <span style={{ fontSize: 14 }}>✈️</span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.line}, ${C.gold})` }} />
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
        </div>
        <div style={{ flex: "0 0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 20, color: C.cream, fontWeight: 800 }}>{leg.arrival.airportCode}</div>
          <div style={{ fontSize: 15, color: C.gold, fontWeight: 700, marginTop: 2 }}>{leg.arrival.time}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.dim, marginTop: 4 }}>
        <span>{leg.departure.airportName}</span>
        <span>{leg.arrival.airportName}</span>
      </div>

      <div style={{ textAlign: "center", fontSize: 10.5, color: C.dim, marginTop: 6 }}>
        Durée ≈ {formatDuration(leg.departure.utc, leg.arrival.utc)}
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
        <span style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.cream }}>
          {leg.flightNumber}
        </span>
        <span style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.cream }}>
          {leg.class}
        </span>
        <span style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.cream }}>
          🍽️ {leg.meals.join(", ")}
        </span>
      </div>
    </div>
  );
}

export default function FlightCard({ scope, compact = false }) {
  const [flights, setFlights] = useState(null);

  useEffect(() => {
    loadFlights().then((all) => setFlights(all[scope]));
  }, [scope]);

  if (!flights) return null;

  if (compact) {
    const leg = flights.outbound;
    return (
      <div style={{ background: C.card, border: `1px solid ${C.gold}`, borderRadius: 12, padding: "12px 14px" }}>
        <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>
          ✈️ Mon vol
        </div>
        {isLegFilled(leg) ? (
          <div style={{ fontSize: 13.5, color: C.cream, fontWeight: 700 }}>
            {leg.departure.airportCode} → {leg.arrival.airportCode}
            <span style={{ color: C.gold }}> · {leg.departure.time}</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: C.dim }}>Non renseigné</div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.gold}`,
        borderRadius: 12,
        padding: 18,
        boxShadow: "0 6px 18px rgba(0,0,0,.35)",
      }}
    >
      <FlightLeg leg={flights.outbound} label="Aller" />
      <div style={{ margin: "16px 0", borderTop: `1px dashed ${C.line}`, position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: -9,
            transform: "translateX(-50%)",
            background: C.card,
            padding: "0 8px",
            fontSize: 11,
            color: C.dim,
          }}
        >
          ✂
        </span>
      </div>
      <FlightLeg leg={flights.return} label="Retour" />
    </div>
  );
}

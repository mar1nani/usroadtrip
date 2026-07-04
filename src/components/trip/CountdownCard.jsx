import { useEffect, useState } from "react";
import { C } from "../../styles/theme";
import defaultFlights from "../../data/flights.json";
import { isLegFilled } from "../../services/flightsService";
import { TRIP_START, TRIP_DAYS_COUNT, tripStatus, daysUntil } from "../../utils/dateUtils";

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const LABEL_STYLE = {
  fontSize: 12,
  color: C.dim,
  textTransform: "uppercase",
  letterSpacing: 2,
  fontWeight: 700,
};

// `flights` = { outbound, return } du scope courant (voir usePermissions).
// Si un vol n'est pas encore renseigné (ex: Isabelle avant saisie), on
// retombe sur les données par défaut (vol de Marouane) plutôt que de planter.
export default function CountdownCard({ effectiveIndex = 0, flights, compact = false }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const outbound = isLegFilled(flights?.outbound) ? flights.outbound : defaultFlights.outbound;
  const returnLeg = isLegFilled(flights?.return) ? flights.return : defaultFlights.return;
  const flightDepartureUtc = new Date(outbound.departure.utc);
  const returnDepartureUtc = new Date(returnLeg.departure.utc);

  const status = tripStatus(new Date(), flightDepartureUtc, returnDepartureUtc);

  if (compact) {
    const COMPACT = {
      "before-flight": { label: "Avant ton vol", value: `J-${daysUntil(flightDepartureUtc)}` },
      "flight-day": { label: "✈️ Jour du vol", value: `${outbound.departure.airportCode} → ${outbound.arrival.airportCode}` },
      pretrip: { label: "À Chicago", value: `J-${daysUntil(TRIP_START)}` },
      during: { label: "🚗 En route", value: `Jour ${effectiveIndex + 1}/${TRIP_DAYS_COUNT}` },
      "return-countdown": { label: "Avant le retour", value: `J-${daysUntil(returnDepartureUtc)}` },
      after: { label: "Voyage", value: "🏁 Terminé" },
    };
    const c = COMPACT[status];
    return (
      <div style={{ background: C.card, border: `1px solid ${C.gold}`, borderRadius: 12, padding: "12px 14px" }}>
        <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>
          {c.label}
        </div>
        <div style={{ fontSize: 18, color: C.gold, fontWeight: 800 }}>{c.value}</div>
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
      {status === "before-flight" && (
        <>
          <div style={LABEL_STYLE}>Avant ton vol</div>
          <div style={{ fontSize: 30, color: C.gold, fontWeight: 800, margin: "4px 0" }}>
            J-{daysUntil(flightDepartureUtc)}
          </div>
          <div style={{ fontSize: 13, color: C.cream }}>
            ✈️ {outbound.flightNumber} · {outbound.departure.airportCode} → {outbound.arrival.airportCode}
          </div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>
            {outbound.displayDate} · décollage {outbound.departure.time}
          </div>
        </>
      )}
      {status === "flight-day" && (
        <>
          <div style={LABEL_STYLE}>✈️ Jour du vol</div>
          <div style={{ fontSize: 22, color: C.gold, fontWeight: 800, margin: "4px 0" }}>
            {outbound.departure.airportCode} → {outbound.arrival.airportCode}
          </div>
          <div style={{ fontSize: 13, color: C.cream }}>
            {outbound.flightNumber} · décollage {outbound.departure.time}
          </div>
        </>
      )}
      {status === "pretrip" && (
        <>
          <div style={LABEL_STYLE}>À Chicago · pré-roadtrip</div>
          <div style={{ fontSize: 30, color: C.gold, fontWeight: 800, margin: "4px 0" }}>
            J-{daysUntil(TRIP_START)}
          </div>
          <div style={{ fontSize: 13, color: C.cream }}>
            Road trip · Jour 1 le {DATE_FMT.format(TRIP_START)}
          </div>
        </>
      )}
      {status === "during" && (
        <>
          <div style={LABEL_STYLE}>🚗 Road trip en cours</div>
          <div style={{ fontSize: 30, color: C.gold, fontWeight: 800, margin: "4px 0" }}>
            Jour {effectiveIndex + 1} / {TRIP_DAYS_COUNT}
          </div>
        </>
      )}
      {status === "return-countdown" && (
        <>
          <div style={LABEL_STYLE}>Avant le vol retour</div>
          <div style={{ fontSize: 30, color: C.gold, fontWeight: 800, margin: "4px 0" }}>
            J-{daysUntil(returnDepartureUtc)}
          </div>
          <div style={{ fontSize: 13, color: C.cream }}>
            ✈️ {returnLeg.flightNumber} · {returnLeg.departure.airportCode} → {returnLeg.arrival.airportCode}
          </div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>
            {returnLeg.displayDate} · décollage {returnLeg.departure.time}
          </div>
        </>
      )}
      {status === "after" && (
        <div style={{ fontSize: 22, color: C.gold, fontWeight: 800 }}>🏁 Voyage terminé</div>
      )}
    </div>
  );
}

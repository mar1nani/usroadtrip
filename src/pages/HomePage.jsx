import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DAYS from "../data/days.json";
import MAP_PTS from "../data/mapPoints.json";
import CHICAGO_DAYS from "../data/chicagoPreTrip.json";
import defaultFlights from "../data/flights.json";
import { C } from "../styles/theme";
import { tripStatus, tripDateRangeFromFlights } from "../utils/dateUtils";
import { countTotalStops, countDoneStops, countDaysStarted, countDayDone } from "../utils/progress";
import { BUDGET_PLAN, computeSpendByCat, computeSpendTotal, ALL_SPEND_DAYS } from "../utils/spend";
import { loadDayProgress } from "../services/dayProgressService";
import { loadFlights, isLegFilled } from "../services/flightsService";
import { loadChicagoProgress } from "../services/chicagoService";
import { useCarPosition } from "../hooks/useCarPosition";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { useTripProgress } from "../hooks/useTripProgress";
import { usePermissions } from "../hooks/usePermissions";
import RoleGuard from "../components/auth/RoleGuard";
import WavingFlag from "../components/trip/WavingFlag";
import FlightCard from "../components/trip/FlightCard";
import CountdownCard from "../components/trip/CountdownCard";
import CurrentLocationCard from "../components/trip/CurrentLocationCard";
import NextStopCard from "../components/trip/NextStopCard";
import InteractiveTripMap from "../components/trip/InteractiveTripMap";
import DayCard from "../components/trip/DayCard";

const ROLE_LABELS = { marouane: "MAROUANE", isabelle: "ISABELLE", guest: "INVITÉ" };

const RANGE_FMT = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" });
const RANGE_FMT_YEAR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function HomePage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [userFlights, setUserFlights] = useState(null);
  const [chicagoProgress, setChicagoProgress] = useState(null);
  const status = tripStatus();
  const carPoint = useCarPosition();
  const { location, status: locationStatus } = useCurrentLocation();
  const { effectiveIndex: todayIdx, started, confirmDay } = useTripProgress();
  const { role, scope } = usePermissions();

  useEffect(() => {
    loadDayProgress().then(setProgress);
    loadChicagoProgress().then(setChicagoProgress);
  }, []);

  useEffect(() => {
    loadFlights().then((all) => setUserFlights(all[scope] || all.marouane));
  }, [scope]);

  const outboundLeg = isLegFilled(userFlights?.outbound) ? userFlights.outbound : defaultFlights.outbound;
  const returnLeg = isLegFilled(userFlights?.return) ? userFlights.return : defaultFlights.return;
  const tripRange = tripDateRangeFromFlights({ outbound: outboundLeg, return: returnLeg });

  const chicagoTotal = CHICAGO_DAYS.reduce((s, d) => s + d.stops.length, 0);
  const chicagoDone = chicagoProgress
    ? CHICAGO_DAYS.reduce((s, d) => s + d.stops.filter((st) => (chicagoProgress[st.id] || {}).checked).length, 0)
    : 0;
  const chicagoTile = { n: "🏙️", date: "19-21 août", to: "Chicago, IL", from: "", miles: 0, drive: "", img: undefined, stops: Array(chicagoTotal).fill(0) };

  const totalStops = countTotalStops(DAYS);
  const doneStops = countDoneStops(progress, DAYS);
  const pct = totalStops ? Math.round((doneStops / totalStops) * 100) : 0;
  const daysWithProgress = countDaysStarted(progress, DAYS);

  const spendByCat = computeSpendByCat(progress, ALL_SPEND_DAYS);
  const spendTotal = computeSpendTotal(spendByCat);
  const spendPct = Math.min(Math.round((spendTotal / BUDGET_PLAN) * 100), 100);

  function goToDay(i) {
    navigate(`/days/${DAYS[i].n}`);
  }

  return (
    <div className="fadein" style={{ minHeight: "100vh" }}>
      <div
        style={{
          position: "relative",
          background: "linear-gradient(180deg,#0e1a44 0%,#0a1130 60%,#080d20 100%)",
          borderBottom: `1px solid ${C.gold}`,
          padding: "34px 18px 26px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg,${C.red} 0%,${C.red} 33%,#f4efe0 33%,#f4efe0 66%,${C.blue} 66%,${C.blue} 100%)`,
            opacity: 0.9,
          }}
        />
        <WavingFlag />
        <div style={{ fontSize: 11, letterSpacing: 6, color: C.gold, textTransform: "uppercase", fontWeight: 600 }}>
          Carnet de Voyage
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(24px,5.5vw,38px)",
            color: "#faf4e2",
            margin: "8px 0 6px",
            fontWeight: 700,
            letterSpacing: 1,
            textShadow: "0 2px 20px rgba(212,175,55,.25)",
          }}
        >
          Road Trip USA
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "4px 0 8px" }}>
          <span style={{ height: 1, width: 44, background: `linear-gradient(90deg,transparent,${C.gold})` }} />
          <span style={{ color: C.gold, fontSize: 12 }}>✦</span>
          <span style={{ height: 1, width: 44, background: `linear-gradient(90deg,${C.gold},transparent)` }} />
        </div>
        <div style={{ fontSize: 13, color: C.dim, letterSpacing: 0.5 }}>
          {tripRange.totalDays} jours · Route 66 → Far West → Yellowstone
        </div>
        <div style={{ fontSize: 12.5, color: C.gold, marginTop: 6, letterSpacing: 1, fontWeight: 600 }}>
          {RANGE_FMT.format(tripRange.arrival)} — {RANGE_FMT_YEAR.format(tripRange.departure)}
        </div>
        <button
          onClick={() => navigate("/settings")}
          title="Voir mon compte / me connecter"
          style={{
            display: "inline-block",
            marginTop: 10,
            background: "rgba(212,175,55,.12)",
            border: `1px solid ${C.gold}`,
            borderRadius: 20,
            padding: "3px 14px",
            fontSize: 11,
            letterSpacing: 1.5,
            color: C.gold,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          👤 {ROLE_LABELS[role]}
        </button>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg,${C.blue} 0%,${C.blue} 33%,#f4efe0 33%,#f4efe0 66%,${C.red} 66%,${C.red} 100%)`,
            opacity: 0.85,
          }}
        />
      </div>

      <div style={{ maxWidth: 1900, margin: "0 auto", padding: "18px 20px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
          <div style={{ flex: "0 1 320px", minWidth: 260, display: "grid", gap: 12 }}>
            <NextStopCard idx={todayIdx} />
            <RoleGuard allow={["marouane", "isabelle"]}>
              <FlightCard scope={scope} compact />
            </RoleGuard>
            <CountdownCard effectiveIndex={todayIdx} flights={userFlights} compact />
            <CurrentLocationCard location={location} status={locationStatus} />
            <RoleGuard allow={["marouane", "isabelle"]}>
              <div style={{ background: C.card, border: `1px solid ${C.gold}`, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>
                  💰 Mes dépenses
                </div>
                <div style={{ fontSize: 18, color: C.gold, fontWeight: 800 }}>${Math.round(spendTotal).toLocaleString()}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{spendPct}% du budget prévu</div>
              </div>
            </RoleGuard>
          </div>

          <div style={{ flex: "1 1 480px", minWidth: 320 }}>
            <InteractiveTripMap points={MAP_PTS} idx={todayIdx} onPick={goToDay} carPoint={carPoint} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontSize: 14, color: C.cream, fontWeight: 700 }}>Ma progression</div>
              <div style={{ fontSize: 22, color: C.gold, fontWeight: 800 }}>{pct}%</div>
            </div>
            <div style={{ background: "#000", borderRadius: 20, height: 14, overflow: "hidden", border: `1px solid ${C.line}` }}>
              <div
                style={{
                  width: pct + "%",
                  height: "100%",
                  background: `linear-gradient(90deg,#a5812c,${C.gold},#f0d066)`,
                  borderRadius: 20,
                  transition: "width .5s",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: C.dim, flexWrap: "wrap", gap: 6 }}>
              <span>✅ {doneStops} / {totalStops} lieux visités</span>
              <span>🗓️ {daysWithProgress} / 22 jours entamés</span>
            </div>
          </div>

          {started ? (
            <button
              onClick={() => goToDay(todayIdx)}
              style={{
                width: "100%",
                background: `linear-gradient(135deg,${C.gold},#9a7420)`,
                border: "none",
                borderRadius: 12,
                padding: "18px",
                cursor: "pointer",
                color: "#1a1200",
                textAlign: "left",
                boxShadow: "0 4px 14px rgba(200,153,46,.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.7, fontWeight: 700 }}>
                {status === "during" ? "Aujourd'hui" : "En route"}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
                Jour {DAYS[todayIdx].n} · {DAYS[todayIdx].date}
              </div>
              <div style={{ fontSize: 14, marginTop: 3, opacity: 0.85 }}>
                {DAYS[todayIdx].from} → {DAYS[todayIdx].to}
              </div>
              <div style={{ fontSize: 13, marginTop: 10, fontWeight: 700 }}>
                {status === "during" ? "Ouvrir cette étape →" : "Voir cette étape →"}
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                confirmDay(0);
                navigate("/days/1");
              }}
              style={{
                width: "100%",
                background: `linear-gradient(135deg,${C.gold},#9a7420)`,
                border: "none",
                borderRadius: 12,
                padding: "18px",
                cursor: "pointer",
                color: "#1a1200",
                textAlign: "left",
                boxShadow: "0 4px 14px rgba(200,153,46,.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.7, fontWeight: 700 }}>
                Actuellement à Chicago (pré-roadtrip)
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>🚀 Je démarre mon trip</div>
              <div style={{ fontSize: 14, marginTop: 3, opacity: 0.85 }}>
                Confirme quand tu quittes Chicago pour St. Louis (Jour 1) →
              </div>
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg,transparent,${C.line})` }} />
          <span style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 3, fontWeight: 600 }}>
            ★ Les 22 étapes ★
          </span>
          <span style={{ height: 1, flex: 1, background: `linear-gradient(90deg,${C.line},transparent)` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
          <DayCard
            day={chicagoTile}
            doneCount={chicagoDone}
            isToday={!started}
            onClick={() => navigate("/chicago")}
          />
          {DAYS.map((d, i) => (
            <DayCard
              key={d.n}
              day={d}
              doneCount={countDayDone(progress, d)}
              isToday={started && i === todayIdx}
              onClick={() => goToDay(i)}
            />
          ))}
        </div>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: C.dim, lineHeight: 1.6 }}>
          💾 Ta progression, tes notes, tes étoiles et tes photos sont sauvegardées automatiquement sur cet appareil.
          <br />
          Photos libres de droits : Wikimedia Commons.
        </div>
      </div>
    </div>
  );
}

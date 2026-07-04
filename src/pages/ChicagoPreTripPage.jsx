import { useEffect, useState } from "react";
import CHICAGO_DAYS from "../data/chicagoPreTrip.json";
import { C } from "../styles/theme";
import Card from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import Stars from "../components/trip/Stars";
import { loadChicagoProgress, saveChicagoStopPatch } from "../services/chicagoService";
import { getDayEntry, saveDayPatch, loadDayProgress } from "../services/dayProgressService";
import { computeSpendByCat, computeSpendTotal, SPEND_CATS, ALL_SPEND_DAYS } from "../utils/spend";
import { usePermissions } from "../hooks/usePermissions";
import { CHICAGO_COORDS } from "../utils/gps";
import WeatherPill from "../components/ui/WeatherPill";

export default function ChicagoPreTripPage() {
  const [progress, setProgress] = useState(null);
  const [dayEntries, setDayEntries] = useState(null); // { [day.day]: entrée normalisée (rating/notes/spend) }
  const [rawProgress, setRawProgress] = useState(null); // day_progress brut, pour le total global
  const { scope, canEdit } = usePermissions();

  useEffect(() => {
    loadChicagoProgress().then(setProgress);
    loadDayProgress().then(setRawProgress);
    Promise.all(CHICAGO_DAYS.map((d) => getDayEntry(`chi${d.day}`))).then((entries) => {
      const map = {};
      CHICAGO_DAYS.forEach((d, i) => (map[d.day] = entries[i]));
      setDayEntries(map);
    });
  }, []);

  if (!progress || !dayEntries || !rawProgress) return <LoadingState />;

  const totalStops = CHICAGO_DAYS.reduce((s, d) => s + d.stops.length, 0);
  const doneStops = CHICAGO_DAYS.reduce(
    (s, d) => s + d.stops.filter((st) => (progress[st.id] || {}).checked).length,
    0
  );

  const grandTotal = computeSpendTotal(computeSpendByCat(rawProgress, ALL_SPEND_DAYS));

  async function toggleStop(stopId, checked) {
    const next = await saveChicagoStopPatch(stopId, { checked });
    setProgress(next);
  }

  async function noteStop(stopId, note) {
    const next = await saveChicagoStopPatch(stopId, { note });
    setProgress(next);
  }

  async function updateChicagoDay(dayNum, patch) {
    const allRaw = await saveDayPatch(`chi${dayNum}`, patch);
    setRawProgress(allRaw);
    const entry = await getDayEntry(`chi${dayNum}`);
    setDayEntries((prev) => ({ ...prev, [dayNum]: entry }));
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 18, color: C.gold, fontWeight: 700 }}>🏙️ Chicago — Pré-Roadtrip</div>
          <WeatherPill lat={CHICAGO_COORDS.lat} lon={CHICAGO_COORDS.lon} />
        </div>
        <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>
          19-21 août · sans voiture · {doneStops} / {totalStops} étapes faites
        </div>
      </div>

      {CHICAGO_DAYS.map((day) => {
        const ds = dayEntries[day.day];
        const note = (ds.notes && ds.notes[scope]) || "";
        const spend = (ds.spend && ds.spend[scope]) || {};
        const dayTotal = SPEND_CATS.reduce((s, [k]) => s + (parseFloat(spend[k]) || 0), 0);

        return (
          <div key={day.day} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>
              {day.date} — {day.title}
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
              {day.stops.map((stop) => {
                const st = progress[stop.id] || { checked: false, note: "" };
                return (
                  <Card key={stop.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div
                      onClick={() => toggleStop(stop.id, !st.checked)}
                      style={{
                        flexShrink: 0,
                        marginTop: 2,
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: `2px solid ${st.checked ? C.gold : "#556088"}`,
                        background: st.checked ? C.gold : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      {st.checked && <span style={{ color: "#0a1130", fontSize: 14, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 14, color: st.checked ? C.dim : C.cream, fontWeight: 600, textDecoration: st.checked ? "line-through" : "none" }}>
                          {stop.name}
                        </div>
                        <div style={{ fontSize: 11, color: C.gold, whiteSpace: "nowrap" }}>
                          {stop.time} · {stop.duration}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{stop.note}</div>
                      <input
                        value={st.note}
                        onChange={(e) => noteStop(stop.id, e.target.value)}
                        placeholder="Ta note personnelle..."
                        style={{ width: "100%", marginTop: 6, background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 6, padding: "6px 9px", color: C.cream, fontSize: 12.5 }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>

            {(day.wildlife || day.movies || day.sleep) && (
              <div style={{ marginBottom: 10, display: "grid", gap: 8 }}>
                {day.sleep && (
                  <div style={{ background: "linear-gradient(135deg,#122150,#0e1838)", border: "1px solid #2a3c6e", borderRadius: 9, padding: "11px 13px" }}>
                    <div style={{ fontSize: 11, color: "#d4af37", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>🛏️ Où dormir</div>
                    <div style={{ fontSize: 13, color: "#f4efe0", fontWeight: 600 }}>{day.sleep.spot}</div>
                    <div style={{ fontSize: 11, color: "#c9a94a" }}>{day.sleep.type}</div>
                    <div style={{ fontSize: 11, color: "#93a0c8", marginTop: 3 }}>{day.sleep.notes}</div>
                  </div>
                )}
                {day.wildlife && (
                  <div style={{ background: "#101a3a", border: "1px solid #2a3c6e", borderRadius: 9, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#c9a94a", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>🦌 Animaux à repérer</div>
                    {day.wildlife.map((w, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#cbd3ea", padding: "2px 0", lineHeight: 1.4 }}>
                        • {w}
                      </div>
                    ))}
                  </div>
                )}
                {day.movies && (
                  <div style={{ background: "linear-gradient(135deg,#1a1236,#140f28)", border: "1px solid #3a2f5e", borderRadius: 9, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#c3a6e8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>🎬 Lieux de tournage</div>
                    {day.movies.map((m, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#d6c8ee", padding: "2px 0", lineHeight: 1.4 }}>
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 14px", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: C.cream, fontWeight: 600 }}>Ma note de la journée</span>
              <Stars value={ds.rating || 0} onChange={canEdit ? (v) => updateChicagoDay(day.day, { rating: v }) : () => {}} />
            </div>

            {canEdit && (
              <>
                <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>
                  ✍️ Mes notes & souvenirs
                </div>
                <textarea
                  value={note}
                  onChange={(e) => updateChicagoDay(day.day, { notes: { ...ds.notes, [scope]: e.target.value } })}
                  placeholder="Écris ici ce que tu as vécu, mangé, ressenti aujourd'hui..."
                  style={{ width: "100%", minHeight: 80, background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12, color: C.cream, fontSize: 14, lineHeight: 1.6, resize: "vertical", marginBottom: 14 }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>💸 Mes dépenses du jour</div>
                  <div style={{ fontSize: 16, color: C.gold, fontWeight: 800 }}>${dayTotal.toFixed(0)}</div>
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "6px 12px" }}>
                  {SPEND_CATS.map(([k, emo, lbl]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.accent}` }}>
                      <span style={{ fontSize: 13, color: C.cream }}>{emo} {lbl}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: C.dim, fontSize: 13 }}>$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={spend[k] || ""}
                          onChange={(e) =>
                            updateChicagoDay(day.day, {
                              spend: { ...ds.spend, [scope]: { ...spend, [k]: e.target.value.replace(/[^0-9.]/g, "") } },
                            })
                          }
                          placeholder="0"
                          style={{ width: 70, textAlign: "right", background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 6, padding: "6px 8px", color: C.gold, fontSize: 14, fontWeight: 600 }}
                        />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0 4px", fontSize: 13 }}>
                    <span style={{ color: C.dim }}>💰 Total dépensé depuis le début (tous voyageurs)</span>
                    <span style={{ color: "#d4af37", fontWeight: 700 }}>${grandTotal.toFixed(0)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

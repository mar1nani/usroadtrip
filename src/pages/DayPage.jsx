import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DAYS from "../data/days.json";
import MAP_PTS from "../data/mapPoints.json";
import { C } from "../styles/theme";
import MetricHint from "../components/ui/MetricHint";
import WeatherPill from "../components/ui/WeatherPill";
import { getDayEntry, saveDayPatch, loadDayProgress } from "../services/dayProgressService";
import { computeSpendByCat, computeSpendTotal, ALL_SPEND_DAYS } from "../utils/spend";
import { resizeImageFile } from "../utils/imageResize";
import { useTripProgress } from "../hooks/useTripProgress";
import { usePermissions } from "../hooks/usePermissions";
import Stars from "../components/trip/Stars";

const WEATHER_OPTIONS = [
  ["☀️", "Soleil"],
  ["⛅", "Nuageux"],
  ["🌧️", "Pluie"],
  ["⛈️", "Orage"],
  ["🌫️", "Brume"],
  ["❄️", "Froid"],
];
const SPEND_FIELDS = [
  ["fuel", "⛽ Essence"],
  ["food", "🛒 Courses"],
  ["camp", "🏕️ Camping"],
  ["fun", "🎟️ Activités"],
  ["misc", "🔧 Autres"],
];

export default function DayPage() {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const idx = DAYS.findIndex((d) => d.n === Number(dayNumber));
  const day = DAYS[idx];
  const pt = MAP_PTS[idx];

  const [ds, setDs] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);
  const { effectiveIndex, confirmDay } = useTripProgress();
  const { scope, canEdit } = usePermissions();

  useEffect(() => {
    if (!day) return;
    getDayEntry(day.n).then(setDs);
    loadDayProgress().then((progress) => {
      const byCat = computeSpendByCat(progress, ALL_SPEND_DAYS);
      setGrandTotal(computeSpendTotal(byCat));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayNumber]);

  if (!day) {
    return (
      <div style={{ padding: 20, color: C.cream }}>
        Jour introuvable. <button onClick={() => navigate("/")}>Retour à l'accueil</button>
      </div>
    );
  }

  if (!ds) return null; // chargement du cache local, quasi instantané

  async function updateDay(patch) {
    const updatedAll = await saveDayPatch(day.n, patch);
    setDs(updatedAll["d" + day.n]);
    const byCat = computeSpendByCat(updatedAll, DAYS);
    setGrandTotal(computeSpendTotal(byCat));
  }

  function toggleCheck(i) {
    const checks = { ...(ds.checks || {}) };
    checks[i] = !checks[i];
    updateDay({ checks });
  }

  async function onPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await resizeImageFile(file);
    updateDay({ photo: dataUrl });
  }

  const checks = ds.checks || {};
  const dayDone = Object.values(checks).filter(Boolean).length;
  const spend = (ds.spend && ds.spend[scope]) || {};
  const note = (ds.notes && ds.notes[scope]) || "";
  const dayTotal = SPEND_FIELDS.reduce((s, [k]) => s + (parseFloat(spend[k]) || 0), 0);

  return (
    <div className="fadein" style={{ minHeight: "100vh", maxWidth: 920, margin: "0 auto", paddingBottom: 80 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{ background: C.accent, border: `1px solid ${C.line}`, color: C.cream, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13 }}
        >
          ← Accueil
        </button>
        <div style={{ fontSize: 13, color: C.gold, fontWeight: 700 }}>Jour {day.n} / 22</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            disabled={idx === 0}
            onClick={() => navigate(`/days/${DAYS[idx - 1].n}`)}
            style={{ background: idx === 0 ? "#0d1636" : C.accent, border: `1px solid ${C.line}`, color: idx === 0 ? "#444" : C.cream, borderRadius: 8, padding: "7px 12px", cursor: idx === 0 ? "default" : "pointer", fontSize: 14 }}
          >
            ◀
          </button>
          <button
            disabled={idx === 21}
            onClick={() => navigate(`/days/${DAYS[idx + 1].n}`)}
            style={{ background: idx === 21 ? "#0d1636" : C.accent, border: `1px solid ${C.line}`, color: idx === 21 ? "#4a5578" : C.cream, borderRadius: 8, padding: "7px 12px", cursor: idx === 21 ? "default" : "pointer", fontSize: 14 }}
          >
            ▶
          </button>
        </div>
      </div>

      <div style={{ padding: "10px 14px 0" }}>
        {!canEdit ? (
          <div
            style={{
              background: "#0e1838",
              border: `1px solid ${C.line}`,
              borderRadius: 9,
              padding: "10px 14px",
              fontSize: 13,
              color: C.dim,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {effectiveIndex > idx ? "✓ Étape terminée" : "Étape à venir"} · lecture seule
          </div>
        ) : effectiveIndex > idx ? (
          <button
            onClick={() => confirmDay(idx)}
            title="Cliquer pour décocher cette étape"
            style={{
              width: "100%",
              background: "#0e1838",
              border: `1px solid ${C.gold}`,
              borderRadius: 9,
              padding: "10px 14px",
              fontSize: 13,
              color: C.gold,
              fontWeight: 700,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            ✓ Étape confirmée terminée · toucher pour décocher
          </button>
        ) : (
          <button
            onClick={() => confirmDay(day.n)}
            style={{
              width: "100%",
              background: `linear-gradient(135deg,${C.gold},#9a7420)`,
              border: "none",
              borderRadius: 9,
              padding: "12px 14px",
              color: "#1a1200",
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            📍 J'ai terminé cette étape → passer à la suivante
          </button>
        )}
      </div>

      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "linear-gradient(135deg,#3a2f18,#1a1a1f)", marginTop: 10 }}>
        <img src={day.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.target.style.display = "none")} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,13,15,.95),rgba(13,13,15,.1) 60%)" }} />
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <div style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>
            {day.date} ·{" "}
            {day.miles > 0 ? (
              <>
                {day.miles} mi <MetricHint miles={day.miles} style={{ color: "#e0c98a" }} /> · {day.drive}
              </>
            ) : (
              "Sur place"
            )}
          </div>
          <div style={{ fontSize: 19, color: "#fff", fontWeight: 800, lineHeight: 1.2, marginTop: 2, textShadow: "0 2px 8px #000" }}>
            {day.from} → {day.to}
          </div>
          {day.tag && <div style={{ fontSize: 12, color: "#e8d8b0", fontStyle: "italic", marginTop: 2 }}>{day.tag}</div>}
        </div>
      </div>

      <div style={{ padding: "16px 14px" }}>
        {day.warn && (
          <div style={{ background: "#1e0e00", border: "1px solid #a05000", borderRadius: 8, padding: "9px 12px", marginBottom: 14, fontSize: 12, color: "#e0954a", lineHeight: 1.5 }}>
            {day.warn}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 14px", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: C.cream, fontWeight: 600 }}>Ma note de la journée</span>
          <Stars value={ds.rating || 0} onChange={canEdit ? (v) => updateDay({ rating: v }) : () => {}} />
        </div>

        {pt && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 14px", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: C.dim }}>🌤️ En ce moment à {day.to.split(",")[0]}</span>
            <WeatherPill lat={pt.lat} lon={pt.lon} />
          </div>
        )}

        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "11px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>
            🌡️ Météo du jour (souvenir)
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 8 }}>
            {WEATHER_OPTIONS.map(([emo, lbl]) => (
              <button
                key={lbl}
                disabled={!canEdit}
                onClick={() => updateDay({ weather: ds.weather === emo ? "" : emo })}
                title={lbl}
                style={{
                  background: ds.weather === emo ? C.gold : C.accent,
                  border: `1px solid ${ds.weather === emo ? C.gold : C.line}`,
                  borderRadius: 8,
                  padding: "6px 10px",
                  cursor: canEdit ? "pointer" : "default",
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                {emo}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="text"
              inputMode="numeric"
              disabled={!canEdit}
              value={ds.temp || ""}
              onChange={(e) => updateDay({ temp: e.target.value })}
              placeholder="Température"
              style={{ flex: 1, background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.cream, fontSize: 14 }}
            />
            <span style={{ fontSize: 13, color: C.dim }}>°C / °F</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Lieux à visiter</div>
          <div style={{ fontSize: 12, color: C.dim }}>
            {dayDone}/{day.stops.length} coché{dayDone > 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          {day.stops.map((st, i) => {
            const on = !!checks[i];
            const q = encodeURIComponent(st.split("–")[0].split("(")[0].trim() + " USA");
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 7 }}>
                <div
                  onClick={canEdit ? () => toggleCheck(i) : undefined}
                  style={{
                    flex: 1,
                    display: "flex",
                    gap: 11,
                    alignItems: "flex-start",
                    background: on ? "#16264f" : C.card,
                    border: `1px solid ${on ? "#d4af37" : C.line}`,
                    borderRadius: 9,
                    padding: "11px 12px",
                    cursor: canEdit ? "pointer" : "default",
                    transition: "all .15s",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `2px solid ${on ? "#d4af37" : "#556088"}`,
                      background: on ? "#d4af37" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 1,
                    }}
                  >
                    {on && <span style={{ color: "#0a1130", fontSize: 14, fontWeight: 900 }}>✓</span>}
                  </div>
                  <div style={{ fontSize: 13.5, color: on ? "#f0e2b8" : C.cream, lineHeight: 1.5 }}>{st}</div>
                </div>
                <a
                  href={"https://www.google.com/maps/search/?api=1&query=" + q}
                  target="_blank"
                  rel="noreferrer"
                  title="Ouvrir dans Google Maps"
                  style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 44, background: C.card, border: `1px solid ${C.line}`, borderRadius: 9, textDecoration: "none", fontSize: 18 }}
                >
                  📍
                </a>
              </div>
            );
          })}
        </div>

        {canEdit && (
          <>
            <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>
              📸 Ma photo souvenir
            </div>
            <div style={{ marginBottom: 16 }}>
              {ds.photo ? (
                <div style={{ position: "relative" }}>
                  <img src={ds.photo} alt="souvenir" style={{ width: "100%", borderRadius: 10, maxHeight: 280, objectFit: "cover" }} />
                  <button
                    onClick={() => updateDay({ photo: "" })}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.7)", border: "none", color: "#fff", borderRadius: 20, width: 30, height: 30, cursor: "pointer", fontSize: 15 }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ display: "block", background: C.card, border: `2px dashed ${C.line}`, borderRadius: 10, padding: "22px", textAlign: "center", cursor: "pointer", color: C.dim, fontSize: 13 }}>
                  📷 Toucher pour ajouter une photo
                  <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
                </label>
              )}
            </div>

            <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>
              ✍️ Mes notes & souvenirs
            </div>
            <textarea
              value={note}
              onChange={(e) => updateDay({ notes: { ...ds.notes, [scope]: e.target.value } })}
              placeholder="Écris ici ce que tu as vécu, mangé, ressenti aujourd'hui..."
              style={{ width: "100%", minHeight: 90, background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12, color: C.cream, fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
            />

            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>💸 Mes dépenses du jour</div>
                <div style={{ fontSize: 16, color: C.gold, fontWeight: 800 }}>${dayTotal.toFixed(0)}</div>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "6px 12px" }}>
                {SPEND_FIELDS.map(([k, lbl]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.accent}` }}>
                    <span style={{ fontSize: 13, color: C.cream }}>{lbl}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: C.dim, fontSize: 13 }}>$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={spend[k] || ""}
                        onChange={(e) =>
                          updateDay({
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
              <div style={{ fontSize: 11, color: C.dim, marginTop: 6, textAlign: "center" }}>
                Budget prévu total : ~$4 700 · note tes vraies dépenses pour suivre l'écart
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
          <div style={{ background: "linear-gradient(135deg,#122150,#0e1838)", border: "1px solid #2a3c6e", borderRadius: 9, padding: "11px 13px" }}>
            <div style={{ fontSize: 11, color: "#d4af37", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>🛏️ Où dormir</div>
            <div style={{ fontSize: 13, color: "#f4efe0", fontWeight: 600 }}>{day.sleep.spot}</div>
            <div style={{ fontSize: 11, color: "#c9a94a" }}>{day.sleep.type}</div>
            <div style={{ fontSize: 11, color: "#93a0c8", marginTop: 3 }}>{day.sleep.notes}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 9, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>🛒 Courses</div>
              <div style={{ fontSize: 12, color: C.cream, lineHeight: 1.4 }}>{day.groceries}</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 9, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>⛽ Essence</div>
              <div style={{ fontSize: 12, color: C.cream }}>{day.fuel}</div>
            </div>
          </div>
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
              <div style={{ fontSize: 11, color: "#c3a6e8", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>🎬 Films tournés ici</div>
              {day.movies.map((m, i) => (
                <div key={i} style={{ fontSize: 12, color: "#d6c8ee", padding: "2px 0", lineHeight: 1.4 }}>
                  {m}
                </div>
              ))}
            </div>
          )}
          {day.dark && (
            <div style={{ background: "#0c1330", border: "1px solid #2a3c6e", borderRadius: 9, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "#8fa4e0", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>✨ Ciel étoilé</div>
              <div style={{ fontSize: 12, color: "#b8c6ec" }}>{day.dark}</div>
            </div>
          )}
          {day.pray && (
            <div style={{ background: "linear-gradient(135deg,#122150,#0e1838)", border: "1px solid #2a3c6e", borderRadius: 9, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "#d4af37", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                🕌 Prières ({day.pray.zone})
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
                {[["Fajr", day.pray.fajr], ["Dhuhr", day.pray.dhuhr], ["Asr", day.pray.asr], ["Maghrib", day.pray.maghrib], ["Isha", day.pray.isha]].map(
                  ([nm, t]) => (
                    <div key={nm} style={{ textAlign: "center", background: "#0a1130", borderRadius: 5, padding: "5px 2px", border: "1px solid #1e2f5a" }}>
                      <div style={{ fontSize: 9, color: "#c9a94a" }}>{nm}</div>
                      <div style={{ fontSize: 11, color: "#f4efe0", fontWeight: 600 }}>{t}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            disabled={idx === 0}
            onClick={() => {
              navigate(`/days/${DAYS[idx - 1].n}`);
              window.scrollTo(0, 0);
            }}
            style={{ flex: 1, background: idx === 0 ? "#0d1636" : C.accent, border: `1px solid ${C.line}`, color: idx === 0 ? "#444" : C.cream, borderRadius: 10, padding: 13, cursor: idx === 0 ? "default" : "pointer", fontSize: 13, fontWeight: 600 }}
          >
            ◀ Jour {idx > 0 ? DAYS[idx - 1].n : "-"}
          </button>
          <button
            disabled={idx === 21}
            onClick={() => {
              navigate(`/days/${DAYS[idx + 1].n}`);
              window.scrollTo(0, 0);
            }}
            style={{ flex: 1, background: idx === 21 ? "#0d1636" : `linear-gradient(135deg,#f0d066,${C.gold},#9a7420)`, border: "none", color: idx === 21 ? "#444" : "#1a1200", borderRadius: 10, padding: 13, cursor: idx === 21 ? "default" : "pointer", fontSize: 13, fontWeight: 700 }}
          >
            Jour {idx < 21 ? DAYS[idx + 1].n : "-"} ▶
          </button>
        </div>
      </div>
    </div>
  );
}

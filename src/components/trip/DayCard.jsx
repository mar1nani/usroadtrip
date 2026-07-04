import { C } from "../../styles/theme";
import MetricHint from "../ui/MetricHint";

export default function DayCard({ day, doneCount, isToday, onClick }) {
  const all = day.stops.length;
  const complete = doneCount >= all && all > 0;
  const started = doneCount > 0;
  const pctDay = all ? (doneCount / all) * 100 : 0;

  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        background: C.card,
        border: `1px solid ${isToday ? C.gold : complete ? "#b98f2e" : C.line}`,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        textAlign: "left",
        boxShadow: isToday
          ? "0 0 0 1px rgba(212,175,55,.4), 0 10px 26px rgba(0,0,0,.45)"
          : "0 6px 18px rgba(0,0,0,.35)",
        transition: "transform .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={{ height: 118, overflow: "hidden", background: "#0f1a3c", position: "relative" }}>
        <img
          src={day.img}
          alt=""
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: started ? 1 : 0.7,
            filter: started ? "none" : "saturate(.7)",
          }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.background = "linear-gradient(135deg,#1c2c58,#0e1838)";
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(16,26,58,.96) 0%,rgba(16,26,58,.35) 45%,rgba(16,26,58,0) 75%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: isToday
              ? "linear-gradient(135deg,#f0d066,#c8992e)"
              : "rgba(10,17,48,.82)",
            border: `1.5px solid ${C.gold}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.5)",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: isToday ? "#0a1130" : C.gold, lineHeight: 1 }}>
            {day.n}
          </span>
        </div>
        {complete && (
          <div
            style={{
              position: "absolute",
              top: 9,
              right: 9,
              background: "linear-gradient(135deg,#f0d066,#c8992e)",
              color: "#0a1130",
              borderRadius: 20,
              padding: "2px 8px",
              fontSize: 11,
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(0,0,0,.5)",
            }}
          >
            ★ Fait
          </div>
        )}
        {isToday && !complete && (
          <div
            style={{
              position: "absolute",
              top: 9,
              right: 9,
              background: C.red,
              color: "#fff",
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 9,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Ici
          </div>
        )}
        <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }}>
          <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: 0.5, textShadow: "0 1px 4px #000" }}>
            {day.date}
          </div>
          <div style={{ fontSize: 13.5, color: "#faf4e2", fontWeight: 700, lineHeight: 1.25, textShadow: "0 2px 6px #000" }}>
            {day.to}
          </div>
        </div>
      </div>
      <div style={{ padding: "9px 11px 11px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: C.dim, letterSpacing: 0.5 }}>
            {day.miles > 0 ? (
              <>
                {day.miles} mi <MetricHint miles={day.miles} /> · {day.drive}
              </>
            ) : (
              "Sur place"
            )}
          </span>
          <span style={{ fontSize: 10, color: complete ? C.gold : C.dim, fontWeight: 700 }}>
            {doneCount}/{all} ★
          </span>
        </div>
        <div style={{ background: "#0a1130", borderRadius: 10, height: 6, overflow: "hidden", border: "1px solid #1e2f5a" }}>
          <div
            style={{
              width: pctDay + "%",
              height: "100%",
              background: complete
                ? "linear-gradient(90deg,#c8992e,#f0d066)"
                : "linear-gradient(90deg,#a5812c,#d4af37)",
              transition: "width .4s",
            }}
          />
        </div>
      </div>
    </button>
  );
}

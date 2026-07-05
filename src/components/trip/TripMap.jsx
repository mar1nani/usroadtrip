import { useMemo, useState } from "react";
import statesData from "../../data/states.json";
import { pathBoundingBox } from "../../utils/geometry";
import { useIsMobile } from "../../hooks/useIsMobile";
import CarIcon from "./CarIcon";

const STATES = statesData;
const CHI = { x: 612.7, y: 207.9 };
const VIEW_W = 900;
const VIEW_H = 560;

function computeZoomTransform(stateAb) {
  if (!stateAb) return { tx: 0, ty: 0, scale: 1 };
  const state = STATES.find((s) => s.ab === stateAb);
  if (!state) return { tx: 0, ty: 0, scale: 1 };
  const { minX, minY, maxX, maxY } = pathBoundingBox(state.d);
  const w = maxX - minX;
  const h = maxY - minY;
  if (!w || !h) return { tx: 0, ty: 0, scale: 1 };
  const scale = Math.min((VIEW_W / w) * 0.7, (VIEW_H / h) * 0.7, 6);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const tx = VIEW_W / 2 - scale * cx;
  const ty = VIEW_H / 2 - scale * cy;
  return { tx, ty, scale };
}

export default function TripMap({ points, idx, onPick, carPoint, selectedStateAb, onStateClick }) {
  const seq = points;
  // `carPoint` (position GPS projetée) pilote uniquement le rendu de la
  // voiture ; `idx` continue de piloter la route "visitée"/étoiles (calendrier).
  const cur = carPoint || seq[idx] || seq[0];
  const [hover, setHover] = useState(null);
  const linePts = [CHI, ...seq];
  const dLine = "M " + linePts.map((p) => `${p.x},${p.y}`).join(" L ");
  const visitedPts = [CHI, ...seq.slice(0, idx + 1)];
  const dVisited = "M " + visitedPts.map((p) => `${p.x},${p.y}`).join(" L ");
  const hp = hover != null ? seq[hover] : null;

  const { tx, ty, scale } = useMemo(() => computeZoomTransform(selectedStateAb), [selectedStateAb]);
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        background: "linear-gradient(160deg,#0e1838,#0a1130)",
        border: "1px solid #2a3c6e",
        borderRadius: 14,
        padding: "12px 10px 8px",
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 30px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#d4af37",
          textTransform: "uppercase",
          letterSpacing: 2,
          fontWeight: 700,
          padding: "2px 6px 8px",
        }}
      >
        ★ Mon parcours
      </div>
      <div style={{ position: "relative", ...(isMobile ? { aspectRatio: "4 / 3", overflow: "hidden", borderRadius: 8 } : {}) }}>
        <svg
          viewBox="0 0 900 560"
          preserveAspectRatio={isMobile ? "xMidYMid slice" : "xMidYMid meet"}
          style={{ width: "100%", height: isMobile ? "100%" : "auto", display: "block", borderRadius: 8, overflow: "hidden" }}
        >
          <defs>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0c1738" />
              <stop offset="1" stopColor="#080e22" />
            </linearGradient>
            <linearGradient id="landOn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9a23e" />
              <stop offset="0.5" stopColor="#a5812c" />
              <stop offset="1" stopColor="#82631f" />
            </linearGradient>
            <linearGradient id="landOff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1c2c58" />
              <stop offset="1" stopColor="#152144" />
            </linearGradient>
            <linearGradient id="routeGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f0d066" />
              <stop offset="1" stopColor="#c8992e" />
            </linearGradient>
            <filter id="landShadow" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#000" floodOpacity="0.55" />
            </filter>
            <filter id="goldGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#d4af37" floodOpacity="0.55" />
            </filter>
          </defs>
          <rect x="0" y="0" width="900" height="560" fill="url(#sea)" />
          <g
            style={{
              transform: `translate(${tx}px,${ty}px) scale(${scale})`,
              transformOrigin: "0 0",
              transition: "transform 0.6s ease",
            }}
          >
            <g filter="url(#landShadow)">
              {STATES.map((st, i) => (
                <path key={"base" + i} d={st.d} fill="#0f1a3c" stroke="none" />
              ))}
            </g>
            {STATES.map((st, i) => {
              const isHoverState = hp && hp.st === st.ab;
              const isSelected = selectedStateAb === st.ab;
              const dimmed = selectedStateAb && !isSelected;
              return (
                <path
                  key={i}
                  d={st.d}
                  onClick={() => onStateClick && onStateClick(st.ab)}
                  fill={st.on ? (isHoverState ? "#e6c25a" : "url(#landOn)") : "url(#landOff)"}
                  stroke={isSelected ? "#fff8e0" : st.on ? "#f0d066" : "#31437a"}
                  strokeWidth={isSelected ? 2 : st.on ? 1.2 : 0.8}
                  filter={st.on ? "url(#goldGlow)" : undefined}
                  opacity={dimmed ? 0.25 : 1}
                  style={{ cursor: onStateClick ? "pointer" : "default", transition: "opacity 0.4s ease" }}
                />
              );
            })}
            {STATES.filter((st) => st.on).map((st, i) => (
              <text
                key={"l" + i}
                x={st.cx}
                y={st.cy}
                textAnchor="middle"
                fontSize="18"
                fontWeight="800"
                fill={hp && hp.st === st.ab ? "#fff8e0" : "#3a2c08"}
                style={{ pointerEvents: "none" }}
              >
                {st.ab}
              </text>
            ))}
            <path
              d={dLine}
              fill="none"
              stroke="#3a4a80"
              strokeWidth="2.5"
              strokeDasharray="6 7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d={dVisited}
              fill="none"
              stroke="url(#routeGold)"
              strokeWidth="4.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#goldGlow)"
            />
            <g>
              <circle cx={CHI.x} cy={CHI.y} r="8.5" fill="#f0d066" stroke="#0a1130" strokeWidth="2.5" />
              <text
                x={CHI.x}
                y={CHI.y - 13}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#f0d066"
                style={{ pointerEvents: "none" }}
              >
                Start
              </text>
            </g>
            {seq.map((p, i) => {
              const visited = i < idx;
              const isNextStop = i === idx;
              const isHover = hover === i;
              return (
                <g
                  key={i}
                  onClick={() => {
                    if (hover === i) {
                      onPick(i);
                    } else {
                      setHover(i);
                    }
                  }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                  style={{ cursor: "pointer" }}
                >
                  {isHover && <circle cx={p.x} cy={p.y} r="15" fill="rgba(212,175,55,.22)" />}
                  {isNextStop && (
                    <circle cx={p.x} cy={p.y} r="16" fill="rgba(46,140,255,.25)">
                      <animate attributeName="r" values="13;18;13" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values=".8;.2;.8" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHover ? 13 : isNextStop ? 12 : visited ? 11 : 8.5}
                    fill={isNextStop ? "#2e8cff" : visited ? "#16305f" : "#101a3a"}
                    stroke={isHover ? "#f0d066" : isNextStop ? "#bfe0ff" : visited ? "#d4af37" : "#4a5a88"}
                    strokeWidth={isHover ? 3.5 : isNextStop ? 3 : 3}
                  />
                  {visited && (
                    <text
                      x={p.x}
                      y={p.y + 5.5}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="800"
                      fill="#f0d066"
                      style={{ pointerEvents: "none" }}
                    >
                      ★
                    </text>
                  )}
                </g>
              );
            })}
            <g
              transform={`translate(${cur.x},${cur.y})`}
              style={{ cursor: "pointer" }}
              onClick={() => onPick(idx)}
              onMouseEnter={() => setHover(idx)}
              onMouseLeave={() => setHover((h) => (h === idx ? null : h))}
            >
              <circle r="20" fill="rgba(224,31,16,.18)">
                <animate attributeName="r" values="17;24;17" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <g transform="translate(-17,-17)">
                <foreignObject x="0" y="0" width="34" height="34" style={{ overflow: "visible" }}>
                  <div style={{ width: 34, height: 34 }}>
                    <CarIcon size={34} />
                  </div>
                </foreignObject>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

import { useState } from "react";
import { C } from "../../styles/theme";
import Card from "../ui/Card";

function round(n) {
  if (n === "" || n === null || Number.isNaN(n)) return "";
  return Math.round(n * 1000) / 1000;
}

// Convertisseur bidirectionnel générique : `toB`/`toA` peuvent être une simple
// formule linéaire (facteur), affine (température) ou inverse (consommation).
export default function LinearConverter({ title, unitA, unitB, toB, toA }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  function changeA(v) {
    setA(v);
    const n = parseFloat(v);
    setB(v === "" || Number.isNaN(n) ? "" : String(round(toB(n))));
  }
  function changeB(v) {
    setB(v);
    const n = parseFloat(v);
    setA(v === "" || Number.isNaN(n) ? "" : String(round(toA(n))));
  }

  return (
    <Card>
      <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            inputMode="decimal"
            value={a}
            onChange={(e) => changeA(e.target.value)}
            placeholder="0"
            style={{ width: "100%", background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.gold, fontSize: 15, fontWeight: 600 }}
          />
          <div style={{ fontSize: 11, color: C.dim, marginTop: 4, textAlign: "center" }}>{unitA}</div>
        </div>
        <div style={{ color: C.dim, fontSize: 16 }}>⇄</div>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            inputMode="decimal"
            value={b}
            onChange={(e) => changeB(e.target.value)}
            placeholder="0"
            style={{ width: "100%", background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.gold, fontSize: 15, fontWeight: 600 }}
          />
          <div style={{ fontSize: 11, color: C.dim, marginTop: 4, textAlign: "center" }}>{unitB}</div>
        </div>
      </div>
    </Card>
  );
}

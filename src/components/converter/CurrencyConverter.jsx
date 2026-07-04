import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { C } from "../../styles/theme";
import Card from "../ui/Card";
import { loadSettings } from "../../services/settingsService";

export default function CurrencyConverter() {
  const [rate, setRate] = useState(0.92);
  const [usd, setUsd] = useState("");
  const [eur, setEur] = useState("");

  useEffect(() => {
    loadSettings().then((s) => setRate(s.usdToEur));
  }, []);

  function changeUsd(v) {
    setUsd(v);
    const n = parseFloat(v);
    setEur(v === "" || Number.isNaN(n) ? "" : String(Math.round(n * rate * 100) / 100));
  }
  function changeEur(v) {
    setEur(v);
    const n = parseFloat(v);
    setUsd(v === "" || Number.isNaN(n) ? "" : String(Math.round((n / rate) * 100) / 100));
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: C.cream, fontWeight: 700 }}>Dollars ⇄ Euros</div>
        <Link to="/settings" style={{ fontSize: 11, color: C.dim, textDecoration: "none" }}>
          1 $ = {rate} € · modifier
        </Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            inputMode="decimal"
            value={usd}
            onChange={(e) => changeUsd(e.target.value)}
            placeholder="0"
            style={{ width: "100%", background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.gold, fontSize: 15, fontWeight: 600 }}
          />
          <div style={{ fontSize: 11, color: C.dim, marginTop: 4, textAlign: "center" }}>USD ($)</div>
        </div>
        <div style={{ color: C.dim, fontSize: 16 }}>⇄</div>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            inputMode="decimal"
            value={eur}
            onChange={(e) => changeEur(e.target.value)}
            placeholder="0"
            style={{ width: "100%", background: "#0a1130", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 11px", color: C.gold, fontSize: 15, fontWeight: 600 }}
          />
          <div style={{ fontSize: 11, color: C.dim, marginTop: 4, textAlign: "center" }}>EUR (€)</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: C.dim, marginTop: 8, textAlign: "center" }}>
        Taux saisi manuellement (hors-ligne) — vérifie le taux réel avant de convertir de grosses sommes.
      </div>
    </Card>
  );
}

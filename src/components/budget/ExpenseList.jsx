import { useState } from "react";
import { C } from "../../styles/theme";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import EmptyState from "../ui/EmptyState";
import { SPEND_CATS } from "../../utils/spend";

const PAYER_META = {
  marouane: { label: "Marouane", color: C.gold },
  isabelle: { label: "Isabelle", color: "#c3a6e8" },
  shared_card: { label: "Carte commune", color: "#3a8f5c" },
};

const FILTERS = [
  { value: "all", label: "Tous" },
  { value: "marouane", label: "Marouane" },
  { value: "isabelle", label: "Isabelle" },
];

function categoryEmoji(key) {
  return SPEND_CATS.find(([k]) => k === key)?.[1] || "🔧";
}

export default function ExpenseList({ expenses, onDelete }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? expenses : expenses.filter((e) => e.paidBy === filter);
  const sorted = [...filtered].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              background: filter === f.value ? C.gold : C.accent,
              color: filter === f.value ? "#1a1200" : C.cream,
              border: `1px solid ${C.line}`,
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: filter === f.value ? 700 : 500,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon="💳" text="Aucune dépense pour ce filtre." />
      ) : (
        sorted.map((e) => {
        const payer = PAYER_META[e.paidBy];
        return (
          <Card key={e.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 18 }}>{categoryEmoji(e.category)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: C.cream, fontWeight: 600 }}>{e.title || "(sans titre)"}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 3, flexWrap: "wrap" }}>
                <Pill label={payer.label} color={payer.color} />
                <span style={{ fontSize: 11, color: C.dim }}>{e.split === "shared" ? "Partagé" : "Personnel"}</span>
                <span style={{ fontSize: 11, color: C.dim }}>· {e.date}</span>
              </div>
              {e.note && <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>{e.note}</div>}
            </div>
            <div style={{ fontSize: 15, color: C.gold, fontWeight: 700, flexShrink: 0 }}>${Math.round(e.amount)}</div>
            <button
              onClick={() => onDelete(e.id)}
              style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 14, flexShrink: 0 }}
            >
              ✕
            </button>
          </Card>
        );
        })
      )}
    </div>
  );
}

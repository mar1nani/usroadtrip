import { useState } from "react";
import { C } from "../../styles/theme";
import TextField from "../ui/TextField";
import Select from "../ui/Select";
import { SPEND_CATS } from "../../utils/spend";
import { emptyExpense, addExpense } from "../../services/expensesService";

const PAYERS = [
  { value: "marouane", label: "Marouane" },
  { value: "isabelle", label: "Isabelle" },
  { value: "shared_card", label: "Carte commune" },
];

export default function ExpenseForm({ onAdded }) {
  const [form, setForm] = useState(emptyExpense());

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // La carte commune est toujours partagée (verrouillé) ; pour un paiement
  // personnel, la case reste modifiable — c'est justement le cas qui crée une dette.
  function setPaidBy(paidBy) {
    setForm((f) => ({
      ...f,
      paidBy,
      split: paidBy === "shared_card" ? "shared" : f.paidBy === "shared_card" ? "personal" : f.split,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    const next = await addExpense({ ...form, amount: parseFloat(form.amount) || 0 });
    onAdded(next);
    setForm(emptyExpense());
  }

  const isCard = form.paidBy === "shared_card";

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
        <TextField label="Titre" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Essence, Hôtel..." />
        <TextField label="Montant ($)" type="number" inputMode="decimal" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0" />
      </div>

      <Select
        label="Catégorie"
        value={form.category}
        onChange={(e) => set("category", e.target.value)}
        options={SPEND_CATS.map(([k, emo, lbl]) => ({ value: k, label: `${emo} ${lbl}` }))}
      />

      <div>
        <div style={{ fontSize: 12, color: C.dim, marginBottom: 6 }}>Payé par</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PAYERS.map((p) => (
            <button
              type="button"
              key={p.value}
              onClick={() => setPaidBy(p.value)}
              style={{
                background: form.paidBy === p.value ? C.gold : C.accent,
                color: form.paidBy === p.value ? "#1a1200" : C.cream,
                border: `1px solid ${C.line}`,
                borderRadius: 20,
                padding: "7px 14px",
                fontSize: 12.5,
                fontWeight: form.paidBy === p.value ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.cream, opacity: isCard ? 0.6 : 1 }}>
        <input
          type="checkbox"
          checked={form.split === "shared"}
          disabled={isCard}
          onChange={(e) => set("split", e.target.checked ? "shared" : "personal")}
        />
        {isCard
          ? "Partagée 50/50 (carte commune)"
          : `Partager 50/50 avec ${form.paidBy === "marouane" ? "Isabelle" : "Marouane"}`}
      </label>

      <TextField label="Note (optionnel)" value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Détail..." />

      <button
        type="submit"
        style={{ background: `linear-gradient(135deg,${C.gold},#9a7420)`, border: "none", borderRadius: 9, padding: "11px 16px", color: "#1a1200", fontWeight: 700, cursor: "pointer" }}
      >
        + Ajouter la dépense
      </button>
    </form>
  );
}

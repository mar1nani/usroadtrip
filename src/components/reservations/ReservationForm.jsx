import { useState } from "react";
import TextField from "../ui/TextField";
import Select from "../ui/Select";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "../../utils/reservationOptions";
import { C } from "../../styles/theme";

export default function ReservationForm({ initial, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(initial);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <TextField label="Nom" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Camping Madison" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Select
          label="Catégorie"
          options={CATEGORY_OPTIONS}
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        />
        <Select
          label="Statut"
          options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <TextField label="Date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        <TextField label="Heure" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} />
      </div>
      <TextField label="Ville" value={form.city} onChange={(e) => set("city", e.target.value)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <TextField label="Confirmation" value={form.confirmation} onChange={(e) => set("confirmation", e.target.value)} />
        <TextField label="Téléphone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <TextField label="Lien" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." />
        <TextField label="Prix ($)" value={form.price} onChange={(e) => set("price", e.target.value)} />
      </div>
      <TextField label="Notes" textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} />

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          onClick={() => onSave(form)}
          style={{
            flex: 1,
            background: `linear-gradient(135deg,${C.gold},#9a7420)`,
            border: "none",
            borderRadius: 9,
            padding: 11,
            color: "#1a1200",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Enregistrer
        </button>
        <button
          onClick={onCancel}
          style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 9, padding: "11px 16px", color: C.cream, cursor: "pointer" }}
        >
          Annuler
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{ background: "none", border: `1px solid ${C.red}`, borderRadius: 9, padding: "11px 16px", color: C.red, cursor: "pointer" }}
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { C } from "../styles/theme";
import Card from "../components/ui/Card";
import Pill from "../components/ui/Pill";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ReservationForm from "../components/reservations/ReservationForm";
import {
  loadReservations,
  upsertReservation,
  deleteReservation,
  emptyReservation,
} from "../services/reservationsService";
import { categoryLabel, statusMeta } from "../utils/reservationOptions";
import { usePermissions } from "../hooks/usePermissions";
import RestrictedNotice from "../components/auth/RestrictedNotice";

const SORTERS = {
  date: (a, b) => (a.date || "").localeCompare(b.date || ""),
  category: (a, b) => a.category.localeCompare(b.category),
  status: (a, b) => a.status.localeCompare(b.status),
};
const SORT_LABELS = [
  ["date", "Date"],
  ["category", "Catégorie"],
  ["status", "Statut"],
];

export default function ReservationsPage() {
  const [list, setList] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [editing, setEditing] = useState(null);
  const { canSeeReservations } = usePermissions();

  useEffect(() => {
    loadReservations().then(setList);
  }, []);

  if (!canSeeReservations) return <RestrictedNotice />;
  if (!list) return <LoadingState />;

  const pendingCount = list.filter((r) => r.status === "a_reserver").length;
  const sorted = [...list].sort(SORTERS[sortBy]);
  const isNew = editing && !list.some((r) => r.id === editing.id);

  async function handleSave(reservation) {
    const next = await upsertReservation(reservation);
    setList(next);
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette réservation ?")) return;
    const next = await deleteReservation(id);
    setList(next);
    setEditing(null);
  }

  async function toggleStatus(r) {
    const nextStatus = r.status === "reserve" ? "a_reserver" : "reserve";
    const next = await upsertReservation({ ...r, status: nextStatus });
    setList(next);
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, color: C.gold, fontWeight: 700 }}>📋 Réservations</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{pendingCount} à réserver</div>
        </div>
        <button
          onClick={() => setEditing(emptyReservation())}
          style={{ background: `linear-gradient(135deg,${C.gold},#9a7420)`, border: "none", borderRadius: 9, padding: "10px 16px", color: "#1a1200", fontWeight: 700, cursor: "pointer" }}
        >
          + Ajouter
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: C.dim, alignSelf: "center" }}>Trier par :</span>
        {SORT_LABELS.map(([k, lbl]) => (
          <button
            key={k}
            onClick={() => setSortBy(k)}
            style={{
              background: sortBy === k ? C.gold : C.accent,
              color: sortBy === k ? "#1a1200" : C.cream,
              border: `1px solid ${C.line}`,
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: sortBy === k ? 700 : 500,
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {sorted.map((r) => {
          const meta = statusMeta(r.status);
          return (
            <Card
              key={r.id}
              style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
              onClick={() => setEditing(r)}
            >
              <div style={{ fontSize: 22 }}>{categoryLabel(r.category).split(" ")[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: C.cream, fontWeight: 600 }}>{r.name || "(sans nom)"}</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>
                  {r.date || "Date à définir"} {r.time && `· ${r.time}`} {r.city && `· ${r.city}`}
                </div>
              </div>
              <Pill label={meta.label} color={meta.color} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus(r);
                }}
                title={r.status === "reserve" ? "Marquer à réserver" : "Marquer réservé"}
                style={{ background: C.accent, border: `1px solid ${C.line}`, borderRadius: 8, width: 34, height: 34, color: C.cream, cursor: "pointer", fontSize: 15 }}
              >
                {r.status === "reserve" ? "↺" : "✓"}
              </button>
            </Card>
          );
        })}
        {sorted.length === 0 && <EmptyState icon="📋" text="Aucune réservation pour l'instant." />}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Nouvelle réservation" : "Modifier la réservation"}>
        {editing && (
          <ReservationForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            onDelete={!isNew ? () => handleDelete(editing.id) : undefined}
          />
        )}
      </Modal>
    </div>
  );
}

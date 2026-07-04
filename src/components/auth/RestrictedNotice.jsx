import { C } from "../../styles/theme";

export default function RestrictedNotice() {
  return (
    <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center", padding: 20 }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
      <div style={{ fontSize: 16, color: C.gold, fontWeight: 700, marginBottom: 6 }}>Réservé aux voyageurs</div>
      <div style={{ fontSize: 13, color: C.dim }}>Cette section n'est pas disponible en mode invité.</div>
    </div>
  );
}

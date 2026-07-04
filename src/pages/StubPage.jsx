import { C } from "../styles/theme";

export default function StubPage({ title, icon }) {
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", textAlign: "center", padding: 20 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 20, color: C.gold, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, color: C.dim }}>Bientôt disponible.</div>
    </div>
  );
}

import { C } from "../../styles/theme";

export default function EmptyState({ icon = "🗒️", text }) {
  return (
    <div style={{ textAlign: "center", color: C.dim, fontSize: 13, padding: "40px 20px" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      {text}
    </div>
  );
}

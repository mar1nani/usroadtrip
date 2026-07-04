import { C } from "../../styles/theme";

export default function SectionTitle({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <div
        style={{
          fontSize: 12,
          color: C.gold,
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 700,
        }}
      >
        {children}
      </div>
      {right && <div style={{ fontSize: 12, color: C.dim }}>{right}</div>}
    </div>
  );
}

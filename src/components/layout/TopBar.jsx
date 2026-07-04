import { C } from "../../styles/theme";

export default function TopBar({ onMenuClick, title }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(10,17,48,.96)",
        backdropFilter: "blur(6px)",
        borderBottom: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
      }}
    >
      <button className="app-topbar-menu-btn" onClick={onMenuClick} aria-label="Ouvrir le menu">
        ☰
      </button>
      <div style={{ fontSize: 14, color: C.gold, fontWeight: 700 }}>{title}</div>
    </div>
  );
}

export default function Pill({ label, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 800,
        color,
        background: `${color}22`,
        border: `1px solid ${color}66`,
        borderRadius: 20,
        padding: "3px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

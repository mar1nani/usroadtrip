export default function Stars({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange(i === value ? 0 : i)}
          style={{
            cursor: "pointer",
            fontSize: 20,
            color: i <= value ? "#f5c518" : "#444",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

import { C } from "../../styles/theme";

export default function Select({ label, options, style, ...rest }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: C.dim }}>
      {label}
      <select
        style={{
          background: "#0a1130",
          border: `1px solid ${C.line}`,
          borderRadius: 8,
          padding: "9px 11px",
          color: C.cream,
          fontSize: 14,
          ...style,
        }}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

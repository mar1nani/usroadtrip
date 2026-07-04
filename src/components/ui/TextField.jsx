import { C } from "../../styles/theme";

export default function TextField({ label, style, textarea, ...rest }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: C.dim }}>
      {label}
      <Tag
        style={{
          background: "#0a1130",
          border: `1px solid ${C.line}`,
          borderRadius: 8,
          padding: "9px 11px",
          color: C.cream,
          fontSize: 14,
          resize: textarea ? "vertical" : undefined,
          minHeight: textarea ? 70 : undefined,
          ...style,
        }}
        {...rest}
      />
    </label>
  );
}

import { C } from "../../styles/theme";

export default function Card({ children, style, ...rest }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 12,
        padding: 16,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

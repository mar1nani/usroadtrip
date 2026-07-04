import { C } from "../../styles/theme";
import Card from "../ui/Card";
import { computeExpenseBalance } from "../../utils/expenseBalance";

const NAME = { marouane: "Marouane", isabelle: "Isabelle" };

export default function ExpenseSummary({ expenses }) {
  const { totalMarouane, totalIsabelle, sharedCardTotal, sharedCardEach, balance } = computeExpenseBalance(expenses);

  return (
    <Card>
      <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>Résumé</div>
      <div style={{ display: "grid", gap: 6, fontSize: 12.5, color: C.cream }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total Marouane</span>
          <span style={{ fontWeight: 700, color: C.gold }}>${Math.round(totalMarouane)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total Isabelle</span>
          <span style={{ fontWeight: 700, color: C.gold }}>${Math.round(totalIsabelle)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Carte commune</span>
          <span style={{ fontWeight: 700, color: C.gold }}>
            ${Math.round(sharedCardTotal)} <span style={{ color: C.dim, fontWeight: 400 }}>(${Math.round(sharedCardEach)} chacun)</span>
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: `1px solid ${C.line}`,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 700,
          color: balance.amount > 0 ? C.gold : "#3a8f5c",
        }}
      >
        {balance.amount > 0
          ? `${NAME[balance.owedBy]} doit à ${NAME[balance.owedTo]} : $${Math.round(balance.amount)}`
          : "✓ Comptes équilibrés"}
      </div>
    </Card>
  );
}

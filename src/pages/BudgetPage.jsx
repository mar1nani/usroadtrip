import { useEffect, useState } from "react";
import DAYS from "../data/days.json";
import { C } from "../styles/theme";
import Card from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import { SPEND_CATS, BUDGET_PLAN, computeSpendByCat, computeSpendTotal, ALL_SPEND_DAYS } from "../utils/spend";
import { loadDayProgress } from "../services/dayProgressService";
import { loadExpenses, deleteExpense } from "../services/expensesService";
import { usePermissions } from "../hooks/usePermissions";
import RestrictedNotice from "../components/auth/RestrictedNotice";
import ExpenseForm from "../components/budget/ExpenseForm";
import ExpenseList from "../components/budget/ExpenseList";
import ExpenseSummary from "../components/budget/ExpenseSummary";

// Additionne les 3 scopes (shared/marouane/isabelle), avec repli sur l'ancien
// format plat — même logique que computeSpendByCat.
function dayTotal(progress, day) {
  const spend = (progress["d" + day.n] || {}).spend;
  if (!spend) return 0;
  const isScoped = "shared" in spend || "marouane" in spend || "isabelle" in spend;
  const buckets = isScoped ? [spend.shared, spend.marouane, spend.isabelle] : [spend];
  return buckets.reduce((total, sp) => {
    if (!sp) return total;
    return total + SPEND_CATS.reduce((s, [k]) => s + (parseFloat(sp[k]) || 0), 0);
  }, 0);
}

export default function BudgetPage() {
  const [progress, setProgress] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const { canSeeBudget } = usePermissions();

  useEffect(() => {
    loadDayProgress().then(setProgress);
    loadExpenses().then(setExpenses);
  }, []);

  if (!canSeeBudget) return <RestrictedNotice />;
  if (!progress || !expenses) return <LoadingState />;

  async function handleDelete(id) {
    const next = await deleteExpense(id);
    setExpenses(next);
  }

  const spendByCat = computeSpendByCat(progress, ALL_SPEND_DAYS);
  const spendTotal = computeSpendTotal(spendByCat);
  const spendPct = Math.min(Math.round((spendTotal / BUDGET_PLAN) * 100), 100);
  const remaining = Math.max(BUDGET_PLAN - Math.round(spendTotal), 0);

  const dayTotals = DAYS.map((d) => ({ day: d, total: dayTotal(progress, d) }));
  const maxDayTotal = Math.max(...dayTotals.map((d) => d.total), 1);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <div style={{ fontSize: 18, color: C.gold, fontWeight: 700, marginBottom: 16 }}>💰 Budget</div>

      <div style={{ fontSize: 13, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 10 }}>
        💳 Budget partagé
      </div>
      <div style={{ display: "grid", gap: 14, marginBottom: 22 }}>
        <Card>
          <ExpenseForm onAdded={setExpenses} />
        </Card>
        <ExpenseSummary expenses={expenses} />
        <ExpenseList expenses={expenses} onDelete={handleDelete} />
      </div>

      <div style={{ fontSize: 13, color: C.gold, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 10 }}>
        📊 Budget global (par jour)
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div style={{ fontSize: 14, color: C.cream, fontWeight: 700 }}>Total dépensé</div>
          <div style={{ fontSize: 26, color: C.gold, fontWeight: 800 }}>${Math.round(spendTotal).toLocaleString()}</div>
        </div>
        <div style={{ fontSize: 11, color: C.dim, marginBottom: 10 }}>
          sur un budget prévu de ~${BUDGET_PLAN.toLocaleString()} · {spendPct}% utilisé · reste ~${remaining.toLocaleString()}
        </div>
        <div style={{ background: "#0a1130", borderRadius: 20, height: 12, overflow: "hidden", border: "1px solid #1e2f5a" }}>
          <div
            style={{
              width: spendPct + "%",
              height: "100%",
              background: spendPct >= 100 ? `linear-gradient(90deg,${C.red},#e0542a)` : `linear-gradient(90deg,#a5812c,${C.gold},#f0d066)`,
              borderRadius: 20,
              transition: "width .5s",
            }}
          />
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>Répartition par catégorie</div>
        <div style={{ display: "grid", gap: 8 }}>
          {SPEND_CATS.map(([k, emo, lbl]) => {
            const v = spendByCat[k];
            const barPct = spendTotal > 0 ? Math.round((v / spendTotal) * 100) : 0;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, width: 22 }}>{emo}</span>
                <span style={{ fontSize: 12, color: C.dim, width: 70 }}>{lbl}</span>
                <div style={{ flex: 1, background: "#0a1130", borderRadius: 8, height: 8, overflow: "hidden" }}>
                  <div style={{ width: barPct + "%", height: "100%", background: C.gold, borderRadius: 8 }} />
                </div>
                <span style={{ fontSize: 13, color: C.cream, fontWeight: 600, width: 54, textAlign: "right" }}>
                  ${Math.round(v)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 13, color: C.cream, fontWeight: 700, marginBottom: 10 }}>Dépenses par jour</div>
        <div style={{ display: "grid", gap: 5 }}>
          {dayTotals.map(({ day, total }) => (
            <div key={day.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: C.dim, width: 30 }}>J{day.n}</span>
              <span style={{ fontSize: 11, color: C.dim, width: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {day.to}
              </span>
              <div style={{ flex: 1, background: "#0a1130", borderRadius: 6, height: 7, overflow: "hidden" }}>
                <div style={{ width: `${(total / maxDayTotal) * 100}%`, height: "100%", background: total > 0 ? C.gold : "transparent", borderRadius: 6 }} />
              </div>
              <span style={{ fontSize: 11, color: C.cream, width: 44, textAlign: "right" }}>${Math.round(total)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

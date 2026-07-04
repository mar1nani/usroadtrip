import { useEffect, useState } from "react";
import DAYS from "../data/days.json";
import { C } from "../styles/theme";
import Card from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import MetricHint from "../components/ui/MetricHint";
import { useTripProgress } from "../hooks/useTripProgress";
import RoleGuard from "../components/auth/RoleGuard";
import { countTotalStops, countDoneStops, countDaysStarted } from "../utils/progress";
import { computeSpendByCat, computeSpendTotal, BUDGET_PLAN, ALL_SPEND_DAYS } from "../utils/spend";
import { loadDayProgress } from "../services/dayProgressService";

function StatCard({ label, value, sub }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, color: C.gold, fontWeight: 800 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

export default function StatisticsPage() {
  const [progress, setProgress] = useState(null);
  const { effectiveIndex, loading } = useTripProgress();

  useEffect(() => {
    loadDayProgress().then(setProgress);
  }, []);

  if (!progress || loading) return <LoadingState />;

  const totalStops = countTotalStops(DAYS);
  const doneStops = countDoneStops(progress, DAYS);
  const pct = totalStops ? Math.round((doneStops / totalStops) * 100) : 0;
  const daysStarted = countDaysStarted(progress, DAYS);

  const totalDistance = DAYS.reduce((s, d) => s + d.miles, 0);
  // Seuls les jours strictement dépassés comptent comme "parcourus" — avant
  // le départ (ou pendant le Jour 1 lui-même), la distance parcourue est 0.
  const distanceSoFar = DAYS.filter((_, i) => i < effectiveIndex).reduce((s, d) => s + d.miles, 0);

  const spendByCat = computeSpendByCat(progress, ALL_SPEND_DAYS);
  const spendTotal = computeSpendTotal(spendByCat);

  const ratings = ALL_SPEND_DAYS.map((d) => (progress["d" + d.n] || {}).rating || 0).filter((r) => r > 0);
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20 }}>
      <div style={{ fontSize: 18, color: C.gold, fontWeight: 700, marginBottom: 16 }}>📊 Statistiques</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        <StatCard label="Progression" value={`${pct}%`} sub={`${doneStops} / ${totalStops} lieux visités`} />
        <StatCard label="Jours entamés" value={`${daysStarted} / 22`} sub={`Étape actuelle : jour ${effectiveIndex + 1}`} />
        <StatCard
          label="Distance"
          value={
            <>
              {distanceSoFar.toLocaleString()} mi <MetricHint miles={distanceSoFar} />
            </>
          }
          sub={`sur ${totalDistance.toLocaleString()} mi au total`}
        />
        <RoleGuard allow={["marouane", "isabelle"]}>
          <StatCard
            label="Dépenses"
            value={`$${Math.round(spendTotal).toLocaleString()}`}
            sub={`sur ~$${BUDGET_PLAN.toLocaleString()} prévus`}
          />
        </RoleGuard>
        <StatCard
          label="Note moyenne"
          value={avgRating ? `${avgRating} ★` : "—"}
          sub={ratings.length ? `sur ${ratings.length} jour${ratings.length > 1 ? "s" : ""} noté${ratings.length > 1 ? "s" : ""}` : "Aucun jour noté pour l'instant"}
        />
      </div>
    </div>
  );
}
